import React from "react";
import { View, StyleSheet, Image, ImageBackground, Text } from "react-native";
import Button from "../components/UI/Button";
import { GlobalStyle } from "../constants/styles";

function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View>
        <ImageBackground
          source={require("../assets/Vector.png")}
          style={styles.background}
        >
          <Image
            source={require("../assets/welcome.png")}
            style={styles.imgWelcome}
          />
        </ImageBackground>
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.welcomeText}>Chào mừng</Text>
        <Text style={styles.description}>
          Chọn món dựa trên menu thông minh. Tận hưởng trải nghiệm đơn giản và
          hiệu quả để chọn món phù hợp với bạn
        </Text>
        <Button
          style={styles.button}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.buttonText}>Bắt Đầu</Text>
        </Button>
      </View>
    </View>
  );
}

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: GlobalStyle.colors.primary,
  },
  background: {
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 50,
    paddingVertical: 8,
  },
  imgWelcome: {
    width: 400,
    height: 400,
    marginBottom: 30,
  },
  contentContainer: {
    marginTop: 50,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  welcomeText: {
    color: "black",
    fontSize: 25,
    marginBottom: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  description: {
    color: "black",
    fontSize: 25,
    marginBottom: 20,
    paddingHorizontal: 200,
    textAlign: "center",
  },
  button: {
    minWidth: 300,
  },
  buttonText: {
    color: "white",
    fontSize: 30,
    marginLeft: 10,
  },
});
