import { useRouter, BlitzPage, Routes, GetServerSideProps, getSession } from "blitz"
import Layout from "app/core/layouts/Layout"
import { SignupForm } from "app/auth/components/SignupForm"
import { Suspense } from "react"

export interface SignupServerProps {
  impersonatedId?: number
  accountId?: number
  userId: number | null
}

interface SignupProps {
  data: SignupServerProps
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession(req, res)

  return { props: { data: session.$publicData } }
}

const Signup = ({ data }: SignupProps) => {
  const router = useRouter()

  // The user must be signed in and associated with an account in order to access the signup. If they are not
  // signed in, or are a SUPER user but have navigated straight to the URL rather than via the accounts page
  // Then redirect them to login
  if (!data.impersonatedId && !data.accountId) {
    router.push(Routes.LoginPage())
    return null
  }
  return (
    <SignupForm
      onSuccess={() => {
        router.push(Routes.Home())
      }}
      data={data}
    />
  )
}

// @ts-ignore
const SignupPage: BlitzPage = ({ data }: SignupProps) => {
  return (
    <Suspense fallback="Loading">
      <Signup data={data} />
    </Suspense>
  )
}

//SignupPage.redirectAuthenticatedTo = "/"
SignupPage.getLayout = (page) => <Layout title="Sign Up">{page}</Layout>

export default SignupPage
