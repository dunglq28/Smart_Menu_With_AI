import { Button, Divider, Flex, Input, Link, Text } from "@chakra-ui/react";
import style from "./Footer.module.scss";
import { FaFacebookSquare, FaInstagramSquare, FaYoutube } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";

function Footer() {
  return (
    <Flex className={style.Footer}>
      <Flex>
        <Flex className={style.LeftFooter}>
          <Text className={style.LogoText}>Menius🍽️</Text>

          <Flex className={style.ContentOfLeftFooter}>
            <Flex className={style.LeftContentOfLeftFooter}>
              <Text>Bảng điều khiển</Text>
              <Text>Người dùng</Text>
              <Text>Chi nhánh</Text>
            </Flex>
            <Flex className={style.RightContentOfRightFooter}>
              <Text>Sản phẩm</Text>
              <Text>Thực đơn</Text>
              <Text>Sản phẩm mới</Text>
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
          <Button className={style.ContactBtn}>Liên hệ với chúng tôi</Button>
        </Flex>
      </Flex>

      <Flex className={style.BottomFooter}>
        <Text className={style.TextBottomFooter}>Điều khoản trang web</Text>
        <Text className={style.TextBottomFooter}>Chính sách bảo mật</Text>
        <Text className={style.TextBottomFooter}>Tuyên bố về khả năng truy cập</Text>
        <Text className={style.TextBottomFooter}>
          Đạo luật minh bạch trong chuỗi cung ứng của CA
        </Text>
        <Text className={style.TextBottomFooter}>Quy tắc ứng xử nhà cung cấp</Text>
        <Text className={style.TextBottomFooter}>Tiếp thị cho trẻ em</Text>
        <Text className={style.TextBottomFooter}>Không bán thông tin của tôi</Text>
      </Flex>
      <Text>©2024 Thực đơn thông minh với AI.</Text>
    </Flex>
  );
}

export default Footer;
