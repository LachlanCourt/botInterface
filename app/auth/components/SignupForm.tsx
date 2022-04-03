import { useMutation } from "blitz"
import { Input } from "DesignSystem/components"
import { Form, FORM_ERROR } from "app/core/components/Form"
import signup from "app/auth/mutations/signup"
import { Signup } from "app/auth/validations"
import { UserRole } from "db"
import { createContext } from "react"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"

interface SignupFormProps {
  onSuccess?: () => void
}

export const SignupForm = (props: SignupFormProps) => {
  const [signupMutation] = useMutation(signup)
  const user = useCurrentUser()
  const accountId = user?.accountId || 0

  return (
    <div>
      <h1>Create an Account</h1>

      <Form
        submitText="Create Account"
        schema={Signup}
        initialValues={{ email: "", password: "", role: UserRole.USER, accountId: accountId }}
        onSubmit={async (values) => {
          try {
            await signupMutation(values)
            props.onSuccess?.()
          } catch (error: any) {
            if (error.code === "P2002" && error.meta?.target?.includes("email")) {
              // This error comes from Prisma
              return { email: "This email is already being used" }
            } else {
              return { [FORM_ERROR]: error.toString() }
            }
          }
        }}
      >
        <Input name="email" label="Email" placeholder="Email" />
        <Input name="password" label="Password" placeholder="Password" type="password" />
      </Form>
    </div>
  )
}

export default SignupForm
