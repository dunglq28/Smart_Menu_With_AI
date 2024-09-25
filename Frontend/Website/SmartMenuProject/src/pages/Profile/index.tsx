import { Flex, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import ProfileInfo from "../../components/Profile/ProfileInfo";
import SecuritySettings from "../../components/Profile/SecuritySettings";
import Billing from "../../components/Profile/Billing";
import style from "./Profile.module.scss";
import { themeColors } from "../../constants/GlobalStyles";
import { useEffect, useState } from "react";
import { getUser } from "../../services/UserService";
import { UserData } from "../../payloads/responses/UserData.model";
import { BrandData } from "../../payloads/responses/BrandData.model";
import { getBrand } from "../../services/BrandService";
import { SubscriptionData } from "../../payloads/responses/SubscriptionData.model";
import { getSubscription } from "../../services/SubscriptionsService";
import { getInitialSubscriptionData } from "../../utils/initialData";

const sidebarProfileTitle = ["Thông tin cá nhân", " Cài đặt bảo mật", "Thanh toán"];

function Profile() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [brandData, setBrandData] = useState<BrandData | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionData>(getInitialSubscriptionData());
  const [locationString, setLocationString] = useState<string>("");
  const [flag, setFlag] = useState<string>("");
  const apiGetLocation = import.meta.env.VITE_API_GET_LOCATION;

  const getUserById = async (): Promise<UserData | null> => {
    try {
      var userId = localStorage.getItem("UserId");
      const response = await getUser(Number(userId));
      if (!response.isSuccess) {
        throw new Error("Failed to fetch user");
      }
      return response.data;
    } catch (error) {
      console.error("Error fetching user:", error);
      return null;
    }
  };

  const getBrandById = async (): Promise<BrandData | null> => {
    try {
      var brandId = localStorage.getItem("BrandId");
      const response = await getBrand(Number(brandId));
      if (!response.isSuccess) {
        throw new Error("Failed to fetch brand");
      }
      return response.data;
    } catch (error) {
      console.error("Error fetching brand:", error);
      return null;
    }
  };

  const getSubscriptionByUserId = async (): Promise<SubscriptionData | null> => {
    try {
      var userId = localStorage.getItem("UserId");
      const response = await getSubscription(Number(userId));
      if (!response.isSuccess) {
        throw new Error("Failed to fetch Subscription");
      }
      return response.data;
    } catch (error) {
      console.error("Error fetching Subscription:", error);
      return null;
    }
  };

  useEffect(() => {
    // Fetch initial data when the component mounts (for first tab)
    const fetchInitialData = async () => {
      const [userResult, brandResult] = await Promise.all([getUserById(), getBrandById()]);
      if (userResult || brandResult) {
        setUserData(userResult);
        setBrandData(brandResult);
      }
    };
    fetchInitialData();
  }, []);

  // Handle tab change
  const handleTabChange = async (index: number) => {
    if (index === 0) {
      const userResult = await getUserById();
      const brandResult = await getBrandById();
      if (userResult || brandResult) {
        setUserData(userResult);
        setBrandData(brandResult);
      }
    } else if (index === 1) {
      fetch("https://api.ipgeolocation.io/ipgeo?apiKey=" + apiGetLocation)
        .then((response) => response.json())
        .then((data) => {
          const newLocationString = `${data.city}, ${data.state_prov}, ${data.country_name}`;
          setFlag(data.country_flag);
          setLocationString(newLocationString);
        })
        .catch((error) => {
          console.error("Error fetching user location:", error);
        });
    } else if (index === 2) {
      const subscriptionResult = await getSubscriptionByUserId();
      if (subscriptionResult) {
        setSubscription(subscriptionResult);
      }
    }
  };

  return (
    <Flex className={style.profile_container}>
      <Tabs w="85%" onChange={handleTabChange}>
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
              <ProfileInfo userData={userData} brandData={brandData} />
            </TabPanel>
            <TabPanel>
              <SecuritySettings locationString={locationString} flag={flag} />
            </TabPanel>
            <TabPanel>
              <Billing subscription={subscription} />
            </TabPanel>
          </TabPanels>
        </Flex>
      </Tabs>
    </Flex>
  );
}

export default Profile;
