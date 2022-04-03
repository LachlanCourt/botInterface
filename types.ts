import { DefaultCtx, SessionContext, SimpleRolesIsAuthorized } from "blitz"
import { User, Account, UserRole } from "db"

declare module "blitz" {
  export interface Ctx extends DefaultCtx {
    session: SessionContext
  }
  export interface Session {
    isAuthorized: SimpleRolesIsAuthorized<UserRole>
    PublicData: {
      userId: User["id"]
      role: UserRole
      accountId: Account["id"]
    }
  }
}
