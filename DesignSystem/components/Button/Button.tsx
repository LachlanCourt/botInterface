import * as React from "react"
import { Button as ChakraButton, useStyleConfig } from "@chakra-ui/react"

function Button({ ...rest }) {
  const styles = useStyleConfig("Button", {})
  console.log(styles)

  return <ChakraButton __css={styles} {...rest} />
}

export default Button
