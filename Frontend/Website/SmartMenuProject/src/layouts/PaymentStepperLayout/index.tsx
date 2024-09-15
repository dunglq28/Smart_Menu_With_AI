import React, { ReactNode, useEffect } from "react";

import { Divider, Flex } from "@chakra-ui/react";
import style from "./PaymentStepperLayout.module.scss";
import { useNavigate } from "react-router-dom";

import Footer from "../../components/Footer/Footer";
import { UserRole } from "../../constants/Enum";
import HeaderPaymentStepper from "../../components/Guest/HeaderPaymentStepper";

interface PaymentStepperLayoutProps {
  children: ReactNode;
}

const PaymentStepperLayout: React.FC<PaymentStepperLayoutProps> = ({ children }) => {
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
          <HeaderPaymentStepper />
          <Flex className={style.Container} overflow="hidden">
            <Flex className={style.Children}>{children}</Flex>
          </Flex>
          <Divider />
          <Footer />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default PaymentStepperLayout;
