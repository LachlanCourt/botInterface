import { Suspense } from "react"
import { Head, Link, useRouter, useQuery, useParam, BlitzPage, useMutation, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getAccount from "app/accounts/queries/getAccount"
import deleteAccount from "app/accounts/mutations/deleteAccount"

export const Account = () => {
  const router = useRouter()
  const accountId = useParam("accountId", "number")
  const [deleteAccountMutation] = useMutation(deleteAccount)
  const [account] = useQuery(getAccount, { id: accountId })

  return (
    <>
      <Head>
        <title>Account {account.id}</title>
      </Head>

      <div>
        <h1>Account {account.id}</h1>
        <pre>{JSON.stringify(account, null, 2)}</pre>

        <Link href={Routes.EditAccountPage({ accountId: account.id })}>
          <a>Edit</a>
        </Link>

        <button
          type="button"
          onClick={async () => {
            if (window.confirm("This will be deleted")) {
              await deleteAccountMutation({ id: account.id })
              router.push(Routes.AccountsPage())
            }
          }}
          style={{ marginLeft: "0.5rem" }}
        >
          Delete
        </button>
      </div>
    </>
  )
}

const ShowAccountPage: BlitzPage = () => {
  return (
    <div>
      <p>
        <Link href={Routes.AccountsPage()}>
          <a>Accounts</a>
        </Link>
      </p>

      <Suspense fallback={<div>Loading...</div>}>
        <Account />
      </Suspense>
    </div>
  )
}

ShowAccountPage.authenticate = true
ShowAccountPage.getLayout = (page) => <Layout>{page}</Layout>

export default ShowAccountPage
