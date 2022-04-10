import { Suspense } from "react"
import { Head, Link, useRouter, useQuery, useParam, BlitzPage, useMutation, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getAccount from "app/accounts/queries/getAccount"
import deleteAccount from "app/accounts/mutations/deleteAccount"

import { Button } from "DesignSystem/components"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import { UserRole } from "db"

export const Account = () => {
  const router = useRouter()
  const accountId = useParam("accountId", "number")
  const [deleteAccountMutation] = useMutation(deleteAccount)
  const [account] = useQuery(getAccount, { id: accountId })
  const user = useCurrentUser()
  const role = user?.role || UserRole.USER

  return (
    <>
      <Head>
        <title>Account {account.name}</title>
      </Head>

      <div>
        <h1>Account {account.name}</h1>
        <pre>{JSON.stringify(account, null, 2)}</pre>
        {role !== UserRole.USER && (
          <>
            <Button variant="solid" colorScheme="blue">
              <Link href={Routes.SignupPage()}>Add New User</Link>
            </Button>
            <Link href={Routes.EditAccountPage({ accountId: account.id })}>
              <a>Edit</a>
            </Link>
            <button
              type="button"
              onClick={async () => {
                if (
                  window.confirm(`Are you sure you want to delete the account "${account.name}"?`)
                ) {
                  await deleteAccountMutation({ id: account.id })
                  router.push(Routes.AccountsPage())
                }
              }}
              style={{ marginLeft: "0.5rem" }}
            >
              Delete
            </button>
          </>
        )}
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
