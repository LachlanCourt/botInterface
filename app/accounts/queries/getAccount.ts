import { resolver, NotFoundError } from "blitz"
import db, { UserRole } from "db"
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
    // Ensure only a user with a correct session ID can access the account, for multitenanting. Bypasss if SUPER user
    const account = await db.account.findFirst({
      where: { id: session.role === UserRole.SUPER ? id : session.accountId },
    })

    if (!account) throw new NotFoundError()

    // If a SUPER user is accessing an account, set the impersonation
    if (session.role === UserRole.SUPER && id) {
      await session.$setPublicData({ impersonatedId: id })
    }

    return account
  }
)
