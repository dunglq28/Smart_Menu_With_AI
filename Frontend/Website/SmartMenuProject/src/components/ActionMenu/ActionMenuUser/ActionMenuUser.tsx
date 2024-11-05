import React, { FC, useState } from "react";
import { useDisclosure } from "@chakra-ui/react";

import { useTranslation } from "react-i18next";

import { Icons } from "@/assets";
import { ActionMenuComponent, CustomAlertDialog, ModalForm, ModalFormUser } from "@/components";
import { UserService } from "@/services";
import { userUpdate } from "@/payloads";
import { UserForm } from "@/models";
import { getGender, getInitialUserForm } from "@/utils";

interface ActionMenuProps {
  id: number;
  onEdit: (id: number, user: userUpdate) => void;
  onDelete: (id: number) => void;
}

const ActionMenuUser: FC<ActionMenuProps> = ({ id, onEdit, onDelete }) => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef: React.LegacyRef<HTMLButtonElement> = React.useRef(null);
  const { isOpen: isOpenUser, onOpen: onOpenUser, onClose: onCloseUser } = useDisclosure();
  // USER DATA
  const [userForm, setUserForm] = useState<UserForm>(getInitialUserForm());

  const handleEditClick = async () => {
    var result = await UserService.getUser(id);

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

  const actionItems = [
    {
      icon: <Icons.edit />,
      label: "Cập nhật người dùng",
      onClick: handleEditClick,
    },
    {
      icon: <Icons.delete />,
      label: "Xoá người dùng",
      onClick: onOpen,
    },
  ];

  const handleDelete = () => {
    onDelete(id);
  };

  return (
    <>
      <ActionMenuComponent title="Cài đặt người dùng" items={actionItems} />

      <CustomAlertDialog
        onClose={onClose}
        isOpen={isOpen}
        onDelete={handleDelete}
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
