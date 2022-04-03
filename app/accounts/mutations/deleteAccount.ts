import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const DeleteAccount = z.object({
  id: z.number(),
})

export default resolver.pipe(resolver.zod(DeleteAccount), resolver.authorize(), async ({ id }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const account = await db.account.deleteMany({ where: { id } })

  return account
})
