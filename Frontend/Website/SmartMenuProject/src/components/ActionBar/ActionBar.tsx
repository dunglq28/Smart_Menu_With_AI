import { Button, Divider, Flex, useDisclosure } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import style from "./ActionBar.module.scss";
import { Icons } from "@/assets";
import CustomAlertDialog from "../AlertDialog/AlertDialog";

interface ActionBarProps {
  selectedCount: number;
  deleteSelectedItems: () => void;
}

export const ActionBar: React.FC<ActionBarProps> = ({ selectedCount, deleteSelectedItems }) => {
  const [isVisible, setIsVisible] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    setIsVisible(selectedCount > 0);
  }, [selectedCount]);

  if (!isVisible) return;

  const handleDeleteSelectedItems = () => {
    deleteSelectedItems();
    onClose();
  };

  return (
    <>
      <Flex className={style.action_bar_container}>
        <Flex className={`${style.action_bar_content} ${!isVisible ? style.hide : ""}`}>
          <Button className={style.action_bar_btn_selected}>{selectedCount} mục được chọn</Button>

          <Flex className={style.divider_container}>
            <Divider className={style.divider} orientation="vertical" mx="4" />
          </Flex>

          <Button
            className={style.action_bar_btn_delete}
            leftIcon={<Icons.delete />}
            onClick={onOpen}
          >
            Xoá mục
          </Button>
        </Flex>
      </Flex>

      <CustomAlertDialog
        onClose={onClose}
        isOpen={isOpen}
        onDelete={handleDeleteSelectedItems}
        titleHeader=" Xoá mục đã chọn"
        titleBody={`Bạn có chắc chắn muốn xóa ${selectedCount} mục đã chọn? Hành động này không thể hoàn
        tác.`}
        btnName="Xoá"
      />
    </>
  );
};
