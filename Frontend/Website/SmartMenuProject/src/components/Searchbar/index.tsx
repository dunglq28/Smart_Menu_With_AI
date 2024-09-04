import {
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Input,
  IconButton,
  Box,
  Button,
  Divider,
} from "@chakra-ui/react";
import { LuSearch } from "react-icons/lu";
import { FC, useState } from "react";
import style from "./Searchbar.module.scss";

interface SearchBarProps {
  onSearch: (value: string) => void;
}

const Searchbar: FC<SearchBarProps> = ({ onSearch }) => {
  const [inputValue, setInputValue] = useState("");
  const [loadingHeader, setLoadingHeader] = useState(false);

  const handleFocus = () => {
    // Handle focus event
  };

  const handleBlur = () => {
    // Handle blur event
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    onSearch(event.target.value);
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
          <LuSearch
            className={style.search_icon}
            color={
              inputValue.trim() === ""
                ? "rgba(22, 24, 35, 0.2)"
                : "rgba(22, 24, 35, 0.75)"
            }
          />
        </Button>
      </InputRightElement>
    </InputGroup>
  );
};

export default Searchbar;
