import { useRouter, BlitzPage, Routes, useSession } from "blitz"
import Layout from "app/core/layouts/Layout"
import { SignupForm } from "app/auth/components/SignupForm"
import { Suspense } from "react"
import { UserRole } from "db"

const Signup = () => {
  const router = useRouter()
  return (
    <SignupForm
      onSuccess={() => {
        console.log("hello")
        router.push(Routes.Home())
      }}
    />
  )
}

const SignupPage: BlitzPage = () => {
  return (
    <Suspense fallback="Loading">
      <Signup />
    </Suspense>
  )
}

//SignupPage.redirectAuthenticatedTo = "/"
SignupPage.getLayout = (page) => <Layout title="Sign Up">{page}</Layout>

export default SignupPage
