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
import { MdOutlineMoreHoriz } from "react-icons/md";

import style from "./ActionMenuBrand.module.scss";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import ModalForm from "../../Modals/ModalForm/ModalForm";
import ModalFormBrand from "../../Modals/ModalFormBrand/ModalFormBrand";
import { BrandForm } from "../../../models/BrandForm.model";
import { getBrand } from "../../../services/BrandService";
import CustomAlertDialog from "../../AlertDialog";
import { brandUpdate } from "../../../payloads/requests/updateRequests.model";
import { capitalizeWords } from "../../../utils/functionHelper";

interface ActionMenuProps {
  id: number;
  brandName: string;
  onDelete: (id: number) => void;
  onEdit: (brand: brandUpdate) => void;
}

const ActionMenuBrand: FC<ActionMenuProps> = ({
  id,
  brandName,
  onDelete,
  onEdit,
}) => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenBrand,
    onOpen: onOpenBrand,
    onClose: onCloseBrand,
  } = useDisclosure();
  const cancelRef: React.LegacyRef<HTMLButtonElement> = React.useRef(null);
  const navigate = useNavigate();
  //BRAND DATA
  const [brandData, setBrandData] = useState<BrandForm>({
    brandName: {
      value: "",
      errorMessage: "",
    },
    image: {
      value: null,
      errorMessage: "",
    },
  });

  const updateBrandData = (brand: BrandForm, isSave: boolean) => {
    var brandUpdate: brandUpdate = {
      id: id,
      brandName: capitalizeWords(brand.brandName.value),
      image: brand.image.value,
    };
    if (isSave) {
      onEdit(brandUpdate);
    }
  };

  const handleEditClick = async () => {
    var result = await getBrand(id);
    if (result.statusCode === 200) {
      const { brandName, imageUrl } = result.data;

      const updatedBrandData: BrandForm = {
        brandName: { value: brandName, errorMessage: "" },
        image: { value: null, errorMessage: "" },
        imageUrl: { value: imageUrl, errorMessage: "" },
      };
      setBrandData(updatedBrandData);
      onOpenBrand();
    }
  };

  const handleViewClick = (path: string) => {
    switch (path) {
      case "branches":
        navigate(`/branches/${brandName}`, { state: { id, brandName } });
        break;
      default:
        break;
    }
  };

  return (
    <>
      <Flex className={style.SettingBrand}>
        <Popover>
          <PopoverTrigger>
            <Button className={style.SettingsIconBtn}>
              <Flex>
                <MdOutlineMoreHoriz className={style.SettingsIcon} />
              </Flex>
            </Button>
          </PopoverTrigger>
          <PopoverContent className={style.PopoverContent}>
            <PopoverArrow />
            <PopoverBody>
              <Flex
                className={style.PopupButton}
                onClick={() => handleViewClick("branches")}
              >
                <Text className={style.PopupButtonText}>Xem chi nhánh</Text>
              </Flex>
              <Divider />
              <Flex className={style.PopupButton} onClick={handleEditClick}>
                <Text className={style.PopupButtonText}>
                  Cập nhật thương hiệu
                </Text>
              </Flex>
              <Divider />
              <Flex className={style.PopupButton} onClick={onOpen}>
                <Text className={style.PopupButtonText}>Xoá thương hiệu</Text>
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
        titleHeader="Xoá thương hiệu"
        titleBody="Bạn có chắc không? Bạn không thể hoàn tác hành động này sau đó."
        btnName="Xoá"
      />

      <ModalForm
        formBody={
          <ModalFormBrand
            brandData={brandData}
            onClose={onCloseBrand}
            isEdit={true}
            updateBrandData={updateBrandData}
          />
        }
        isEdit={true}
        onClose={onCloseBrand}
        isOpen={isOpenBrand}
        title={t("Cập nhật thương hiệu")}
        updateBrandData={updateBrandData}
      />
    </>
  );
};

export default ActionMenuBrand;
