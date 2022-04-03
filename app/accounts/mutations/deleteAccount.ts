import { resolver } from "blitz"
import db, { UserRole } from "db"
import { z } from "zod"

const DeleteAccount = z.object({
  id: z.number(),
})

export default resolver.pipe(
  resolver.zod(DeleteAccount),
  resolver.authorize(),
  async ({ id }, { session }) => {
    let account
    if (session.role === UserRole.SUPER) {
      account = await db.account.deleteMany({ where: { id } })
    }
    return account
  }
)
