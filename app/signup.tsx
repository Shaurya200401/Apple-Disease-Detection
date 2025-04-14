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
import { auth } from './firebaseConfig'; 
import { createUserWithEmailAndPassword } from "firebase/auth"; // Firebase auth import

export default function Signup() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  // Animated Opacity for GIF fade-in
  const gifOpacity = useState(new Animated.Value(0))[0];

  useEffect(() => {
    Animated.timing(gifOpacity, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  // Handle sign up using Firebase Auth
  const handleSignUp = () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        console.log("User signed up:", email);
        Alert.alert("Success", "Account created successfully.");
        router.push("/"); // Redirect to login page after successful sign up
      })
      .catch((error) => {
        let errorMessage = "An error occurred. Please try again later.";

        if (error.code === "auth/email-already-in-use") {
          errorMessage = "This email address is already in use.";
        } else if (error.code === "auth/invalid-email") {
          errorMessage = "The email address is badly formatted.";
        } else if (error.code === "auth/weak-password") {
          errorMessage = "The password is too weak.";
        }

        Alert.alert("Sign Up Error", errorMessage);
        console.error("Sign up error:", error.message);
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
            placeholder="Email"
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

          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor="#bbb"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          <TouchableOpacity style={styles.button} onPress={handleSignUp}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>

          <Text style={styles.signInText}>
            Already have an account?{" "}
            <Text style={styles.signInLink} onPress={() => router.push("/")}>
              Log In
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
  signInText: {
    marginTop: 15,
    color: "#FFFFFF",
    fontSize: 14,
  },
  signInLink: {
    color: "#fff",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});
