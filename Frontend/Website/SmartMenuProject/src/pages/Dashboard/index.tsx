import { Flex, Text } from "@chakra-ui/react";
import style from "./Dashboard.module.scss";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "react-toastify";

function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  let flag = false;

  useEffect(() => {
    if (location.state?.toastMessage && !flag) {
      toast.success(location.state.toastMessage, {
        autoClose: 2500,
      });
      flag = true;
      navigate(location.pathname, { replace: true });
    }
  }, [location.state]);

  return (
    <Flex className={style.Dashboard}>
      <Text>abc</Text>
    </Flex>
  );
}

export default Dashboard;
