import { Form, FormProps } from "app/core/components/Form"
import { Input } from "app/core/components"
import { z } from "zod"
export { FORM_ERROR } from "app/core/components/Form"

export function AccountForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  return (
    <Form<S> {...props}>
      <Input name="name" label="Name" placeholder="Name" />
    </Form>
  )
}
