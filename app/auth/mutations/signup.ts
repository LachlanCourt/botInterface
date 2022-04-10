import { resolver, SecurePassword, generateToken, hash256 } from "blitz"
import db, { UserRole } from "db"
import { forgotPasswordMailer } from "mailers/forgotPasswordMailer"
import { Signup } from "app/auth/validations"

const RESET_PASSWORD_TOKEN_EXPIRATION_IN_HOURS = 4

export default resolver.pipe(resolver.zod(Signup), async ({ email, role }, ctx) => {
  // Password will be initialised as a random token, and then users sent an email to reset it
  const hashedPassword = await SecurePassword.hash(generateToken().trim())
  const user = await db.user.create({
    data: {
      email: email.toLowerCase().trim(),
      hashedPassword,
      role: role,
      accountId: ctx.session.impersonatedId,
    },
    select: { id: true, name: true, email: true, role: true, accountId: true },
  })

  if (user) {
    const token = generateToken()
    const hashedToken = hash256(token)
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + RESET_PASSWORD_TOKEN_EXPIRATION_IN_HOURS)

    // 4. Delete any existing password reset tokens
    await db.token.deleteMany({ where: { type: "RESET_PASSWORD", userId: user.id } })
    // 5. Save this new token in the database.
    await db.token.create({
      data: {
        user: { connect: { id: user.id } },
        type: "RESET_PASSWORD",
        expiresAt,
        hashedToken,
        sentTo: user.email,
      },
    })
    // 6. Send the email
    await forgotPasswordMailer({ to: user.email, token }).send()
  } else {
    // 7. If no user found wait the same time so attackers can't tell the difference
    await new Promise((resolve) => setTimeout(resolve, 750))
  }

  return user
})
