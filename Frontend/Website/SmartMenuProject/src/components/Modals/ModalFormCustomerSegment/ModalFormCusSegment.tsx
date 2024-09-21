import React, { useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  Flex,
  Input,
  ModalBody,
  ModalFooter,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Text,
} from "@chakra-ui/react";
import style from "./ModalFormCusSegment.module.scss";
import { toast } from "react-toastify";
import { CustomerSegmentForm } from "../../../models/SegmentForm.model";
import { isInteger, validateCustomerSegmentForm } from "../../../utils/validation";
import { customerSegmentUpdate } from "../../../payloads/requests/updateRequests.model";
import { customerSegmentCreate } from "../../../payloads/requests/createRequests.model";
import { getCustomerSegment } from "../../../services/CustomerSegmentService";

interface ModalFormCustomerSegmentProps {
  formData: CustomerSegmentForm;
  setFormData: React.Dispatch<React.SetStateAction<CustomerSegmentForm>>;
  id?: number;
  handleCreate?: (brandId: number, segment: customerSegmentCreate) => void;
  handleEdit?: (
    brandId: number,
    segmentId: number,
    segment: customerSegmentUpdate,
    onClose: () => void,
  ) => void;
  onClose: () => void;
  isEdit: boolean;
}

const ModalFormCustomerSegment: React.FC<ModalFormCustomerSegmentProps> = ({
  formData,
  setFormData,
  id,
  onClose,
  handleCreate,
  isEdit,
  handleEdit,
}) => {
  const brandId = Number(localStorage.getItem("BrandId"));

  useEffect(() => {
    if (isEdit && id) {
      const loadCustomerSegmentData = async () => {
        try {
          const customerSegment = await getCustomerSegment(id);
          if (customerSegment) {
            const [ageFrom, ageTo] = customerSegment.data.age.split("-");

            const [gender, ...sessions] =
              customerSegment.data.demographic.split(", ");
            setFormData({
              segmentName: {
                value: customerSegment.data.customerSegmentName,
                errorMessage: "",
              },
              ageFrom: {
                value: ageFrom,
                errorMessage: "",
              },
              ageTo: {
                value: ageTo,
                errorMessage: "",
              },
              gender: {
                value: gender,
                errorMessage: "",
              },
              sessions: {
                value: sessions,
                errorMessage: "",
              },
            });
          } else {
            throw new Error("Customer Segment not found");
          }
        } catch (err) {
          console.error("Error fetching customer segment data:", err);
          toast.error("Error fetching customer segment data");
        }
      };

      loadCustomerSegmentData();
    }
  }, []);

  const handleChange = (
    field: keyof CustomerSegmentForm,
    value: string | string[],
  ) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: { value, errorMessage: "" },
    }));
  };

  const handleCheckboxChange = (value: string) => {
    setFormData((prevFormData) => {
      const sessions = prevFormData.sessions.value.includes(value)
        ? prevFormData.sessions.value.filter((session) => session !== value)
        : [...prevFormData.sessions.value, value];

      return {
        ...prevFormData,
        sessions: { value: sessions, errorMessage: "" },
      };
    });
  };

  const handleRadioChange = (value: string) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      sessions: { value: [value], errorMessage: "" },
    }));
  };

  const handleSubmit = async () => {
    const errors = validateCustomerSegmentForm(formData);

    const updatedFormData = {
      segmentName: {
        ...formData.segmentName,
        errorMessage: errors.segmentName,
      },
      gender: { ...formData.gender, errorMessage: "" },
      sessions: { ...formData.sessions, errorMessage: errors.sessions },
      ageFrom: { ...formData.ageFrom, errorMessage: errors.ageFrom },
      ageTo: { ...formData.ageTo, errorMessage: errors.ageTo },
    };

    setFormData(updatedFormData);

    const hasErrors = Object.values(errors).some((error) => error !== "");
    if (!hasErrors) {
      const genders = [];

      if (
        formData.gender.value.toLowerCase() === "nam" ||
        formData.gender.value.toLowerCase() === "male"
      ) {
        genders.push(formData.gender.value);
      } else if (
        formData.gender.value.toLowerCase() === "nữ" ||
        formData.gender.value.toLowerCase() === "female"
      ) {
        genders.push(formData.gender.value);
      } else if (formData.gender.value.toLowerCase() === "both") {
        genders.push("Male");
        genders.push("Female");
      } else if (formData.gender.value.toLowerCase() === "cả hai") {
        genders.push("Nam");
        genders.push("Nữ");
      }

      if (!isEdit) {
        var customerSegmentCreate: customerSegmentCreate = {
          segmentName: formData.segmentName.value,
          age: `${formData.ageFrom.value}-${formData.ageTo.value}`,
          gender: genders,
          session: formData.sessions.value,
        };

        handleCreate?.(brandId, customerSegmentCreate);
      } else {
        var customerSegmentUpdate: customerSegmentUpdate = {
          segmentName: formData.segmentName.value,
          age: `${formData.ageFrom.value}-${formData.ageTo.value}`,
          gender: formData.gender.value,
          session: formData.sessions.value[0],
        };
        handleEdit?.(brandId, id!, customerSegmentUpdate, onClose);
      }
    }
  };

  return (
    <>
      <ModalBody>
        <Flex className={style.ModalBody}>
          <Flex className={style.Row}>
            <Flex className={style.ModalBodyItem}>
              <Text className={style.FieldTitle}>Tên phân khúc khách hàng</Text>
              <Input
                className={style.InputField}
                value={formData.segmentName.value}
                placeholder="VD: Phân Khúc Trẻ"
                onChange={(e) => handleChange("segmentName", e.target.value)}
              />
              {formData.segmentName.errorMessage && (
                <Text className={style.ErrorText}>
                  {formData.segmentName.errorMessage}
                </Text>
              )}
            </Flex>
            <Flex className={style.ModalBodyItem}>
              <Text className={style.FieldTitle}>Giới tính</Text>
              <Select
                className={style.InputField}
                value={formData.gender.value}
                onChange={(e) => handleChange("gender", e.target.value)}
              >
                <option value="Male">Nam</option>
                <option value="Female">Nữ</option>
                {!isEdit && <option value="Both">Cả hai</option>}
              </Select>
              {formData.gender.errorMessage && (
                <Text className={style.ErrorText}>
                  {formData.gender.errorMessage}
                </Text>
              )}
            </Flex>
          </Flex>
          <Flex className={style.ModalBodyItem}>
            <Text className={style.FieldTitle}>Thời gian</Text>
            {!isEdit ? (
              <Flex className={style.CheckboxGroup}>
                <Checkbox
                  className={style.checkboxItem}
                  isChecked={formData.sessions.value.includes("Morning")}
                  onChange={() => handleCheckboxChange("Morning")}
                >
                  Buổi sáng
                </Checkbox>
                <Checkbox
                  className={style.checkboxItem}
                  isChecked={formData.sessions.value.includes("Afternoon")}
                  onChange={() => handleCheckboxChange("Afternoon")}
                >
                  Buối trưa
                </Checkbox>
                <Checkbox
                  className={style.checkboxItem}
                  isChecked={formData.sessions.value.includes("Evening")}
                  onChange={() => handleCheckboxChange("Evening")}
                >
                  Buổi chiều
                </Checkbox>
              </Flex>
            ) : (
              <RadioGroup
                className={style.RadioGroup}
                value={formData.sessions.value[0]}
                onChange={handleRadioChange}
              >
                <Stack direction="row">
                  <Radio value="Morning">Buổi sáng</Radio>
                  <Radio value="Afternoon">Buổi trưa</Radio>
                  <Radio value="Evening">Buổi chiều</Radio>
                </Stack>
              </RadioGroup>
            )}
            {formData.sessions.errorMessage && (
              <Text className={style.ErrorText}>
                {formData.sessions.errorMessage}
              </Text>
            )}
          </Flex>

          <Flex className={style.Row}>
            <Flex className={style.ModalBodyItem}>
              <Text className={style.FieldTitle}>Tuổi bắt đầu</Text>
              <Input
                className={style.InputField}
                value={formData.ageFrom.value}
                placeholder="Định dạng: 18"
                onChange={(e) => handleChange("ageFrom", e.target.value)}
              />
              {formData.ageFrom.errorMessage && (
                <Text className={style.ErrorText}>
                  {formData.ageFrom.errorMessage}
                </Text>
              )}
            </Flex>
            <Flex className={style.ModalBodyItem}>
              <Text className={style.FieldTitle}>Tuổi kết thúc</Text>
              <Input
                className={style.InputField}
                value={formData.ageTo.value}
                placeholder="Định dạng: 25"
                onChange={(e) => handleChange("ageTo", e.target.value)}
              />
              {formData.ageTo.errorMessage && (
                <Text className={style.ErrorText}>
                  {formData.ageTo.errorMessage}
                </Text>
              )}
            </Flex>
          </Flex>
        </Flex>
      </ModalBody>
      <ModalFooter>
        <Flex className={style.Footer}>
          <Button
            variant="ghost"
            backgroundColor="#ccc"
            onClick={() => onClose()}
          >
            Huỷ
          </Button>
          <Button className={style.AddSegmentBtn} onClick={handleSubmit}>
            {isEdit ? "Lưu" : "Tạo mới"}
          </Button>
        </Flex>
      </ModalFooter>
    </>
  );
};

export default ModalFormCustomerSegment;
