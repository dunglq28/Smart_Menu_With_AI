import {
  Box,
  Button,
  Divider,
  Flex,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Text,
} from "@chakra-ui/react";
import { RiSettings3Line } from "react-icons/ri";
import style from "./ActionMenuComponent.module.scss";

interface ActionMenuItem {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

interface ActionMenuProps {
  title: string;
  items: ActionMenuItem[];
}

const ActionMenuComponent: React.FC<ActionMenuProps> = ({ title, items }) => {
  return (
    <Flex className={style.settingItem}>
      <Popover>
        <PopoverTrigger>
          <Button className={style.settingsIconBtn}>
            <Flex>
              <RiSettings3Line className={style.settingsIcon} />
            </Flex>
          </Button>
        </PopoverTrigger>
        <PopoverContent className={style.PopoverContent}>
          <PopoverHeader className={style.PopoverHeader}>{title}</PopoverHeader>
          <PopoverBody className={style.PopoverBody}>
            {items.map((item, index) => (
              <div key={index}>
                <Flex onClick={item.onClick} className={style.PopupButton}>
                  <Box className={style.PopupIcon}>{item.icon}</Box>
                  <Text className={style.PopupButtonText}>{item.label}</Text>
                </Flex>
                {index < items.length - 1 && <Divider />}
              </div>
            ))}
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </Flex>
  );
};

export default ActionMenuComponent;
