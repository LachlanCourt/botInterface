import * as React from "react"
import { Box, useMultiStyleConfig } from "@chakra-ui/react"

interface ErrorMessageProps {
  message?: string
}

function ErrorMessage({ message }: ErrorMessageProps) {
  const styles = useMultiStyleConfig("Input", {})
  return message ? <Box __css={styles.error}>{message}</Box> : <Box></Box>
}

export default ErrorMessage
