import React, { ReactNode, useEffect } from "react";

import { Flex } from "@chakra-ui/react";
import style from "./DefaultLayout.module.scss";
import { useNavigate } from "react-router-dom";
import { Footer, HeaderAdmin, SidebarAdmin } from "@/components";

interface DefaultLayoutProps {
  children: ReactNode;
}

const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children }) => {
  const isLoggedIn =
    localStorage.getItem("AccessToken") !== null && localStorage.getItem("RefreshToken") !== null;
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn && location.pathname !== "/login" && location.pathname !== "/") {
      const toastMessage = "Vui lòng đăng nhập để truy cập trang.";
      navigate("/login", { state: { toastMessage } });
    }
  }, [isLoggedIn, navigate, location.pathname]);

  return (
    // wrapper
    <Flex className={style.Wrapper}>
      {/* container */}
      <Flex w="100%">
        <SidebarAdmin />
        <Flex className={style.Container} overflow="hidden">
          <HeaderAdmin />
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
