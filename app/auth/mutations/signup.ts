import { resolver, SecurePassword } from "blitz"
import db, { UserRole } from "db"
import { Signup } from "app/auth/validations"

export default resolver.pipe(
  resolver.zod(Signup),
  async ({ email, password, accountId, role = UserRole.USER }, ctx) => {
    const hashedPassword = await SecurePassword.hash(password.trim())
    const user = await db.user.create({
      data: { email: email.toLowerCase().trim(), hashedPassword, role: role, accountId: accountId },
      select: { id: true, name: true, email: true, role: true },
    })
    await ctx.session.$create({
      userId: user.id,
      role: user.role as UserRole,
      accountId: accountId,
    })
    return user
  }
)
