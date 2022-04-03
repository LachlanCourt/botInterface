import { paginate, resolver } from "blitz"
import db, { Prisma, UserRole } from "db"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"

interface GetAccountsInput
  extends Pick<Prisma.AccountFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetAccountsInput, { session }) => {
    // Restrict query to session account ID, if it is not already done
    if (session.role !== UserRole.SUPER) {
      if (where) {
        where.id = session.accountId
      } else {
        where = { id: session.accountId }
      }
    }
    const {
      items: accounts,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.account.count({ where }),
      query: (paginateArgs) => db.account.findMany({ ...paginateArgs, where, orderBy }),
    })

    return {
      accounts,
      nextPage,
      hasMore,
      count,
    }
  }
)
