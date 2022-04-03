import { resolver, NotFoundError } from "blitz"
import db from "db"
import { z } from "zod"

import { useCurrentUser } from "app/core/hooks/useCurrentUser"

const GetAccount = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(
  resolver.zod(GetAccount),
  resolver.authorize(),
  async ({ id }, { session }) => {
    let account
    // Ensure only a user with a correct session ID can access the account, for multitenanting
    if (session.accountId === id) {
      account = await db.account.findFirst({ where: { id } })
    }

    if (!account) throw new NotFoundError()

    return account
  }
)
