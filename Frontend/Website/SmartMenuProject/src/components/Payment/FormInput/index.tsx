import { FormControl, FormLabel, Input, Text } from "@chakra-ui/react";
import style from "./FormInput.module.scss";
import { themeColors } from "../../../constants/GlobalStyles";

interface FormInputProps {
  label: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  errorMessage?: string;
}

const FormInput = ({
  label,
  value,
  onChange,
  placeholder = "",
  type = "text",
  errorMessage,
}: FormInputProps) => (
  <FormControl>
    <FormLabel className={style.formLabel}>{label}</FormLabel>
    <Input
      focusBorderColor={themeColors.primaryButton}
      placeholder={placeholder}
      type={type}
      value={value}
      onChange={onChange}
    />
    {errorMessage && <Text color="red.500">{errorMessage}</Text>}
  </FormControl>
);

export default FormInput;
