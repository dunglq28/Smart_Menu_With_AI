import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { GlobalStyle } from "../constants/styles";
import AsyncStorage from "@react-native-async-storage/async-storage";

const categories = [
  { id: 1, name: "Cà phê" },
  { id: 2, name: "Sinh tố" },
  { id: 3, name: "Nước ép" },
];
import { getBrandOfStoreByUserId } from "../services/BranchService";
import { getCategoriesByBrandId } from "../services/CategoryService";
import { getProductsByCategory } from "../services/ProductService";

const HomeScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [brand, setBrand] = useState();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const userId = await AsyncStorage.getItem("UserId");
        const result = await getBrandOfStoreByUserId(userId);
        if (result.statusCode === 200) {
          setBrand(result.data);
          await AsyncStorage.setItem("BrandId", result.data.brandId.toString());
          await AsyncStorage.setItem(
            "BrandName",
            result.data.brandName.toString()
          );
          await AsyncStorage.setItem(
            "BrandLogo",
            result.data.imageUrl.toString()
          );
          const cate = await getCategoriesByBrandId(result.data.brandId);
          if (cate) {
            setCategories(cate);
            setActiveCategory(cate[0].categoryId);
            const initialProducts = await getProductsByCategory(
              result.data.brandId,
              cate[0].categoryId
            );
            setProducts(initialProducts.list);
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCategoryPress = async (categoryId) => {
    setActiveCategory(categoryId); // Cập nhật danh mục được chọn
    const productsByCategory = await getProductsByCategory(
      brand.brandId,
      categoryId
    );
    setProducts(productsByCategory.list);
  };

  // Render item cho FlatList trong cart
  const renderDrinkItem = ({ item }) => (
    <View key={item.id} style={[styles.drinkItem, { backgroundColor: "#fff" }]}>
      <Image source={{ uri: item.imageUrl }} style={styles.drinkImage} />
      <View style={styles.drinkInfo}>
        <View style={styles.drinkDetails}>
          <Text style={styles.drinkName}>{item.productName}</Text>
          <Text style={styles.drinkDescription}>{item.description}</Text>
        </View>
        <Text style={styles.drinkPrice}>
          {item.price.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          })}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Sidebar */}
      <ScrollView
        style={styles.sidebar}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <ImageBackground
          source={require("../assets/bgTitle.png")}
          style={styles.categoryTitle}
        >
          <Text style={styles.categoryTitleText}>Loại đồ uống</Text>
        </ImageBackground>
        <View style={styles.categoryList}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.categoryId}
              style={[
                styles.categoryItem,
                category.categoryId === activeCategory
                  ? styles.activeCategoryItem
                  : null,
              ]}
              onPress={() => handleCategoryPress(category.categoryId)}
            >
              <Text
                style={[
                  styles.categoryName,
                  category.categoryId === activeCategory
                    ? styles.activeCategoryText
                    : null,
                ]}
              >
                {category.categoryName}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Cart */}
      <View style={styles.cartContainer}>
        <View style={styles.cartHeader}>
          <ImageBackground
            source={require("../assets/bgTitle2.png")}
            style={styles.cartTitle}
          >
            <Text style={styles.cartTitleText}>Món nước</Text>
          </ImageBackground>
          {brand?.imageUrl && (
            <Image
              source={{ uri: brand.imageUrl }}
              style={styles.brandImage}
              resizeMode="contain"
            />
          )}
        </View>
        <FlatList
          style={styles.cart}
          data={products}
          numColumns={3}
          renderItem={renderDrinkItem}
          keyExtractor={(item) => item.productId.toString()}
          contentContainerStyle={{ paddingHorizontal: 20 }}
        />
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  sidebar: {
    flex: 1,
    backgroundColor: GlobalStyle.colors.sidebarColor,
    paddingTop: 50,
    paddingHorizontal: 5,
    maxWidth: "20%",
  },
  categoryTitle: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: 50,
  },
  categoryTitleText: {
    fontSize: 18,
    fontWeight: "bold",
    color: GlobalStyle.colors.titleColor,
  },
  categoryList: {
    flex: 1,
    justifyContent: "flex-start",
    borderRadius: 8,
    paddingTop: 20,
    paddingHorizontal: 10,
  },
  categoryItem: {
    alignItems: "center",
    paddingVertical: 15,
    marginBottom: 14,
    marginRight: 10,
    borderRadius: 8,
  },
  activeCategoryItem: {
    backgroundColor: GlobalStyle.colors.darken50,
  },
  activeCategoryText: {
    color: "#fff",
  },
  categoryName: {
    fontSize: 14,
    textAlign: "center",
    fontWeight: "bold",
    color: GlobalStyle.colors.textColor,
  },
  cartContainer: {
    flex: 4,
    backgroundColor: GlobalStyle.colors.homeBackground,
  },
  cartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 24,
    marginBottom: 4,
    paddingHorizontal: 20,
    zIndex: 999,
  },
  cartTitle: {
    justifyContent: "center",
    alignItems: "center",
    width: 250,
    height: 50,
  },
  cartTitleText: {
    fontSize: 20,
    fontWeight: "bold",
    color: GlobalStyle.colors.titleColor,
  },
  brandImage: {
    width: 100,
    height: 100,
  },
  cart: {
    marginTop: -12,
  },
  drinkItem: {
    flex: 1,
    margin: 8,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#e0e0e0",
  },
  drinkImage: {
    width: 150,
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
  },
  drinkInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 10,
  },
  drinkDetails: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    flex: 1,
  },
  drinkName: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "left",
    marginTop: 10,
    color: GlobalStyle.colors.textColor,
  },
  drinkDescription: {
    fontSize: 12,
    textAlign: "left",
    color: GlobalStyle.colors.textColor,
  },
  drinkPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: GlobalStyle.colors.textColor,
  },
});
