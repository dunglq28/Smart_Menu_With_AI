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

import style from "./ActionMenuBranch.module.scss";
import { useTranslation } from "react-i18next";
import ModalForm from "../../Modals/ModalForm/ModalForm";
import CustomAlertDialog from "../../AlertDialog";
import { BranchForm } from "../../../models/BranchForm.model";
import ModalFormBranch from "../../Modals/ModalFormBranch/ModalFormBranch";
import { RiSettings3Line } from "react-icons/ri";
import { getBranch } from "../../../services/BranchService";
import { branchUpdate } from "../../../payloads/requests/updateRequests.model";
import { getInitialBranchForm } from "../../../utils/initialData";

interface ActionMenuProps {
  id: number;
  brandName: string;
  onDelete: (id: number) => void;
  onEdit: (branch: branchUpdate) => void;
}

const ActionMenuBranch: FC<ActionMenuProps> = ({
  id,
  brandName,
  onDelete,
  onEdit,
}) => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenBranch,
    onOpen: onOpenBranch,
    onClose: onCloseBranch,
  } = useDisclosure();
  const cancelRef: React.LegacyRef<HTMLButtonElement> = React.useRef(null);
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
      onEdit(branchUpdate);
    }
  };

  const handleEditClick = async () => {
    var result = await getBranch(id);
    if (result.statusCode === 200) {
      const { storeId, brandId, address, city } = result.data;

      const wardIndex = address.indexOf("Phường");
      const districtIndex = address.indexOf("Quận");
      const streetNumberAndName =
        wardIndex !== -1 ? address.substring(0, wardIndex).trim() : address;
      const ward =
        wardIndex !== -1
          ? address.substring(wardIndex + 6, districtIndex).trim()
          : "";
      const district =
        districtIndex !== -1 ? address.substring(districtIndex + 5).trim() : "";

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

  return (
    <>
      <Flex className={style.SettingBranch}>
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
              <Divider />
              <Flex className={style.PopupButton} onClick={handleEditClick}>
                <Text className={style.PopupButtonText}>Cập nhật chi nhánh</Text>
              </Flex>
              <Divider />
              <Flex className={style.PopupButton} onClick={onOpen}>
                <Text className={style.PopupButtonText}>Xoá chi nhánh</Text>
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
