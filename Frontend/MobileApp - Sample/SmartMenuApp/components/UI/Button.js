import { Pressable, StyleSheet, Text, View } from "react-native";
import { GlobalStyle } from "../../constants/styles";

function Button({ children, onPress, mode, style }) {
  return (
    <View style={style}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => pressed && styles.pressed}
      >
        <View style={[styles.button, mode === "flat" && styles.flat]}>
          <Text style={[styles.buttonText, mode === "flat" && styles.flatText]}>
            {children}
          </Text>
        </View>
      </Pressable>
    </View>
  );
}

export default Button;

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    paddingTop: 20,
    paddingBottom: 20,
    paddingRight: 50,
    paddingLeft: 50,
    backgroundColor: GlobalStyle.colors.primaryButton,
  },
  flat: {
    backgroundColor: "transparent",
  },
  buttonText: {
    color: "white",
    textAlign: "center",
  },
  flatText: {
    color: GlobalStyle.colors.lighten10,
  },
  pressed: {
    opacity: 0.75,
    backgroundColor: GlobalStyle.colors.lighten10,
    borderRadius: 4,
  },
});
