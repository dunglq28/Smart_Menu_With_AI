import React, { ReactNode, useEffect } from "react";

import { Flex } from "@chakra-ui/react";
import style from "./GuestLayout.module.scss";
import { useNavigate } from "react-router-dom";

import Footer from "../../components/Footer/Footer";
import Header from "../../components/Guest/Header";
import { UserRole } from "../../constants/Enum";

interface GuestLayoutProps {
  children: ReactNode;
}

const GuestLayout: React.FC<GuestLayoutProps> = ({ children }) => {
  const isLoggedIn =
    localStorage.getItem("AccessToken") !== null &&
    localStorage.getItem("RefreshToken") !== null;
  const navigate = useNavigate();

  useEffect(() => {
    const roleId = localStorage.getItem("RoleId");
    const isLoggedIn =
      localStorage.getItem("AccessToken") !== null &&
      localStorage.getItem("RefreshToken") !== null;
    if (isLoggedIn && roleId !== null) {
      if (roleId.toString() === UserRole.Admin.toString()) {
        navigate("/admin-dashboard");
      } else if (roleId.toString() === UserRole.BrandManager.toString()) {
        navigate("/brand-dashboard");
      }
    }
  });

  return (
    // wrapper
    <Flex className={style.Wrapper}>
      {/* container */}
      <Flex w="100%">
        <Flex className={style.Container} overflow="hidden">
          <Header />
          <Flex className={style.Container} overflow="hidden">
            <Flex className={style.Children}>{children}</Flex>
          </Flex>
          <Footer />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default GuestLayout;
