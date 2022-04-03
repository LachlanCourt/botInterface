import { AuthenticationError, Link, useMutation, Routes, PromiseReturnType } from "blitz"
import { Input, PageTitle } from "DesignSystem/components"
import { Form, FORM_ERROR } from "app/core/components/Form"
import login from "app/auth/mutations/login"
import { Login } from "app/auth/validations"

import { FormControl, FormErrorMessage, Box, useMultiStyleConfig } from "@chakra-ui/react"

interface LoginFormProps {
  onSuccess?: (user: PromiseReturnType<typeof login>) => void
}

export const LoginForm = (props: LoginFormProps) => {
  const [loginMutation] = useMutation(login)
  const styles = useMultiStyleConfig("LoginForm", {})

  return (
    <Box __css={styles.container}>
      <PageTitle>Login</PageTitle>

      <Form
        submitText="Login"
        schema={Login}
        initialValues={{ email: "", password: "" }}
        onSubmit={async (values) => {
          try {
            const user = await loginMutation(values)
            props.onSuccess?.(user)
          } catch (error: any) {
            if (error instanceof AuthenticationError) {
              return { [FORM_ERROR]: "Sorry, those credentials are invalid" }
            } else {
              return {
                [FORM_ERROR]: `Sorry, we had an unexpected error. Please try again. - ${error.toString()}`,
              }
            }
          }
        }}
      >
        <Input name="email" label="Email" placeholder="Email" type="email" />
        <Input name="password" label="Password" placeholder="Password" type="password" />
        <div>
          <Link href={Routes.ForgotPasswordPage()}>
            <a>Forgot your password?</a>
          </Link>
        </div>
      </Form>
    </Box>
  )
}

export default LoginForm
