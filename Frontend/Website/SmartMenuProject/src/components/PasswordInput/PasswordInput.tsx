import { InputGroup, InputRightElement, Input, Button } from "@chakra-ui/react";
import { useState } from "react";
import style from "./PasswordInput.module.scss";
import { PasswordForm } from "@/models";
import { Icons } from "@/assets";

type PasswordInputProps = {
  placeholder: string;
  setPassword: (field: keyof PasswordForm, value: string) => void;
  field: keyof PasswordForm;
};

const PasswordInput: React.FC<PasswordInputProps> = ({ placeholder, setPassword, field }) => {
  const [inputValue, setInputValue] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const showPasswordHandler = () => {
    setShowPassword(!showPassword);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);
    setPassword(field, value);
  };

  return (
    <InputGroup className={style.passwordInput}>
      <Input
        className={style.input}
        onChange={handleInputChange}
        value={inputValue}
        placeholder={placeholder}
        spellCheck={false}
        variant="unstyled"
        type={showPassword ? "text" : "password"}
        autoComplete="off"
      />
      <InputRightElement className={style["input-right-element"]}>
        <Button className={style.button}>
          {showPassword ? (
            <Icons.eyeCloseLine
              onClick={() => showPasswordHandler()}
              className={style.search_icon}
            />
          ) : (
            <Icons.eyeLine onClick={() => showPasswordHandler()} className={style.search_icon} />
          )}
        </Button>
      </InputRightElement>
    </InputGroup>
  );
};

export default PasswordInput;
