import { Suspense } from "react"
import {
  Head,
  Link,
  usePaginatedQuery,
  useRouter,
  BlitzPage,
  Routes,
  GetServerSideProps,
  getSession,
} from "blitz"
import Layout from "app/core/layouts/Layout"
import getAccounts from "app/accounts/queries/getAccounts"
import { UserRole } from "@prisma/client"

const ITEMS_PER_PAGE = 100

export const AccountsList = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const [{ accounts, hasMore }] = usePaginatedQuery(getAccounts, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

  return (
    <div>
      <ul>
        {accounts.map((account) => (
          <li key={account.id}>
            <Link href={Routes.ShowAccountPage({ accountId: account.id })}>
              <a>{account.name}</a>
            </Link>
          </li>
        ))}
      </ul>

      <button disabled={page === 0} onClick={goToPreviousPage}>
        Previous
      </button>
      <button disabled={!hasMore} onClick={goToNextPage}>
        Next
      </button>
    </div>
  )
}

export const Accounts = ({ data }) => {
  const router = useRouter()
  if (!data.role || data.role !== UserRole.SUPER) {
    router.push("/")
    return null
  }
  return (
    <>
      <Head>
        <title>Accounts</title>
      </Head>

      <p>
        <Link href={Routes.NewAccountPage()}>
          <a>Create Account</a>
        </Link>
      </p>
      <AccountsList />
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession(req, res)
  return { props: { data: session.$publicData } }
}

// @ts-ignore
const AccountsPage: BlitzPage = ({ data }) => {
  return (
    <Suspense fallback="Loading">
      <>
        <Accounts data={data} />
      </>
    </Suspense>
  )
}

AccountsPage.authenticate = true
AccountsPage.getLayout = (page) => <Layout>{page}</Layout>

export default AccountsPage
