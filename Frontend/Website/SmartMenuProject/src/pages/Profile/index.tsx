import {
  Box,
  Button,
  Checkbox,
  Divider,
  Flex,
  Image,
  Input,
  Stack,
  Switch,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import style from "./Profile.module.scss";
import { GoPerson } from "react-icons/go";
import { IoSettingsOutline } from "react-icons/io5";
import { BsShield } from "react-icons/bs";
import { LuBell, LuCreditCard } from "react-icons/lu";
import PasswordInput from "../../components/PasswordInput";
import { useTranslation } from "react-i18next";

function Profile() {
  const [locationString, setLocationString] = useState<string>("");
  const [flag, setFlag] = useState<string>("");
  const apiGetLocation = import.meta.env.VITE_API_GET_LOCATION;
  const { t } = useTranslation("profile");
  useEffect(() => {
    fetch("https://api.ipgeolocation.io/ipgeo?apiKey=" + apiGetLocation)
      .then((response) => response.json())
      .then((data) => {
        console.log("User location:", data);
        const newLocationString = `${data.city}, ${data.state_prov}, ${data.country_name}`;
        setFlag(data.country_flag);
        setLocationString(newLocationString);
      })
      .catch((error) => {
        console.error("Error fetching user location:", error);
      });
  }, []);

  return (
    <Flex className={style.profile_container}>
      <Tabs w="80%">
        <Flex className={style.tabs_container}>
          <TabList className={style.tab_list}>
            <Tab
              _selected={{ color: "white", bg: "#5D5FEF" }}
              className={style.tab}
            >
              <GoPerson className={style.icon} />
              <Text className={style.tab_text}>{t("profile information")}</Text>
            </Tab>
            <Tab
              _selected={{ color: "white", bg: "#5D5FEF" }}
              className={style.tab}
            >
              <IoSettingsOutline className={style.icon} />
              <Text className={style.tab_text}>{t("account settings")}</Text>
            </Tab>
            <Tab
              _selected={{ color: "white", bg: "#5D5FEF" }}
              className={style.tab}
            >
              <BsShield className={style.icon} />
              <Text className={style.tab_text}>{t("sercurity")}</Text>
            </Tab>
            <Tab
              _selected={{ color: "white", bg: "#5D5FEF" }}
              className={style.tab}
            >
              <LuBell className={style.icon} />
              <Text className={style.tab_text}>{t("notification")}</Text>
            </Tab>
            <Tab
              _selected={{ color: "white", bg: "#5D5FEF" }}
              className={style.tab}
            >
              <LuCreditCard className={style.icon} />
              <Text className={style.tab_text}>{t("billing")}</Text>
            </Tab>
          </TabList>

          <TabPanels className={style.tab_panels}>
            <TabPanel>
              <Flex className={style.tab_panels_container}>
                <Text className={style.tab_panels_container_title}>
                  {t("profile information title")}
                </Text>

                <Divider />

                <Flex className={style.tab_panels_container_content}>
                  <Text className={style.text_title_content}>
                    {t("fullname")}
                  </Text>
                  <Input />
                  <Text className={style.text_content} color="#525252">
                    {t("description of fullname")}
                  </Text>
                </Flex>

                <Flex className={style.tab_panels_container_content}>
                  <Text className={style.text_title_content}>
                    {t("your bio")}
                  </Text>
                  <Input />
                </Flex>

                <Flex className={style.tab_panels_container_content}>
                  <Text className={style.text_title_content}>{t("url")}</Text>
                  <Input />
                </Flex>

                <Flex className={style.tab_panels_container_content}>
                  <Text className={style.text_title_content}>
                    {t("location")}
                  </Text>
                  <Input />
                  <Text className={style.text_content} color="#525252">
                    {t("description of location")}
                  </Text>
                </Flex>
                <Flex columnGap="5px">
                  <Button className={style.btn_content}>
                    {t("update profile")}
                  </Button>
                  <Button>{t("reset changes")}</Button>
                </Flex>
              </Flex>
            </TabPanel>
            <TabPanel>
              <Flex className={style.tab_panels_container}>
                <Text className={style.tab_panels_container_title}>
                  {t("account setting title")}
                </Text>

                <Divider />

                <Flex className={style.tab_panels_container_content}>
                  <Text className={style.text_title_content}>
                    {t("username")}
                  </Text>
                  <Input />
                  <Text className={style.text_content} color="#525252">
                    {t("description of username")}
                  </Text>
                </Flex>
                <Divider />
                <Flex className={style.tab_panels_container_content}>
                  <Text className={style.text_title_content} color="red">
                    {t("delete account")}
                  </Text>
                  <Text className={style.text_title_content} color="#525252">
                    {t("description of delete account")}
                  </Text>
                </Flex>
                <Flex>
                  <Button className={style.btn_delete}>
                    {t("delete account")}
                  </Button>
                </Flex>
              </Flex>
            </TabPanel>
            <TabPanel>
              <Flex className={style.tab_panels_container}>
                <Text className={style.tab_panels_container_title}>
                  {t("sercurity title")}
                </Text>

                <Divider />

                <Flex className={style.tab_panels_container_content}>
                  <Text className={style.text_title_content}>
                    {t("change password")}
                  </Text>
                  <PasswordInput placeholder={t("enter old password")} />
                  <PasswordInput placeholder={t("new password")} />
                  <PasswordInput placeholder={t("confirm new password")} />
                  <Flex>
                    <Button className={style.btn_content}>
                      {t("save change")}
                    </Button>
                  </Flex>
                </Flex>

                <Divider />

                <Flex flexDir="column" rowGap="15px">
                  <Text className={style.text_title_content}>
                    {t("two factor authen")}
                  </Text>
                  <Flex>
                    <Button className={style.btn_content}>
                      {t("enable two factor")}
                    </Button>
                  </Flex>
                  <Text className={style.text_content} color="#525252">
                    {t("description of two factor authen")}
                  </Text>
                </Flex>
                <Divider />

                <Flex flexDir="column">
                  <Text className={style.text_title_content}>
                    {t("session")}
                  </Text>
                  <Text className={style.text_title_content} color="#525252">
                    {t("description of session")}
                  </Text>
                </Flex>

                <Flex alignItems="center" columnGap="20px">
                  <Text>
                    {locationString ? (
                      `${t("your current session")} ${locationString}`
                    ) : (
                      <Loading />
                    )}
                  </Text>
                  <Image src={flag} />
                </Flex>
              </Flex>
            </TabPanel>
            <TabPanel userSelect="none">
              <Flex className={style.tab_panels_container}>
                <Text className={style.tab_panels_container_title}>
                  {t("notification title")}
                </Text>
                <Divider />
                <Flex flexDir="column">
                  <Text className={style.text_title_content}>
                    {t("sercurity alert")}
                  </Text>
                  <Text className={style.text_content} color="#525252">
                    {t("description of sercurity alert")}
                  </Text>
                </Flex>

                <Flex flexDir="column">
                  <Checkbox defaultChecked>{t("checkbox 1")}</Checkbox>
                  <Checkbox defaultChecked>{t("checkbox 2")}</Checkbox>
                </Flex>
                <Flex flexDir="column">
                  <Text className={style.text_title_content}>{t("sms")}</Text>
                  <Flex flexDir="column" rowGap="5px">
                    <Stack border="1px solid #ccc" padding="20px">
                      <Text>{t("cmt")}</Text>
                      <Switch size="sm" />
                    </Stack>
                    <Stack border="1px solid #ccc" padding="20px">
                      <Text>{t("update from people")}</Text>
                      <Switch size="sm" />
                    </Stack>
                    <Stack border="1px solid #ccc" padding="20px">
                      <Text>{t("remind")}</Text>
                      <Switch size="sm" />
                    </Stack>
                    <Stack border="1px solid #ccc" padding="20px">
                      <Text>{t("event")}</Text>
                      <Switch size="sm" />
                    </Stack>
                    <Stack border="1px solid #ccc" padding="20px">
                      <Text>{t("page you follow")}</Text>
                      <Switch size="sm" />
                    </Stack>
                  </Flex>
                </Flex>
              </Flex>
            </TabPanel>
            <TabPanel>
              <Flex className={style.tab_panels_container}>
                <Text className={style.tab_panels_container_title}>
                  {t("billing title")}
                </Text>
                <Divider />
                <Flex flexDir="column">
                  <Text className={style.text_title_content}>
                    {t("payment method")}
                  </Text>
                  <Text className={style.text_content} color="#525252">
                    {t("payment method not added")}
                  </Text>
                </Flex>
                <Flex>
                  <Button className={style.btn_content}>
                    {t("add payment")}
                  </Button>
                </Flex>
                <Flex flexDir="column">
                  <Text className={style.text_title_content}>
                    {t("pay history")}
                  </Text>
                  <Flex
                    border="1px solid #ccc"
                    justifyContent="center"
                    alignItems="center"
                    padding="20px"
                  >
                    <Text className={style.text_title_content}>
                      {t("payment method not added")}
                    </Text>
                  </Flex>
                </Flex>
              </Flex>
            </TabPanel>
          </TabPanels>
        </Flex>
      </Tabs>
    </Flex>
  );
}

export default Profile;
