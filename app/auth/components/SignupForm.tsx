import { useMutation, useSession, useQuery } from "blitz"
import { Input, Select } from "DesignSystem/components"
import { Form, FORM_ERROR } from "app/core/components/Form"
import { Field } from "formik"
import signup from "app/auth/mutations/signup"
import { Signup } from "app/auth/validations"
import { UserRole } from "db"
import getAccount from "app/accounts/queries/getAccount"
import * as React from "react"
import { SignupServerProps } from "app/auth/pages/signup"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"

interface SignupFormProps {
  onSuccess?: () => void
  data: SignupServerProps
}

export const SignupForm = ({ onSuccess, data }: SignupFormProps) => {
  const [signupMutation] = useMutation(signup)

  const user = useCurrentUser()
  const role = user?.role || UserRole.ADMIN

  // Session takes time to resolve so rather than getting the accountId off the session, instead take it through props
  const accountId = data.impersonatedId || data.accountId
  const [account] = useQuery(getAccount, { id: accountId })
  const name = account.name

  return (
    <div>
      <h1>Add a new user to account {name}</h1>

      <Form
        submitText="Create Account"
        schema={Signup}
        initialValues={{
          email: "",
          role: UserRole.USER,
        }}
        onSubmit={async (values) => {
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
          <Field>
            {({ form: formikForm }) => (
              <Select
                name="role"
                label="role"
                options={[UserRole.USER, UserRole.ADMIN, UserRole.SUPER]}
                onChange={formikForm.handleChange}
              />
            )}
          </Field>
        )}
      </Form>
    </div>
  )
}

export default SignupForm
