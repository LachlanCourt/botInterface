import * as React from "react"
import { Select as ChakraSelect, Box, useStyleConfig } from "@chakra-ui/react"

interface SelectProps {
  options: Array<string>
  name: string
  label: string
  onChange?: React.ChangeEventHandler
}

const Select = ({ options, name, onChange }: SelectProps) => {
  const styles = useStyleConfig("Select", {})
  return (
    <ChakraSelect __css={styles} name={name} onChange={onChange}>
      {options.map((e, index) => {
        return <option key={index}>{e}</option>
      })}
    </ChakraSelect>
  )
}

export default Select
