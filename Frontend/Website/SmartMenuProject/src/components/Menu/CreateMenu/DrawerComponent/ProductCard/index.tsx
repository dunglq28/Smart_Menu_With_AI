import React from "react";
import { Flex, Image, Text } from "@chakra-ui/react";
import { ProductData } from "../../../../../payloads/responses/ProductData.model";
import { formatCurrency } from "../../../../../utils/functionHelper";

interface ProductCardProps {
  product: ProductData
  isSelected?: boolean;
  onClick: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onClick,
  isSelected,
}) => {
  return (
    <Flex
      height="305px"
      width="32%"
      justifyContent="center"
      alignItems="center"
      onClick={onClick}
      cursor={isSelected ? "not-allowed" : "pointer"} // Change cursor if product is selected
      opacity={isSelected ? 0.5 : 1} // Reduce opacity if product is selected
    >
      <Flex
        height="300px"
        width="99%"
        bg="#fff"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        padding="20px"
        transition="0.3s"
        borderRadius="15px"
        userSelect="none"
        boxShadow="rgba(0, 0, 0, 0.1) 0px 4px 12px"
        _hover={{
          boxShadow: "rgba(0, 0, 0, 0.2) 0px 8px 24px",
          transform: "scale(1.02)",
        }}
        _active={{
          boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
          transform: "scale(0.98)",
        }}
      >
        <Image src={product.imageUrl} height="50%" borderRadius="10px" />
        <Flex
          flexDirection="column"
          width="100%"
          marginTop="10px"
          overflow="hidden"
          textOverflow="ellipsis"
        >
          <Flex justifyContent="space-between" width="100%">
            <Text fontSize="1.1vw" fontWeight="bold" color="#5A3D41">
              {product.productName}
            </Text>
            <Text fontSize="1vw" fontWeight="bold" color="#5A3D41">
              Giá {formatCurrency(product.price.toString())}
            </Text>
          </Flex>
          <Text fontSize="0.6vw" color="#5A3D41" textAlign="justify">
            {product.description}
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default ProductCard;
