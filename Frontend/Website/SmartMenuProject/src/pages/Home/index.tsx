import {
    Avatar,
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
  import bg from "../../assets/images/bg.svg";
  import avatar from "../../assets/images/avatar.svg";
  import wave from "../../assets/images/wave.png";
  import style from "./Login.module.scss";
  import { IoMdPerson } from "react-icons/io";
  import { RiLockPasswordLine } from "react-icons/ri";
  import { useEffect, useState } from "react";
  import { login } from "../../services/AuthenticationService";
  import { toast } from "react-toastify";
  import Loading from "../../assets/gif/loadingCoffee.gif";
  import { useLocation, useNavigate } from "react-router-dom";
  import { UserRole } from "../../constants/Enum";
  import { getBrand, getBrandByUserId } from "../../services/BrandService";
  
  function Home() {

  
    return (
      <>
        <div>Home page</div>
      </>
    );
  }
  
  export default Home;
  