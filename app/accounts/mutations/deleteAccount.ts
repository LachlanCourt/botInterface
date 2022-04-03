import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import { resolver } from "blitz"
import db, { UserRole } from "db"
import { z } from "zod"

const DeleteAccount = z.object({
  id: z.number(),
})

export default resolver.pipe(resolver.zod(DeleteAccount), resolver.authorize(), async ({ id }) => {
  const user = useCurrentUser()
  let account
  if (user && user.role === UserRole.SUPER) {
    account = await db.account.deleteMany({ where: { id } })
  }
  return account
})
