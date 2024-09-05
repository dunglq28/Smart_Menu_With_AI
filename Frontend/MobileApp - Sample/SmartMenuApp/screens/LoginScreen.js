import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Image,
} from "react-native";
import { GlobalStyle } from "../constants/styles";
import Icon from "react-native-vector-icons/Ionicons";
import Toast from "react-native-toast-message";
import { login } from "../services/AuthenticationService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoadingSpinnerOverlay from "react-native-loading-spinner-overlay";
import { UserRole } from "../constants/Enum";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

function LoginScreen({ navigation }) {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const handleChange = (name, value) => {
    setCredentials({ ...credentials, [name]: value });
  };

  const handleShowClick = () => setShowPassword(!showPassword);

  const loginHandler = async () => {
    if (!credentials.username || !credentials.password) {
      Toast.show({
        type: "error",
        text1: "Vui lòng nhập tài khoản và mật khẩu",
      });
      return;
    }

    try {
      setIsLoading(true);
      const response = await login(credentials.username, credentials.password);
      if (response && response.statusCode === 200) {
        if (
          response.data.roleId.toString() === UserRole.Admin.toString() ||
          response.data.roleId.toString() === UserRole.BrandManager.toString()
        ) {
          Toast.show({
            type: "error",
            text1: "Bạn không có quyền truy cập vào ứng dụng",
          });
        } else {
          AsyncStorage.setItem("UserId", response.data.userId.toString());
          AsyncStorage.setItem("AccessToken", response.data.token.accessToken);
          AsyncStorage.setItem(
            "RefreshToken",
            response.data.token.refreshToken
          );
          Toast.show({
            type: "success",
            text1: "Đăng nhập thành công",
          });
          setCredentials({
            username: "",
            password: "",
          });
          navigation.navigate("HomeOverview");
        }
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Có lỗi xảy ra, vui lòng thử lại",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View style={styles.leftContainer}>
        <Image source={require("../assets/wave.png")} style={styles.wave} />
        <Image source={require("../assets/bg.png")} style={styles.bg} />
      </View>
      <View style={styles.rightContainer}>
        <View style={styles.formContainer}>
          <View style={styles.headerContainer}>
            <Image
              source={require("../assets/avatar.png")}
              style={styles.avatar}
            />
            <Text style={styles.welcomeText}>CHÀO MỪNG</Text>
          </View>
          <View style={styles.inputContainer}>
            <View style={styles.inputGroup}>
              <Icon name="person" size={20} color="gray" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Tên đăng nhập"
                value={credentials.username}
                onChangeText={(text) => handleChange("username", text)}
              />
            </View>
            <View style={styles.inputGroup}>
              <Icon
                name="lock-closed"
                size={20}
                color="gray"
                style={styles.icon}
              />
              <TextInput
                style={styles.input}
                placeholder="Mật khẩu"
                secureTextEntry={!showPassword}
                value={credentials.password}
                onChangeText={(text) => handleChange("password", text)}
              />
              <TouchableOpacity
                onPress={handleShowClick}
                style={styles.showPasswordButton}
              >
                <Text>{showPassword ? "Ẩn" : "Hiện"}</Text>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity style={styles.loginButton} onPress={loginHandler}>
            <Text style={styles.loginButtonText}>ĐĂNG NHẬP</Text>
          </TouchableOpacity>
        </View>
      </View>
      <LoadingSpinnerOverlay
        visible={isLoading}
        textContent={"Đang đăng nhập..."}
        textStyle={styles.spinnerText}
      />
      {/* <Toast ref={(ref) => Toast.setRef(ref)} /> */}
    </KeyboardAvoidingView>
  );
}

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#fff",
  },
  leftContainer: {
    width: "40%",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  wave: {
    position: "absolute",
    height: "100%",
    width: "100%",
  },
  bg: {
    height: "100%",
    width: "100%",
    zIndex: 0,
    marginLeft: "30%",
  },
  rightContainer: {
    width: "60%",
    justifyContent: "center",
    alignItems: "center",
  },
  formContainer: {
    width: "80%",
    alignItems: "center",
  },
  headerContainer: {
    alignItems: "center",
  },
  avatar: {
    width: 100,
    height: 100,
  },
  welcomeText: {
    fontSize: 36,
    fontWeight: "bold",
    marginTop: 20,
  },
  inputContainer: {
    width: "100%",
    marginTop: 30,
  },
  inputGroup: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 20,
  },
  icon: {
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    height: 40,
    padding: 10,
  },
  showPasswordButton: {
    padding: 10,
  },
  loginButton: {
    width: "100%",
    padding: 15,
    backgroundColor: GlobalStyle.colors.primaryButton,
    alignItems: "center",
    borderRadius: 5,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
