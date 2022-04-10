import { Suspense } from "react"
import {
  Head,
  Link,
  useRouter,
  useQuery,
  useMutation,
  useParam,
  BlitzPage,
  Routes,
  GetServerSideProps,
  getSession,
} from "blitz"
import Layout from "app/core/layouts/Layout"
import getAccount from "app/accounts/queries/getAccount"
import updateAccount from "app/accounts/mutations/updateAccount"
import { AccountForm, FORM_ERROR } from "app/accounts/components/AccountForm"
import { UserRole } from "@prisma/client"

export const EditAccount = ({ data }) => {
  const router = useRouter()
  const accountId = useParam("accountId", "number")
  const [updateAccountMutation] = useMutation(updateAccount)
  const [account, { setQueryData }] = useQuery(
    getAccount,
    { id: accountId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  )

  if (!data.role || data.role === UserRole.USER) {
    if (accountId) {
      router.push(Routes.ShowAccountPage({ accountId }))
      return null
    }
    router.push("/")
    return null
  }

  return (
    <>
      <Head>
        <title>Edit Account {account.id}</title>
      </Head>

      <div>
        <h1>Edit Account {account.id}</h1>
        <pre>{JSON.stringify(account, null, 2)}</pre>

        <AccountForm
          submitText="Update Account"
          // TODO use a zod schema for form validation
          //  - Tip: extract mutation's schema into a shared `validations.ts` file and
          //         then import and use it here
          // schema={UpdateAccount}
          initialValues={account}
          onSubmit={async (values) => {
            try {
              const updated = await updateAccountMutation({
                id: account.id,
                ...values,
              })
              await setQueryData(updated)
              router.push(Routes.ShowAccountPage({ accountId: updated.id }))
            } catch (error: any) {
              console.error(error)
              return {
                [FORM_ERROR]: error.toString(),
              }
            }
          }}
        />
      </div>
      <p>
        <Link href={Routes.AccountsPage()}>
          <a>Accounts</a>
        </Link>
      </p>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession(req, res)
  return { props: { data: session.$publicData } }
}

// @ts-ignore
const EditAccountPage: BlitzPage = ({ data }) => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditAccount data={data} />
      </Suspense>
    </div>
  )
}

EditAccountPage.authenticate = true
EditAccountPage.getLayout = (page) => <Layout>{page}</Layout>

export default EditAccountPage
