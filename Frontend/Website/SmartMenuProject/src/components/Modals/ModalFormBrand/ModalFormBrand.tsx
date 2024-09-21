import React, { useState } from "react";
import {
  ModalBody,
  Flex,
  Box,
  Input,
  Text,
  Image,
  Button,
  ModalFooter,
} from "@chakra-ui/react";

import styles from "./ModalFormBrand.module.scss";
import { BrandForm } from "../../../models/BrandForm.model";
import {
  isImageFile,
  validateBrandForm,
} from "../../../utils/validation";
import { getInitialBrandForm } from "../../../utils/initialData";
import { getBrandByBrandName } from "../../../services/BrandService";

interface ModalFormBrandProps {
  brandData: BrandForm;
  onClose: () => void;
  updateBrandData: (brand: BrandForm, isSave: boolean) => void;
  nextHandler?: () => void;
  isEdit: boolean;
}

const ModalFormBrand: React.FC<ModalFormBrandProps> = ({
  brandData,
  onClose,
  updateBrandData,
  nextHandler,
  isEdit,
}) => {
  const [formData, setFormData] = useState<BrandForm>({
    brandName: { value: brandData.brandName.value, errorMessage: "" },
    image: { value: brandData.image.value, errorMessage: "" },
    imageUrl: {
      value: brandData.imageUrl?.value ? brandData.imageUrl?.value : "",
      errorMessage: "",
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const isImage = isImageFile(file);

      if (!isImage) {
        setFormData((prevData) => ({
          ...prevData,
          image: { value: null, errorMessage: "Tệp phải là hình ảnh" },
        }));
        return;
      }

      setFormData((prevData) => ({
        ...prevData,
        image: { value: file, errorMessage: "" },
        imageName: { value: file.name, errorMessage: "" },
      }));
    }
  };

  const handleRemoveImage = () => {
    setFormData((prevData) => ({
      ...prevData,
      image: { value: null, errorMessage: "" },
      imageUrl: { value: "", errorMessage: "" },
    }));
  };

  const handleBrandNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevData) => ({
      ...prevData,
      brandName: { value: e.target.value, errorMessage: "" },
    }));
  };

  const cancelHandler = () => {
    updateBrandData?.(getInitialBrandForm(), false);
    onClose();
  };

  const handleNextForm = async () => {
    const errors = validateBrandForm(formData);
    const updatedFormData = {
      brandName: { ...formData.brandName, errorMessage: errors.brandName },
      image: { ...formData.image, errorMessage: errors.image },
    };

    setFormData(updatedFormData);
    const hasError = Object.values(errors).some((error) => error !== "");

    if (!hasError) {
      updateBrandData?.(formData, true);
      if (nextHandler) {
        const result = await getBrandByBrandName(formData.brandName.value);
        if (result.data == null) {
          nextHandler();
        } else {
          setFormData((prevData) => ({
            ...prevData,
            brandName: {
              ...prevData.brandName,
              errorMessage: "Tên thương hiệu đã tồn tại",
            },
          }));
        }
      }
    }
  };

  const imageUrl = formData.image.value
    ? URL.createObjectURL(formData.image.value)
    : formData.imageUrl?.value;

  return (
    <>
      <ModalBody>
        <Flex
          direction="column"
          alignItems="stretch"
          className={styles.containerForm}
        >
          <Flex justify="space-between" mb={3}>
            <Box flex="1" ml={2}>
              <Text className={styles.textFontWeight600} py={3} pr={3}>
                Tên thương hiệu
              </Text>
              <Input
                value={formData.brandName.value}
                onChange={handleBrandNameChange}
                placeholder="Tên thương hiệu"
                pl={3}
              />
              {formData.brandName.errorMessage && (
                <Text color="red.500">{formData.brandName.errorMessage}</Text>
              )}
              <Box mt={2}>
                <Text className={styles.textFontWeight600} py={3} pr={3}>
                  Logo thương hiệu
                </Text>
                <Flex align="center">
                  {!formData.image.value && !formData.imageUrl?.value && (
                    <Input
                      type="file"
                      className={styles.inputImage}
                      onChange={handleImageChange}
                    />
                  )}
                  {(formData.image.value ||
                    (formData.imageUrl && formData.imageUrl.value)) && (
                    <Button onClick={handleRemoveImage} ml={3}>
                      Xoá
                    </Button>
                  )}
                </Flex>
                {(formData.image.value ||
                  (formData.imageUrl && formData.imageUrl.value)) && (
                  <Image
                    src={imageUrl}
                    alt="Image Preview"
                    className={styles.imagePreview}
                  />
                )}
                {formData.image.errorMessage && (
                  <Text color="red.500">{formData.image.errorMessage}</Text>
                )}
              </Box>
            </Box>
          </Flex>
        </Flex>
      </ModalBody>
      <ModalFooter>
        <Flex>
          <Button className={styles.CancelBtn} onClick={cancelHandler}>
            Huỷ
          </Button>
          <Button onClick={handleNextForm} className={styles.MainBtn}>
            {isEdit ? "Lưu" : "Tiếp tục"}
          </Button>
        </Flex>
      </ModalFooter>
    </>
  );
};

export default ModalFormBrand;
