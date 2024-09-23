import React, { useEffect, useState } from "react";
import {
  Button,
  Flex,
  Image,
  Input,
  ModalBody,
  ModalFooter,
  Text,
  Textarea,
} from "@chakra-ui/react";
import style from "./ModalFormProduct.module.scss";
import Select from "react-select";
import { getCategoryByBrandId } from "../../../services/CategoryService";
import { toast } from "react-toastify";
import { ProductForm } from "../../../models/ProductForm.model";
import { isImageFile, validateProductForm } from "../../../utils/validation";
import { getProduct } from "../../../services/ProductService";
import { getInitialProductForm } from "../../../utils/initialData";

interface ModalFormProductProps {
  id?: number;
  handleCreate?: (productForm: FormData) => void;
  handleEdit?: (id: number, productForm: FormData) => void;
  onClose: () => void;
  isEdit: boolean;
}

interface CategoryDataSelection {
  categoryId: number;
  categoryCode: string;
  categoryName: string;
}

const ModalFormProduct: React.FC<ModalFormProductProps> = ({
  id,
  onClose,
  handleCreate,
  isEdit,
  handleEdit,
}) => {
  const brandId = Number(localStorage.getItem("BrandId"));
  const [categoryOptions, setCategoryOptions] = useState<
    { value: number; label: string }[]
  >([]);

  const [formData, setFormData] = useState<ProductForm>(getInitialProductForm());

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await getCategoryByBrandId(brandId);
        if (result && Array.isArray(result)) {
          const categories: CategoryDataSelection[] = result.map(
            (category) => ({
              categoryId: category.categoryId,
              categoryCode: category.categoryCode,
              categoryName: category.categoryName,
            }),
          );

          const options = categories.map((category) => ({
            value: category.categoryId,
            label: category.categoryName,
          }));
          setCategoryOptions(options);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        toast.error("Error fetching data");
      }
    };

    loadData();
  }, [brandId]);

  useEffect(() => {
    if (isEdit && id) {
      const loadProductData = async () => {
        try {
          const product = await getProduct(id);
          if (product) {
            setFormData({
              category: { value: product.data.categoryId, errorMessage: "" },
              productName: {
                value: product.data.productName,
                errorMessage: "",
              },
              image: { value: null, errorMessage: "" },
              imageUrl: { value: product.data.imageUrl, errorMessage: "" },
              description: {
                value: product.data.description,
                errorMessage: "",
              },
              price: { value: Number(product.data.price), errorMessage: "" },
            });
          } else {
            throw new Error("Product not found");
          }
        } catch (err) {
          console.error("Error fetching product data:", err);
          toast.error("Error fetching product data");
        }
      };

      loadProductData();
    }
  }, []);

  const handleChange = (field: keyof ProductForm, value: string | number) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: { value, errorMessage: "" },
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const isImage = isImageFile(file);

      if (!isImage) {
        setFormData((prevData) => ({
          ...prevData,
          image: { value: null, errorMessage: "Tệp phải là một hình ảnh" },
        }));
        return;
      }

      setFormData((prevData) => ({
        ...prevData,
        image: { value: file, errorMessage: "" },
        imageUrl: { value: URL.createObjectURL(file), errorMessage: "" },
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

  const handleSubmit = async () => {
    const errors = validateProductForm(formData);

    const updatedFormData = {
      category: { ...formData.category, errorMessage: errors.category },
      productName: {
        ...formData.productName,
        errorMessage: errors.productName,
      },
      image: { ...formData.image, errorMessage: errors.image },
      imageUrl: { ...formData.imageUrl!, errorMessage: "" },
      description: {
        ...formData.description,
        errorMessage: errors.description,
      },
      price: { ...formData.price, errorMessage: errors.price },
    };

    setFormData(updatedFormData);

    const hasErrors = Object.values(errors).some((error) => error !== "");
    if (!hasErrors) {
      const productForm = new FormData();
      productForm.append(
        "CategoryId",
        formData.category.value?.toString() || "",
      );

      productForm.append("ProductName", formData.productName.value);
      productForm.append("Description", formData.description.value);
      productForm.append("Price", formData.price.value?.toString() || "");
      productForm.append("BrandId", brandId?.toString() || "");

      if (formData.image.value) {
        productForm.append("image", formData.image.value);
      }
      if (!isEdit) {
        handleCreate?.(productForm);
      } else {
        handleEdit?.(id!, productForm);
      }
    }
  };

  const imageUrl = formData.image.value
    ? URL.createObjectURL(formData.image.value)
    : formData.imageUrl?.value;

  return (
    <>
      <ModalBody>
        <Flex className={style.ModalBody}>
          <Flex className={style.ModalBodyItem}>
            <Text className={style.FieldTitle}>Loại</Text>
            <Select
              options={categoryOptions}
              closeMenuOnSelect={true}
              className={style.FlavourSelect}
              onChange={(selectedOption) =>
                handleChange("category", selectedOption?.value || 0)
              }
              value={categoryOptions.find(
                (option) => option.value === formData.category.value,
              )}
            />
            {formData.category.errorMessage && (
              <Text className={style.ErrorText}>
                {formData.category.errorMessage}
              </Text>
            )}
          </Flex>
          <Flex className={style.ModalBodyItem}>
            <Text className={style.FieldTitle}>Tên sản phẩm</Text>
            <Input
              className={style.InputField}
              placeholder="VD: Hồng Trà"
              value={formData.productName.value}
              onChange={(e) => handleChange("productName", e.target.value)}
            />
            {formData.productName.errorMessage && (
              <Text className={style.ErrorText}>
                {formData.productName.errorMessage}
              </Text>
            )}
          </Flex>
          <Flex className={style.ModalBodyItem}>
            <Text className={style.FieldTitle}>Hình ảnh</Text>
            {!formData.image.value && !formData.imageUrl?.value && (
              <Input
                type="file"
                className={style.InputFileField}
                onChange={handleImageChange}
              />
            )}
            {(formData.image.value ||
              (formData.imageUrl && formData.imageUrl.value)) && (
              <Button onClick={handleRemoveImage} w={40}>
                Xoá
              </Button>
            )}
            {(formData.image.value ||
              (formData.imageUrl && formData.imageUrl.value)) && (
              <Image
                src={imageUrl}
                alt="Image Preview"
                className={style.imagePreview}
              />
            )}
            {formData.image.errorMessage && (
              <Text className={style.ErrorText}>
                {formData.image.errorMessage}
              </Text>
            )}
          </Flex>
          <Flex className={style.ModalBodyItem}>
            <Text className={style.FieldTitle}>Mô tả</Text>
            <Textarea
              className={style.InputField}
              placeholder="Mô tả"
              value={formData.description.value}
              onChange={(e) => handleChange("description", e.target.value)}
            />
            {formData.description.errorMessage && (
              <Text className={style.ErrorText}>
                {formData.description.errorMessage}
              </Text>
            )}
          </Flex>
          <Flex className={style.ModalBodyItem}>
            <Text className={style.FieldTitle}>Giá</Text>
            <Input
              className={style.InputField}
              placeholder="Giá: 100000"
              value={formData.price.value?.toString()}
              onChange={(e) => handleChange("price", e.target.value)}
            />
            {formData.price.errorMessage && (
              <Text className={style.ErrorText}>
                {formData.price.errorMessage}
              </Text>
            )}
          </Flex>
        </Flex>
      </ModalBody>
      <ModalFooter>
        <Flex className={style.Footer}>
          <Button onClick={() => onClose()}>Huỷ</Button>
          <Button className={style.AddProductBtn} onClick={handleSubmit}>
            {isEdit ? "Lưu" : "Tạo mới"}
          </Button>
        </Flex>
      </ModalFooter>
    </>
  );
};

export default ModalFormProduct;
