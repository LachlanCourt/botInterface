import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import { resolver } from "blitz"
import db, { UserRole } from "db"
import { z } from "zod"

const CreateAccount = z.object({
  name: z.string(),
})

export default resolver.pipe(resolver.zod(CreateAccount), resolver.authorize(), async (input) => {
  const user = useCurrentUser()
  let account
  if (user && user.role === UserRole.SUPER) {
    account = await db.account.create({ data: input })
  }

  return account
})
