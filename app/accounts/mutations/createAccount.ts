import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const CreateAccount = z.object({
  name: z.string(),
})

export default resolver.pipe(resolver.zod(CreateAccount), resolver.authorize(), async (input) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const account = await db.account.create({ data: input })

  return account
})
