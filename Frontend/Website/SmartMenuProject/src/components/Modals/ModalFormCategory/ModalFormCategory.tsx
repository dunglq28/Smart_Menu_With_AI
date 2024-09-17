import React, { useEffect, useState } from "react";
import {
  Button,
  Flex,
  Input,
  ModalBody,
  ModalFooter,
  Text,
} from "@chakra-ui/react";
import style from "./ModalFormCategory.module.scss";
import { toast } from "react-toastify";
import { CategoryForm } from "../../../models/CategoryForm.model";
import moment from "moment";
import { getCategory } from "../../../services/CategoryService";

interface ModalFormCategoryProps {
  id?: number;
  handleCreate?: (id: number, categoryName: string) => void;
  handleEdit?: (
    cateId: number,
    brandId: number,
    categoryName: string,
    onClose: () => void,
  ) => void;
  onClose: () => void;
  isEdit: boolean;
}

const ModalFormCategory: React.FC<ModalFormCategoryProps> = ({
  id,
  onClose,
  handleCreate,
  isEdit,
  handleEdit,
}) => {
  const brandId = Number(localStorage.getItem("BrandId"));
  const [formData, setFormData] = useState<CategoryForm>({
    categoryName: { value: "", errorMessage: "" },
  });

  useEffect(() => {
    if (isEdit && id) {
      const loadCategoryData = async () => {
        try {
          const category = await getCategory(id);
          if (category) {
            setFormData({
              categoryName: {
                value: category.data.categoryName,
                errorMessage: "",
              },
            });
          } else {
            throw new Error("Category not found");
          }
        } catch (err) {
          console.error("Error fetching category data:", err);
          toast.error("Error fetching category data");
        }
      };

      loadCategoryData();
    }
  }, []);

  const handleChange = (field: keyof CategoryForm, value: string) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: { value, errorMessage: "" },
    }));
  };

  const handleSubmit = async () => {
    const errors = {
      categoryName: formData.categoryName.value
        ? ""
        : "Tên danh mục là bắt buộc",
    };

    const updatedFormData = {
      categoryName: {
        ...formData.categoryName,
        errorMessage: errors.categoryName,
      },
    };

    setFormData(updatedFormData);

    const hasErrors = Object.values(errors).some((error) => error !== "");
    if (!hasErrors) {
      if (!isEdit) {
        handleCreate?.(brandId, formData.categoryName.value);
      } else {
        handleEdit?.(id!, brandId, formData.categoryName.value, onClose);
      }
    }
  };

  return (
    <>
      <ModalBody>
        <Flex className={style.ModalBody}>
          <Flex className={style.ModalBodyItem}>
            <Text className={style.FieldTitle}>Tên danh mục</Text>
            <Input
              className={style.InputField}
              placeholder="VD: Trà"
              value={formData.categoryName.value}
              onChange={(e) => handleChange("categoryName", e.target.value)}
            />
            {formData.categoryName.errorMessage && (
              <Text className={style.ErrorText}>
                {formData.categoryName.errorMessage}
              </Text>
            )}
          </Flex>
          <Flex className={style.ModalBodyItem}>
            <Text className={style.FieldTitle}>
              {" "}
              {isEdit ? "Ngày cập nhật" : "Ngày tạo"}
            </Text>
            <Input
              className={style.InputField}
              readOnly={true}
              value={moment(new Date().toISOString().split("T")[0]).format(
                "DD/MM/YYYY",
              )}
            />
          </Flex>
        </Flex>
      </ModalBody>
      <ModalFooter>
        <Flex className={style.Footer}>
          <Button onClick={() => onClose()}>Huỷ</Button>
          <Button className={style.AddCategoryBtn} onClick={handleSubmit}>
            {isEdit ? "Lưu" : "Tạo mới"}
          </Button>
        </Flex>
      </ModalFooter>
    </>
  );
};

export default ModalFormCategory;
