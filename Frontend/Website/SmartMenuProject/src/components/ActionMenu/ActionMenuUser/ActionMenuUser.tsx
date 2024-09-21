import React, { FC, useState } from "react";
import {
  Button,
  Divider,
  Flex,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { RiSettings3Line } from "react-icons/ri";

import style from "./ActionMenuUser.module.scss";
import ModalForm from "../../Modals/ModalForm/ModalForm";
import ModalFormUser from "../../Modals/ModalFormUser/ModalFormUser";
import { useTranslation } from "react-i18next";
import { UserForm } from "../../../models/UserForm.model";
import { getInitialUserForm } from "../../../utils/initialData";
import { getUser } from "../../../services/UserService";
import CustomAlertDialog from "../../AlertDialog";
import { userUpdate } from "../../../payloads/requests/updateRequests.model";
import { getGender } from "../../../utils/functionHelper";

interface ActionMenuProps {
  id: number;
  onEdit: (id: number, user: userUpdate) => void;
  onDelete: (id: number) => void;
}

const ActionMenuUser: FC<ActionMenuProps> = ({ id, onEdit, onDelete }) => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef: React.LegacyRef<HTMLButtonElement> = React.useRef(null);
  const {
    isOpen: isOpenUser,
    onOpen: onOpenUser,
    onClose: onCloseUser,
  } = useDisclosure();
  // USER DATA
  const [userForm, setUserForm] = useState<UserForm>(getInitialUserForm());

  const handleEditClick = async () => {
    var result = await getUser(id);

    if (result.statusCode === 200) {
      
      const { fullname, userName, phone, dob, gender, isActive } = result.data;

      const updatedUserData: UserForm = {
        fullName: { value: fullname, errorMessage: "" },
        userName: { value: userName, errorMessage: "" },
        phoneNumber: { value: phone, errorMessage: "" },
        DOB: { value: new Date(dob), errorMessage: "" },
        gender: { value: getGender(gender), errorMessage: "" },
        isActive: { value: isActive ? 1 : 0, errorMessage: "" },
      };
      setUserForm(updatedUserData);
      onOpenUser();
    }
  };

  const updateUserData = (user: UserForm, isSave: boolean) => {
    var userUpdate: userUpdate = {
      fullname: user.fullName.value,
      dob: user.DOB.value ? user.DOB.value.toISOString().split("T")[0] : "",
      gender: user.gender.value,
      phone: user.phoneNumber.value,
      isActive: Number(user.isActive.value) == 1 ? true : false,
      updateBy: Number(localStorage.getItem("UserId")),
    };
    onCloseUser();
    if (isSave) {
      onEdit(id, userUpdate);
    }
  };

  return (
    <>
      <Flex className={style.SettingUser}>
        <Popover>
          <PopoverTrigger>
            <Button className={style.SettingsIconBtn}>
              <Flex>
                <RiSettings3Line className={style.SettingsIcon} />
              </Flex>
            </Button>
          </PopoverTrigger>
          <PopoverContent className={style.PopoverContent}>
            <PopoverArrow />
            <PopoverBody>
              <Flex className={style.PopupButton} onClick={handleEditClick}>
                <Text className={style.PopupButtonText}>Cập nhật người dùng</Text>
              </Flex>
              <Divider />
              <Flex className={style.PopupButton} onClick={onOpen}>
                <Text className={style.PopupButtonText}>Xoá người dùng</Text>
              </Flex>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </Flex>

      <CustomAlertDialog
        onClose={onClose}
        isOpen={isOpen}
        id={id}
        onDelete={onDelete}
        titleHeader="Xoá người dùng"
        titleBody="Bạn có chắc không? Bạn không thể hoàn tác hành động này sau đó."
        btnName="Xoá"
      />

      <ModalForm
        formBody={
          <ModalFormUser
            onClose={onCloseUser}
            userData={userForm}
            isEdit={true}
            updateUserData={updateUserData}
          />
        }
        isEdit={true}
        onClose={onCloseUser}
        isOpen={isOpenUser}
        title={t("Cập nhật người dùng")}
      />
    </>
  );
};

export default ActionMenuUser;
