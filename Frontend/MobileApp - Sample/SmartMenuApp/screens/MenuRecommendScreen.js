import React from "react";
import { Image, StyleSheet, View } from "react-native";

function MenuRecommendScreen({ route }) {
  const { menu } = route.params;
  return (
    <View style={styles.container}>
      <Image style={styles.image} source={{ uri: menu }} />
    </View>
  );
}

export default MenuRecommendScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#B8D7D5",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "fill",
  },
});
