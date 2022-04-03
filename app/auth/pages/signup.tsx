import { useRouter, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import { SignupForm } from "app/auth/components/SignupForm"
import { Suspense } from "react"

const SignupPage: BlitzPage = () => {
  const router = useRouter()

  return (
    <Suspense fallback="loading">
      <div>
        <SignupForm onSuccess={() => router.push(Routes.Home())} />
      </div>
    </Suspense>
  )
}

SignupPage.redirectAuthenticatedTo = "/"
SignupPage.getLayout = (page) => <Layout title="Sign Up">{page}</Layout>

export default SignupPage
