import React, { ReactNode, useEffect } from "react";
import { Flex } from "@chakra-ui/react";
import style from "./HeaderOnly.module.scss";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Administration/Header/Header";

interface HeaderOnlyProps {
  children: ReactNode;
}

const HeaderOnly: React.FC<HeaderOnlyProps> = ({ children }) => {
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
          <Flex className={style.Children}>{children}</Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default HeaderOnly;
