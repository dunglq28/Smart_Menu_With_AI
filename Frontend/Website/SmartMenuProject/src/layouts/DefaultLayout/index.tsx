import React, { ReactNode, useEffect, useLayoutEffect, useState } from "react";
import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";
import Footer from "../../components/Footer/Footer";
import { Flex } from "@chakra-ui/react";
import style from "./DefaultLayout.module.scss";
import { useNavigate } from "react-router-dom";

interface DefaultLayoutProps {
  children: ReactNode;
}

const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children }) => {
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
        <Sidebar />
        <Flex className={style.Container} overflow="hidden">
          <Header />
          <Flex className={style.Container} overflow="auto">
            <Flex className={style.Children}>{children}</Flex>
          </Flex>
          <Footer />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default DefaultLayout;
