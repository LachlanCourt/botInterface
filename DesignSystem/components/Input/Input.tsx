import { forwardRef, PropsWithoutRef, ComponentPropsWithoutRef } from "react"
import { useField, useFormikContext, ErrorMessage as FormikErrorMessage } from "formik"

import { Input as ChakraInput, useMultiStyleConfig } from "@chakra-ui/react"
import { FormControl, FormLabel } from "@chakra-ui/react"
import { ErrorMessage } from "./"

export interface LabeledTextFieldProps extends ComponentPropsWithoutRef<typeof ChakraInput> {
  /** Field name. */
  name: string
  /** Field label. */
  label: string
  /** Field type. Doesn't include radio buttons and checkboxes */
  type?: "text" | "password" | "email" | "number"
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>
}

const Input = forwardRef<HTMLInputElement, LabeledTextFieldProps>(
  ({ name, label, outerProps, ...props }, ref) => {
    const [input] = useField(name)
    const { isSubmitting } = useFormikContext()
    const styles = useMultiStyleConfig("Input", {})

    return (
      <FormControl sx={styles.container} {...outerProps}>
        <FormLabel sx={styles.label}>{label}</FormLabel>
        <ChakraInput {...input} __css={styles} disabled={isSubmitting} {...props} ref={ref} />
        <FormikErrorMessage name={name}>
          {(msg) => {
            return <ErrorMessage message={msg} />
          }}
        </FormikErrorMessage>
      </FormControl>
    )
  }
)

export default Input
