import { resolver } from "blitz"
import db, { UserRole } from "db"
import { z } from "zod"

const CreateAccount = z.object({
  name: z.string(),
})

export default resolver.pipe(
  resolver.zod(CreateAccount),
  resolver.authorize(),
  async (input, { session }) => {
    console.log(session.role)
    if (session.role !== UserRole.SUPER) {
      throw new Error("INVALID USER PERMISSIONS FOR THIS OPERATION")
    }

    const account = await db.account.create({ data: input })

    return account
  }
)
