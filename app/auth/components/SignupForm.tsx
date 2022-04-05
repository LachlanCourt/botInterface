import { useMutation, useSession } from "blitz"
import { Input, Select } from "DesignSystem/components"
import { Form, FORM_ERROR } from "app/core/components/Form"
import signup from "app/auth/mutations/signup"
import { Signup } from "app/auth/validations"
import { UserRole } from "db"

interface SignupFormProps {
  onSuccess?: () => void
}

export const SignupForm = ({ onSuccess }: SignupFormProps) => {
  const [signupMutation] = useMutation(signup)

  const session = useSession({ suspense: false })
  //console.log(session)
  const role = session.role || UserRole.ADMIN

  return (
    <div>
      <h1>Create an Account{session.accountId}</h1>

      <Form
        submitText="Create Account"
        schema={Signup}
        initialValues={{
          email: "",
          role: UserRole.USER,
        }}
        onSubmit={async (values) => {
          console.log("values:")
          console.log(values)
          try {
            await signupMutation(values)
            onSuccess?.()
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
        {role === UserRole.SUPER && (
          <Select
            name="role"
            label="role"
            options={[UserRole.USER, UserRole.ADMIN, UserRole.SUPER]}
          />
        )}
      </Form>
    </div>
  )
}

export default SignupForm
