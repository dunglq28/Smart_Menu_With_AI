import { Button, Divider, Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import style from "./ActionBar.module.scss";
import { Icons } from "@/assets";

interface ActionBarProps {
  selectedCount: number;
}

export const ActionBar: React.FC<ActionBarProps> = ({ selectedCount }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(selectedCount > 0);
  }, [selectedCount]);

  if (!isVisible) return;

  return (
    <>
      <Flex className={style.action_bar_container}>
        <Flex className={`${style.action_bar_content} ${!isVisible ? style.hide : ""}`}>
          <Button className={style.action_bar_btn_selected}>{selectedCount} mục được chọn</Button>

          <Flex className={style.divider_container}>
            <Divider className={style.divider} orientation="vertical" mx="4" />
          </Flex>

          <Button className={style.action_bar_btn_delete} leftIcon={<Icons.delete />}>
            Xoá mục
          </Button>
        </Flex>
      </Flex>
    </>
  );
};
