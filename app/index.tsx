import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Pressable,
  Animated,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { BlurView } from "expo-blur";
import { auth } from './firebaseConfig'; // Ensure firebaseConfig is set up correctly
import { signInWithEmailAndPassword } from "firebase/auth"; // Firebase auth import

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [rememberMe, setRememberMe] = useState<boolean>(false);

  // Animated Opacity for GIF fade-in
  const gifOpacity = useState(new Animated.Value(0))[0];

  useEffect(() => {
    Animated.timing(gifOpacity, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  // Handle login using Firebase Auth
  const handleLogin = () => {
    if (!email || !password) {
      // Show an alert when either email or password is missing
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        console.log("User logged in:", email);
        router.push("/home"); // Redirect to home page after successful login
      })
      .catch((error) => {
        // Handle specific Firebase errors
        let errorMessage = "An error occurred. Please try again later.";
        
        if (error.code === "auth/invalid-email") {
          errorMessage = "The email address is badly formatted.";
        } else if (error.code === "auth/user-disabled") {
          errorMessage = "This user has been disabled.";
        } else if (error.code === "auth/user-not-found") {
          errorMessage = "No user found with this email address.";
        } else if (error.code === "auth/wrong-password") {
          errorMessage = "Incorrect password. Please try again.";
        }

        // Show an alert with the specific error message
        Alert.alert("Login Error", errorMessage);
        console.error("Login error:", error.message);
      });
  };

  return (
    <View style={styles.container}>
      {/* Background with GIF */}
      <View style={styles.background}>
        <Animated.View style={[styles.animatedGifContainer, { opacity: gifOpacity }]}>
          <ImageBackground
            source={require("../assets/images/index_bg.gif")}
            style={styles.background}
          />
        </Animated.View>
      </View>

      {/* UI Elements (Always Visible) */}
      <BlurView intensity={40} tint="dark" style={styles.glassContainer}>
        <Text style={styles.title}>✦ Apple Disease Detection</Text>

        <Text style={styles.description}>
          This project helps in detecting diseases in apple crops using AI.
          It allows farmers to analyze apple leaves and identify potential diseases
          early, improving crop health and yield!
        </Text>

        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Username/Email"
            placeholderTextColor="#bbb"
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#bbb"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <View style={styles.row}>
            <Pressable onPress={() => setRememberMe(!rememberMe)} style={styles.checkboxContainer}>
              <View style={[styles.checkbox, rememberMe && styles.checked]} />
              <Text style={styles.checkboxText}>Remember me</Text>
            </Pressable>
            <TouchableOpacity>
              <Text style={styles.forgotText}>Forgot?</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Log In</Text>
          </TouchableOpacity>

          <Text style={styles.signUpText}>
            Don't have an account?{" "}
            <Text style={styles.signUpLink} onPress={() => router.push("/signup")}>
              Sign Up
            </Text>
          </Text>
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "black",
  },
  animatedGifContainer: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  glassContainer: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 30,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    overflow: "hidden",
    alignItems: "center",
  },
  title: {
    fontSize: 17,
    color: "#FFFFFF",
    textAlign: "left",
    width: "100%",
    marginTop: 135,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  description: {
    fontSize: 12.5,
    color: "rgba(240, 240, 240, 0.7)",
    fontStyle: "italic",
    textAlign: "left",
    alignSelf: "flex-start",
    marginTop: 8,
    maxWidth: 210,
    paddingHorizontal: 7,
  },
  formContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginBottom: 115,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 15,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#FFFFFF",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 15,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#fff",
    marginRight: 8,
  },
  checked: {
    backgroundColor: "#fff",
  },
  checkboxText: {
    color: "#fff",
  },
  forgotText: {
    color: "#bbb",
    textDecorationLine: "underline",
  },
  button: {
    width: "100%",
    backgroundColor: "#222",
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  signUpText: {
    marginTop: 15,
    color: "#FFFFFF",
    fontSize: 14,
  },
  signUpLink: {
    color: "#fff",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});
