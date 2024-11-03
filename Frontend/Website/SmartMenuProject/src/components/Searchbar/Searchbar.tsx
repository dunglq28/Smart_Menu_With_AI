import { InputGroup, InputRightElement, Input, Button, Divider, Box } from "@chakra-ui/react";
import { FC, useEffect, useState } from "react";
import style from "./Searchbar.module.scss";
import { Icons } from "@/assets";
import { useDebounce } from "use-debounce";

interface SearchBarProps {
  onSearch: (value: string) => void;
}

const Searchbar: FC<SearchBarProps> = ({ onSearch }) => {
  const [inputValue, setInputValue] = useState("");
  const [debouncedInputValue] = useDebounce(inputValue, 300);

  useEffect(() => {
    onSearch(debouncedInputValue);
  }, [debouncedInputValue]);

  const handleFocus = () => {
    // Handle focus event
  };

  const handleBlur = () => {
    // Handle blur event
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleDeleteTextSearch = () => {
    setInputValue("");
  };

  return (
    <InputGroup className={style.searchbar}>
      <Input
        className={style.input}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleInputChange}
        value={inputValue}
        placeholder="Search..."
        spellCheck={false}
        variant="unstyled"
      />
      <InputRightElement className={style["input-right-element"]}>
        <Divider orientation="vertical" />
        <Button className={style.button}>
          <Box
            className={style.search_icon}
            color={inputValue.trim() === "" ? "rgba(22, 24, 35, 0.2)" : "rgba(22, 24, 35, 0.75)"}
          >
            <Icons.search />
          </Box>
        </Button>
      </InputRightElement>
    </InputGroup>
  );
};

export default Searchbar;
