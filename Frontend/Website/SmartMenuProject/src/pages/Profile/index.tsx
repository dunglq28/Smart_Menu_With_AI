import {
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import ProfileInfo from "../../components/Profile/ProfileInfo";
import SecuritySettings from "../../components/Profile/SecuritySettings";
import Billing from "../../components/Profile/Billing";
import style from "./Profile.module.scss";
import { themeColors } from "../../constants/GlobalStyles";

const sidebarProfileTitle = [
  "Thông tin cá nhân",
  " Cài đặt bảo mật",
  "Thanh toán",
];

function Profile() {
  return (
    <Flex className={style.profile_container}>
      <Tabs w="85%">
        <Flex className={style.tabs_container}>
          <TabList className={style.tab_list}>
            {sidebarProfileTitle.map((title, index) => (
              <Tab
                key={index}
                _selected={{ color: "white", bg: themeColors.sidebarBgColor }}
                className={style.tab}
              >
                {title}
              </Tab>
            ))}
          </TabList>
          <TabPanels className={style.tab_panels}>
            <TabPanel>
              <ProfileInfo />
            </TabPanel>
            <TabPanel>
              <SecuritySettings locationString={null} flag="" />
            </TabPanel>
            <TabPanel>
              <Billing paymentHistory={[]} />
            </TabPanel>
          </TabPanels>
        </Flex>
      </Tabs>
    </Flex>
  );
}

export default Profile;
