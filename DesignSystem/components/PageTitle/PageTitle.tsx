import * as React from "react"
import { Box, useMultiStyleConfig } from "@chakra-ui/react"

interface PageTitleProps {
  children?: string
  as?: "h1" | "h2" | "h3"
}

function PageTitle({ children, as = "h1" }: PageTitleProps) {
  const styles = useMultiStyleConfig("PageTitle", {})
  return (
    <Box __css={styles} as={as}>
      {children}
    </Box>
  )
}

export default PageTitle
