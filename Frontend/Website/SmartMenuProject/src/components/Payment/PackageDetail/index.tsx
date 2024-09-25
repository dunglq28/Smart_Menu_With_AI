import { Flex, Text } from "@chakra-ui/react";
import style from "./PackageDetail.module.scss";

interface PackageDetailProps {
  label: string;
  value: string;
  classNameValue?: string;
}

const PackageDetail = ({
  label,
  value,
  classNameValue = style.packagesDescription,
}: PackageDetailProps) => (
  <Flex justify="space-between" mb={4} className={style.packagesDetails}>
    <Text>{label}</Text>
    <Text className={classNameValue}>{value}</Text>
  </Flex>
);

export default PackageDetail;
