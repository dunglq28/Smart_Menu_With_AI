import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { GlobalStyle } from "../constants/styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const logoutHandler = async (navigation) => {
  try {
    await AsyncStorage.clear();
    navigation.navigate("Login");
  } catch (e) {
    console.error("Error clearing AsyncStorage:", e);
  }
};

function ProfileScreen() {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => logoutHandler(navigation)}
        >
          <Text style={styles.logoutButtonText}>ĐĂNG Xuất</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: GlobalStyle.colors.primary,
  },
  logoutButton: {
    width: "100%",
    padding: 15,
    backgroundColor: GlobalStyle.colors.primaryButton,
    alignItems: "center",
    borderRadius: 5,
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
