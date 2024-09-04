import { InputGroup, InputRightElement, Input, Button } from "@chakra-ui/react";
import { useState } from "react";
import style from "./PasswordInput.module.scss";
import { RiEyeCloseLine, RiEyeLine } from "react-icons/ri";

type PasswordInputProps = {
  placeholder: string;
};

const PasswordInput: React.FC<PasswordInputProps> = ({ placeholder }) => {
  const [inputValue, setInputValue] = useState("");
  const [showPassword, setShowpassword] = useState(false);

  const showPasswordHandler = () => {
    setShowpassword(!showPassword);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setInputValue(event.target.value);

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
            <RiEyeCloseLine
              onClick={() => showPasswordHandler()}
              className={style.search_icon}
            />
          ) : (
            <RiEyeLine
              onClick={() => showPasswordHandler()}
              className={style.search_icon}
            />
          )}
        </Button>
      </InputRightElement>
    </InputGroup>
  );
};

export default PasswordInput;
