import {
  Link,
  useRouter,
  useMutation,
  BlitzPage,
  Routes,
  GetServerSideProps,
  getSession,
} from "blitz"
import Layout from "app/core/layouts/Layout"
import createAccount from "app/accounts/mutations/createAccount"
import { AccountForm, FORM_ERROR } from "app/accounts/components/AccountForm"
import { CreateAccount as CreateAccountValidation } from "app/auth/validations"
import { Suspense } from "react"
import { UserRole } from "db"

const New = ({ data }) => {
  const router = useRouter()
  const [createAccountMutation] = useMutation(createAccount)

  if (!data.role || data.role !== UserRole.SUPER) {
    const accountId = data.accountId
    if (accountId) {
      router.push(Routes.ShowAccountPage({ accountId }))
      return null
    }
    router.push("/")
    return null
  }

  return (
    <div>
      <h1>Create New Account</h1>

      <AccountForm
        submitText="Create Account"
        schema={CreateAccountValidation}
        initialValues={{ name: "" }}
        onSubmit={async (values) => {
          try {
            const account = await createAccountMutation(values)
            router.push(Routes.ShowAccountPage({ accountId: account.id }))
          } catch (error: any) {
            console.error(error)
            return {
              [FORM_ERROR]: error.toString(),
            }
          }
        }}
      />

      <p>
        <Link href={Routes.AccountsPage()}>
          <a>Accounts</a>
        </Link>
      </p>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession(req, res)
  return { props: { data: session.$publicData } }
}

// @ts-ignore
const NewAccountPage: BlitzPage = ({ data }) => {
  return (
    <Suspense fallback="loading">
      <New data={data} />
    </Suspense>
  )
}

NewAccountPage.authenticate = true
NewAccountPage.getLayout = (page) => <Layout title={"Create New Account"}>{page}</Layout>

export default NewAccountPage
