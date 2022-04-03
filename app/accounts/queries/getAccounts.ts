import { paginate, resolver } from "blitz"
import db, { Prisma, UserRole } from "db"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"

interface GetAccountsInput
  extends Pick<Prisma.AccountFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetAccountsInput) => {
    const user = useCurrentUser()
    // Only SUPER users can access all accounts
    if (user && user.role === UserRole.SUPER) {
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
    return {}
  }
)
