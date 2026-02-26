import { Link, Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import Colors from "@/constants/colors";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!", headerStyle: { backgroundColor: Colors.midnight }, headerTintColor: Colors.textPrimary }} />
      <View style={styles.container}>
        <Text style={styles.frog}>🐸</Text>
        <Text style={styles.title}>Lexi got lost!</Text>
        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Jump back home</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: Colors.midnight,
  },
  frog: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  link: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: Colors.electricCyanDim,
    borderRadius: 16,
  },
  linkText: {
    fontSize: 14,
    color: Colors.electricCyan,
    fontWeight: "600",
  },
});
