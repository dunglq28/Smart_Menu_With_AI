import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { FontAwesome } from "@expo/vector-icons";
import { GlobalStyle } from "../constants/styles";
import LoadingSpinnerOverlay from "react-native-loading-spinner-overlay";
import { recommendMenu } from "../services/MenuService";
import AsyncStorage from "@react-native-async-storage/async-storage";

function CameraScreen({ navigation }) {
  const [isLoading, setIsLoading] = useState(false);
  const [brandLogo, setBrandLogo] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchBrandLogo = async () => {
      const logo = await AsyncStorage.getItem("BrandLogo");
      setBrandLogo(logo);
    };
    fetchBrandLogo();
  }, []);

  const handleMenuOpen = () => {
    navigation.navigate("MenuRecommend");
  };

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert(
        "Xin lỗi, chúng tôi cần quyền truy cập camera để thực hiện chức năng này!"
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
      cameraType: ImagePicker.CameraType.front,    
    });

    if (!result.cancelled && result.assets) {
      // setSelectedImage(result.assets[0].uri);
      setIsLoading(true);
      try {
        const brandId = await AsyncStorage.getItem("BrandId");
        const formData = new FormData();
        formData.append("faceImage", {
          uri: result.assets[0].uri,
          name: "photo.png",
          type: "image/png",
        });
        formData.append("BrandId", brandId);
        const response = await recommendMenu(formData);
        navigation.navigate("MenuRecommend", { menu: response.data.menuImage });
      } catch (error) {
        console.error("Error recommending menu:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {isLoading ? (
        <LoadingSpinnerOverlay
          visible={true}
          textContent={"Đang xử lý..."}
          textStyle={styles.spinnerText}
        />
      ) : (
        <>
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Image
                source={require("../assets/logo.png")}
                style={styles.logo}
              />
            </View>
            <View style={styles.logoContainer}>
              <Image source={{ uri: brandLogo }} style={styles.logo} />
            </View>
          </View>
          <View style={styles.wrapper}>
            <Text style={styles.title}>Ứng dụng Menu Thông Minh</Text>
            <Image
              source={require("../assets/face-id.png")}
              style={styles.faceIcon}
            />
            <Text style={styles.instructions}>
              Đưa camera về phía mặt của bạn để quét
            </Text>
            <TouchableOpacity style={styles.button} onPress={openCamera}>
              <FontAwesome name="camera" size={40} color="white" />
              <Text style={styles.buttonText}>Quét Khuôn Mặt</Text>
            </TouchableOpacity>
            {/* {selectedImage && (
              <Image source={{ uri: selectedImage }} style={styles.image} />
            )} */}
            {/* <TouchableOpacity
              style={styles.loginButton}
              onPress={handleMenuOpen}
            >
              <Text>MenuRecommend</Text>
            </TouchableOpacity> */}
          </View>
        </>
      )}
    </ScrollView>
  );
}

export default CameraScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: GlobalStyle.colors.primary,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 20,
    marginTop: 30,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 100,
    height: 100,
    marginRight: 10,
  },
  wrapper: {
    flex: 1,
    alignItems: "center",
    marginTop: -40,
  },
  faceIcon: {
    width: 350,
    height: 350,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "black",
    marginBottom: 10,
  },
  instructions: {
    fontSize: 18,
    color: "black",
    marginBottom: 20,
  },
  button: {
    backgroundColor: GlobalStyle.colors.darken50,
    paddingTop: 20,
    paddingRight: 30,
    paddingBottom: 20,
    paddingLeft: 30,
    borderRadius: 50,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 20,
    marginLeft: 10,
  },
  image: {
    width: 300,
    height: 300,
    marginTop: 20,
    borderWidth: 2,
    borderColor: "white",
  },
});
