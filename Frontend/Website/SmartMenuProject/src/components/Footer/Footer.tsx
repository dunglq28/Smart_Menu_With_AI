import { Button, Divider, Flex, Input, Link, Text } from "@chakra-ui/react";
import style from "./Footer.module.scss";
import { FaFacebookSquare, FaInstagramSquare, FaYoutube } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";

function Footer() {
  return (
    <Flex className={style.Footer}>
      <Flex>
        <Flex className={style.LeftFooter}>
          <Text className={style.LogoText}>Smart Menu With AI🍽️</Text>

          <Flex className={style.ContentOfLeftFooter}>
            <Flex className={style.LeftContentOfLeftFooter}>
              <Text>Dashboard</Text>
              <Text>User</Text>
              <Text>Branch</Text>
            </Flex>
            <Flex className={style.RightContentOfRightFooter}>
              <Text>Products</Text>
              <Text>Menu</Text>
              <Text>New Product</Text>
            </Flex>
          </Flex>

          <Flex className={style.SocialMediaIcon}>
            <FaFacebookSquare />
            <FaInstagramSquare />
            <FaSquareXTwitter />
            <FaYoutube />
          </Flex>
        </Flex>

        <Flex className={style.RightFooter}>
          <Input
            variant="outline"
            placeholder="Email"
            type="email"
            className={style.InputRightFooter}
          />
          <Button className={style.ContactBtn}>Contact Us</Button>
        </Flex>
      </Flex>

      <Flex className={style.BottomFooter}>
        <Text className={style.TextBottomFooter}>Website Terms</Text>
        <Text className={style.TextBottomFooter}>Privacy Policy</Text>
        <Text className={style.TextBottomFooter}>Accessibility Statement</Text>
        <Text className={style.TextBottomFooter}>
          CA Transparency in Supply Chains Act
        </Text>
        <Text className={style.TextBottomFooter}>Supplier Code of Conduct</Text>
        <Text className={style.TextBottomFooter}>Marketing to Children</Text>
        <Text className={style.TextBottomFooter}>
          Do Not Sell My Information
        </Text>
      </Flex>
      <Text>©2024 Smart Menu with AI.</Text>
    </Flex>
  );
}

export default Footer;
