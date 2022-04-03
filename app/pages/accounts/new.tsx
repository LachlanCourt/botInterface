import { Link, useRouter, useMutation, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import createAccount from "app/accounts/mutations/createAccount"
import { AccountForm, FORM_ERROR } from "app/accounts/components/AccountForm"

const NewAccountPage: BlitzPage = () => {
  const router = useRouter()
  const [createAccountMutation] = useMutation(createAccount)

  return (
    <div>
      <h1>Create New Account</h1>

      <AccountForm
        submitText="Create Account"
        // TODO use a zod schema for form validation
        //  - Tip: extract mutation's schema into a shared `validations.ts` file and
        //         then import and use it here
        // schema={CreateAccount}
        // initialValues={{}}
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

NewAccountPage.authenticate = true
NewAccountPage.getLayout = (page) => <Layout title={"Create New Account"}>{page}</Layout>

export default NewAccountPage
