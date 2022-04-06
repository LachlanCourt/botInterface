import { resolver } from "blitz"
import db, { UserRole } from "db"
import { z } from "zod"

const UpdateAccount = z.object({
  id: z.number(),
  name: z.string(),
})

export default resolver.pipe(
  resolver.zod(UpdateAccount),
  resolver.authorize(),
  async ({ id, ...data }, { session }) => {
    if (
      session.role === UserRole.SUPER ||
      (session.role === UserRole.ADMIN && session.accountId === id)
    ) {
      const account = await db.account.update({ where: { id }, data })
      return account
    } else {
      throw new Error("INVALID USER PERMISSIONS FOR THIS OPERATION")
    }
  }
)
