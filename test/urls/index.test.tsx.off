import { render } from "test/utils"

import Home from "app/pages/index"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import { screen } from "@testing-library/react"
import { getPage } from "next-page-tester"
import { useRouter } from "blitz"
import { renderHook } from "@testing-library/react-hooks"

import { UserRole } from "db"

jest.mock("app/core/hooks/useCurrentUser")
const mockUseCurrentUser = useCurrentUser as jest.MockedFunction<typeof useCurrentUser>

test.skip("renders blitz documentation link", () => {
  // This is an example of how to ensure a specific item is in the document
  // But it's disabled by default (by test.skip) so the test doesn't fail
  // when you remove the the default content from the page

  // This is an example on how to mock api hooks when testing
  mockUseCurrentUser.mockReturnValue({
    id: 1,
    name: "User",
    email: "user@email.com",
    role: UserRole.USER,
    accountId: 1,
  })

  const { getByText } = render(<Home />)
  const linkElement = getByText(/Documentation/i)
  expect(linkElement).toBeInTheDocument()
})
// describe("Index", () => {
//   it("Redirects unauthenticated to login", async () => {
//     render(<Home />)
//     const { result } = renderHook(() => useRouter())
//     result.current?.push("/")
//     expect(global.window.location.pathname).toEqual("/login")
//   })

// Shows authenticated user dashboard
// })
