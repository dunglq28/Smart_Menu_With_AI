import { Card, Flex, Image, Text } from "@chakra-ui/react";
import style from "./MenuCard.module.scss";
import FakeMenu from "../../../assets/images/menu/menuImg.png";
import { MenuData } from "../../../payloads/responses/MenuData.model";
import moment from "moment";

interface MenuCardProps {
  menu: MenuData;
  handleClickMenu: (menuId: number) => void;
}

const MenuCard: React.FC<MenuCardProps> = ({ menu, handleClickMenu }) => (
  <Flex className={style.Card} onClick={() => handleClickMenu(menu.menuId)}>
    <Card className={style.MenuCard}>
      {menu.menuImage ? (
        <Image className={style.imageContainer} src={menu.menuImage} alt="Menu thông minh" />
      ) : (
        <Image className={style.imageContainer} src={FakeMenu} alt="Menu thông minh" />
      )}
      <Flex className={style.MenuCardTitle}>
        {menu.description ? (
          <Text className={style.Description}>{menu.description}</Text>
        ) : (
          <Text className={style.Description}>dsdsdsdssd</Text>
        )}
        <Flex columnGap="10px">
          <Text as="b">Độ ưu tiên:</Text>
          <Text>{menu.priority}</Text>
        </Flex>
        <Flex columnGap="10px">
          <Text as="b">Ngày tạo:</Text>
          <Text>{moment(menu.createDate).format("DD/MM/YYYY")}</Text>
        </Flex>
      </Flex>
    </Card>
  </Flex>
);

export default MenuCard;
