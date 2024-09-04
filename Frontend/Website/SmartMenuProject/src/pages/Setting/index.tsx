import React, { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Card,
  Flex,
  Switch,
  Text,
} from "@chakra-ui/react";
import i18n from "../../i18n/i18n";
import style from "./Setting.module.scss";
import Select, { SingleValue } from "react-select";

function Setting() {
  const cancelRef: React.LegacyRef<HTMLButtonElement> = React.useRef(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getInitialLanguage = () => {
    const savedLanguage = localStorage.getItem("language");
    return savedLanguage === "en" ? "en" : "vi";
  };

  const [language, setLanguage] = useState<"en" | "vi">(getInitialLanguage());

  const changeLanguage = (lng: "en" | "vi") => {
    i18n.changeLanguage(lng);
    setLanguage(lng);
    localStorage.setItem("language", lng);
  };

  const handleLanguageChange = (
    selectedOption: SingleValue<{ value: string; label: string }>
  ) => {
    if (selectedOption) {
      const selectedLanguage = selectedOption.value === "vi" ? "vi" : "en";
      changeLanguage(selectedLanguage);
    }
  };

  useEffect(() => {
    const initialLanguage = getInitialLanguage();
    changeLanguage(initialLanguage);
  }, []);

  const languageOptions = [
    { value: "vi", label: "Vi (VN)" },
    { value: "en", label: "Eng (US)" },
  ];

  type PositionValue =
    | "relative"
    | "sticky"
    | "absolute"
    | "fixed"
    | "static"
    | "initial"
    | "inherit";

  const getInitialHeaderSticky = () => {
    const savedHeaderSticky = localStorage.getItem("header-sticky");
    return savedHeaderSticky === "sticky" ? "sticky" : "relative";
  };

  const [headerSticky, setHeaderSticky] = useState<PositionValue>(
    getInitialHeaderSticky()
  );

  const toggleHeaderPosition = () => {
    const newHeaderSticky: PositionValue =
      headerSticky === "sticky" ? "relative" : "sticky";
    setHeaderSticky(newHeaderSticky);
    localStorage.setItem("header-sticky", newHeaderSticky);
    setIsDialogOpen(true);
  };

  const handleReloadPage = () => {
    window.location.reload();
  };

  return (
    <Flex className={style.Setting}>
      <Card className={style.Card}>
        <Flex className={style.CardContainer}>
          <Flex className={style.CardNav}>
            <Text className={style.CardNavText}>Change language:</Text>
            <Flex className={style.CardSubNav}>
              <Select
                options={languageOptions}
                placeholder={language === "en" ? "Eng (US)" : "Vi (VN)"}
                closeMenuOnSelect={true}
                className={style.FlavourSelect}
                onChange={handleLanguageChange}
              />
            </Flex>
          </Flex>
          {/* <Flex className={style.CardNav}>
            <Text className={style.CardNavText}>Sticky header:</Text>
            <Flex className={style.CardSubNav}>
              <Switch
                colorScheme="blue"
                size="lg"
                isChecked={headerSticky === "sticky"}
                onChange={toggleHeaderPosition}
              />
            </Flex>
          </Flex> */}
        </Flex>
      </Card>

      <AlertDialog
        isOpen={isDialogOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsDialogOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Reload page
            </AlertDialogHeader>

            <AlertDialogBody>
              Do you want to reload this page to see your change?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button colorScheme="blue" onClick={handleReloadPage} ml={3}>
                Yes
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Flex>
  );
}

export default Setting;
