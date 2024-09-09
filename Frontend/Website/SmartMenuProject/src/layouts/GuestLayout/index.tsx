import React, { ReactNode, useEffect } from "react";

import { Flex } from "@chakra-ui/react";
import style from "./GuestLayout.module.scss";
import { useNavigate } from "react-router-dom";

import Footer from "../../components/Footer/Footer";
import Header from "../../components/Guest/Header";

interface GuestLayoutProps {
  children: ReactNode;
}

const GuestLayout: React.FC<GuestLayoutProps> = ({ children }) => {
  const isLoggedIn =
    localStorage.getItem("AccessToken") !== null &&
    localStorage.getItem("RefreshToken") !== null;
  const navigate = useNavigate();

  useEffect(() => {
    if (
      !isLoggedIn &&
      location.pathname !== "/login" &&
      location.pathname !== "/"
    ) {
      const toastMessage = "Vui lòng đăng nhập để truy cập trang.";
      navigate("/login", { state: { toastMessage } });
    }
  }, [isLoggedIn, navigate, location.pathname]);

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
