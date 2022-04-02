import { Suspense } from "react"
import { Image, Link, BlitzPage, useMutation, Routes, useRouter } from "blitz"
import Layout from "app/core/layouts/Layout"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import logout from "app/auth/mutations/logout"
import logo from "public/logo.png"
import { Button } from "DesignSystem/components/Button"

const PageData = () => {
  const currentUser = useCurrentUser()
  const router = useRouter()
  const [logoutMutation] = useMutation(logout)
  if (!currentUser) {
    router.push(Routes.LoginPage())
    return null
  } else {
    return (
      <>
        <button
          className="button small"
          onClick={async () => {
            await logoutMutation()
          }}
        >
          Logout
        </button>
        <div>
          User id: <code>{currentUser.id}</code>
          <br />
          User role: <code>{currentUser.role}</code>
        </div>
      </>
    )
  }
}

const Home: BlitzPage = () => {
  return (
    <div className="container">
      <main>
        <Suspense fallback="Loading...">
          <PageData />
        </Suspense>
      </main>
    </div>
  )
}

Home.suppressFirstRenderFlicker = true
Home.getLayout = (page) => <Layout title="Home">{page}</Layout>

export default Home
