import { Slot } from "expo-router";
import { SafeAreaView, StyleSheet } from "react-native";
// import Toaster from "../components/Toaster"; // Uncomment if you add a Toaster

export default function RootLayout() {
  return (
    <SafeAreaView style={styles.container}>
      <Slot />
      {/* <Toaster /> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
});

