import * as React from "react"
import { Button as ChakraButton, useMultiStyleConfig } from "@chakra-ui/react"

interface ButtonProps {
  variant: "ghost" | "outline" | "solid" | "link" | "unstyled"
  children: React.ReactNode
  colorScheme: "blue" | "green" | "purple"
  type?: string
}

function Button({ variant = "solid", children, colorScheme, type, ...rest }: ButtonProps) {
  const styles = useMultiStyleConfig("Button", { variant })
  console.log(styles)

  return (
    <ChakraButton variant={variant} __css={styles} colorScheme={colorScheme} {...rest}>
      {children}
    </ChakraButton>
  )
}

export default Button
