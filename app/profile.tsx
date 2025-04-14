import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageBackground, ActivityIndicator } from "react-native";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
// Firebase imports
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";

export default function Profile() {
  const router = useRouter();
  const auth = getAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/"); 
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Background Image */}
      <ImageBackground source={require("../assets/images/index_bg.gif")} style={styles.background} resizeMode="cover">
        <BlurView intensity={50} tint="dark" style={styles.overlay} />
      </ImageBackground>

      <BlurView intensity={50} tint="dark" style={styles.glassContainer}>
        {/* Profile Header */}
        <Text style={styles.profileText}>Profile</Text>

        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>

        {/* User Profile Picture */}
        <Image
          source={user?.photoURL ? { uri: user.photoURL } : require("../assets/images/profile_pfp.png")}
          style={styles.profileImage}
        />

        {/* User Name & Location */}
        <Text style={styles.userName}>{user?.displayName || "Email"}</Text>
        <Text style={styles.userLocation}>{user?.email || "User_Email"}</Text>

        {/* Buttons */}
        <TouchableOpacity style={styles.fullWidthButton} onPress={() => router.push("/feedback")}>
          <Text style={styles.buttonText}>Feedback</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.fullWidthButton} onPress={handleLogout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </BlurView>

      {/* Navbar */}
      <BlurView intensity={20} tint="dark" style={styles.navbar}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push("/home")}>
          <Ionicons name="home-outline" size={28} color="white" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => router.push("/scan")}>
          <Ionicons name="scan-outline" size={28} color="white" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => router.push("/profile")}>
          <Ionicons name="person-outline" size={28} color="white" />
        </TouchableOpacity>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "black", width: "100%" },

  background: { flex: 1, width: "100%", height: "100%", position: "absolute" },

  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0, 0, 0, 0.4)" },

  glassContainer: {
    flex: 1,
    width: "100%",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingTop: 70, // Moved title slightly higher
  },

  profileText: {
    fontSize: 26, 
    color: "white",
    fontWeight: "400", 
    marginBottom: 10,
    textAlign: "left",
    alignSelf: "flex-start", 
  },

  backButton: {
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    opacity: 0.8,
  },

  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: "center",
    marginBottom: 40,
  },

  userName: {
    fontSize: 22,
    color: "white",
    fontWeight: "300",
    textAlign: "center",
    marginBottom: 4,
  },

  userLocation: {
    fontSize: 16,
    color: "#CCCCCC",
    textAlign: "center",
    marginBottom: 20,
  },

  fullWidthButton: {
    width: "100%",
    padding: 15,
    backgroundColor: "rgba(200, 200, 200, 0.3)",
    borderRadius: 10,
    marginTop: 10,
  },

  buttonText: {
    fontSize: 18,
    color: "white",
    textAlign: "center",
    fontWeight: "300",
  },

  navbar: {
    position: "absolute",
    bottom: 30,
    width: "85%",
    height: 70,
    flexDirection: "row",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 20,
    justifyContent: "space-around",
    alignItems: "center",
    alignSelf: "center",
    paddingVertical: 10,
  },

  navItem: {
    alignItems: "center",
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
});

