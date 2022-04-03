import { useCurrentUser } from "app/core/hooks/useCurrentUser"
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
    let account
    if (
      session.role === UserRole.SUPER ||
      (session.role === UserRole.ADMIN && session.accountId === id)
    ) {
      account = await db.account.update({ where: { id }, data })
    }
    return account
  }
)
