import {
  Button,
  Flex,
  FormControl,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Text,
} from "@chakra-ui/react";

import style from "./Login.module.scss";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { UserRole } from "@/constants";
import { Icons, Images } from "@/assets";
import { AuthenticationService, BrandService } from "@/services";

function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const location = useLocation();
  const navigate = useNavigate();
  let flag = false;

  useEffect(() => {
    if (location.state?.toastMessage && !flag) {
      toast.error(location.state.toastMessage, {
        autoClose: 2500,
      });
      flag = true;
    }
  }, [location.state]);

  const handleShowClick = () => setShowPassword(!showPassword);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value,
    });
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      loginHandler();
    }
  };

  const loginHandler = async () => {
    if (!credentials.username || !credentials.password) {
      toast.error("Vui lòng nhập tài khoản và mật khẩu");
      return;
    }
    try {
      setIsLoading(true);
      const response = await AuthenticationService.login(
        credentials.username,
        credentials.password,
      );

      if (response.data.roleId.toString() === UserRole.BranchManager.toString()) {
        toast.error("Bạn không có quyền truy cập vào trang web");
        return;
      }

      if (response.statusCode === 200) {
        localStorage.setItem("RoleId", response.data.roleId.toString());
        localStorage.setItem("AccessToken", response.data.token.accessToken);
        localStorage.setItem("RefreshToken", response.data.token.refreshToken);
        const toastMessage = response.message;

        if (response.data.roleId.toString() === UserRole.BrandManager.toString()) {
          const brand = await BrandService.getBrandByUserId(response.data.userId);
          localStorage.setItem("UserId", response.data.userId.toString());
          localStorage.setItem("BrandId", brand.data.brandId.toString());
          localStorage.setItem("BrandName", brand.data.brandName.toString());
          localStorage.setItem("BrandLogo", brand.data.imageUrl.toString());
          // ---------------------------------------------------------------
          navigate("/brand-dashboard", { state: { toastMessage } });
        } else if (response.data.roleId.toString() === UserRole.Admin.toString()) {
          localStorage.setItem("UserId", response.data.userId.toString());
          navigate("/admin-dashboard", { state: { toastMessage } });
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Flex
        position="fixed"
        top="0"
        left="0"
        height="100vh"
        width="100%"
        justifyContent="center"
        alignItems="center"
        bg="#E1C278"
        zIndex="9999"
      >
        <Image src={Images.loadingCoffee} />
      </Flex>
    );
  }

  return (
    <>
      <Flex className={style.Login}>
        <Flex className={style.LeftContainer}>
          <Image src={Images.wave} className={style.Wave} />
          <Image src={Images.bg} className={style.Bg} />
        </Flex>
        <Flex className={style.RightContainer}>
          <Flex className={style.FormContainer}>
            <Flex className={style.HeaderContainer}>
              <Image src={Images.avatar} className={style.Avatar} />
              <Text className={style.WelcomeText}>CHÀO MỪNG</Text>
            </Flex>
            <Flex className={style.InputContainer}>
              <FormControl>
                <InputGroup>
                  <InputLeftElement pointerEvents="none" color="gray.300">
                    <Icons.person />
                  </InputLeftElement>
                  <Input
                    type="text"
                    placeholder="Tên đăng nhập"
                    name="username"
                    value={credentials.username}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                  />
                </InputGroup>
              </FormControl>
              <FormControl>
                <InputGroup>
                  <InputLeftElement pointerEvents="none" color="gray.300">
                    <Icons.password />
                  </InputLeftElement>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Mật khẩu"
                    name="password"
                    value={credentials.password}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                  />
                  <InputRightElement className={style.ShowPasswordContainer}>
                    <Button className={style.ShowPasswordButton} onClick={handleShowClick}>
                      {showPassword ? "Ẩn" : "Hiện"}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
            </Flex>
            <Button className={style.LoginButton} onClick={loginHandler}>
              ĐĂNG NHẬP
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
}

export default Login;
