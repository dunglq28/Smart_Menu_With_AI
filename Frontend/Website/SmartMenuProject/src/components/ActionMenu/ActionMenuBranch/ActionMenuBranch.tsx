import React, { FC, useState } from "react";
import { useDisclosure } from "@chakra-ui/react";

import { useTranslation } from "react-i18next";

import { Icons } from "@/assets";
import { BranchService } from "@/services";
import { ActionMenuComponent, CustomAlertDialog, ModalForm, ModalFormBranch } from "@/components";
import { branchUpdate } from "@/payloads";
import { BranchForm } from "@/models";
import { getInitialBranchForm } from "@/utils";

interface ActionMenuProps {
  id: number;
  brandName: string;
  onDelete: (id: number) => void;
  onEdit: (id: number, branch: branchUpdate) => void;
}

const ActionMenuBranch: FC<ActionMenuProps> = ({ id, brandName, onDelete, onEdit }) => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isOpenBranch, onOpen: onOpenBranch, onClose: onCloseBranch } = useDisclosure();
  //BRANCH DATA
  const [branchData, setBranchData] = useState<BranchForm>(getInitialBranchForm());

  const updateBranchData = (branch: BranchForm, isSave: boolean) => {
    var branchUpdate: branchUpdate = {
      id: id,
      city: branch.city.name,
      district: branch.district.name,
      ward: branch.ward.name,
      address: branch.address.value,
      isActive: true,
    };
    onCloseBranch();
    if (isSave) {
      onEdit(id, branchUpdate);
    }
  };

  const handleEditClick = async () => {
    var result = await BranchService.getBranch(id);
    if (result.statusCode === 200) {
      const { storeId, brandId, address, city } = result.data;

      const wardIndex = address.indexOf("Phường");
      const districtIndex = address.indexOf("Quận");
      const streetNumberAndName =
        wardIndex !== -1 ? address.substring(0, wardIndex).trim() : address;
      const ward = wardIndex !== -1 ? address.substring(wardIndex + 6, districtIndex).trim() : "";
      const district = districtIndex !== -1 ? address.substring(districtIndex + 5).trim() : "";

      const updatedBranchData: BranchForm = {
        brandName: {
          id: brandId.toString(),
          value: brandName,
          errorMessage: "",
        },
        city: { id: "", name: city, errorMessage: "" },
        ward: { id: "", name: ward.replace(/,$/, ""), errorMessage: "" },
        district: { id: "", name: district, errorMessage: "" },
        address: {
          value: streetNumberAndName.replace(/,$/, ""),
          errorMessage: "",
        },
      };
      setBranchData(updatedBranchData);
      onOpenBranch();
    }
  };

  const handleDelete = () => {
    onDelete(id);
  };

  const actionItems = [
    {
      icon: <Icons.edit />,
      label: "Cập nhật chi nhánh",
      onClick: handleEditClick,
    },
    {
      icon: <Icons.delete />,
      label: "Xoá chi nhánh",
      onClick: onOpen,
    },
  ];

  return (
    <>
      <ActionMenuComponent title="Cài đặt chi nhánh" items={actionItems} />

      <CustomAlertDialog
        onClose={onClose}
        isOpen={isOpen}
        onDelete={handleDelete}
        titleHeader="Xoá chi nhánh"
        titleBody="Bạn có chắc không? Bạn không thể hoàn tác hành động này sau đó."
        btnName="Xoá"
      />

      <ModalForm
        formBody={
          <ModalFormBranch
            branchData={branchData}
            onClose={onCloseBranch}
            isEdit={true}
            updateBranchData={updateBranchData}
          />
        }
        isEdit={true}
        onClose={onCloseBranch}
        isOpen={isOpenBranch}
        title={t("Cập nhật chi nhánh")}
        updateBranchData={updateBranchData}
      />
    </>
  );
};

export default ActionMenuBranch;
