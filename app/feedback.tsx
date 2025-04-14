import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Alert,
  SafeAreaView,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const Feedback = () => {
  const [feedback, setFeedback] = useState('');
  const router = useRouter();

  const handleSubmit = () => {
    if (feedback.trim().length === 0) {
      Alert.alert("Empty Feedback", "Please type something before submitting.");
      return;
    }
    console.log("Feedback Submitted:", feedback);
    Alert.alert("Thank You!", "Your feedback has been submitted.");
    setFeedback('');
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={styles.container}>
        <ImageBackground
          source={require("../assets/images/index_bg.gif")}
          style={styles.background}
          resizeMode="cover"
        >
          <BlurView intensity={50} tint="dark" style={styles.overlay} />
        </ImageBackground>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1, width: '100%' }}
        >
          <View style={styles.innerContent}>
            {/* Header */}
            <Text style={styles.header}>Feedback</Text>

            {/* Glass Form */}
            <BlurView intensity={50} tint="dark" style={styles.glassContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Tell us how we can improve :)"
                placeholderTextColor="rgba(255,255,255,0.5)"
                multiline
                value={feedback}
                onChangeText={setFeedback}
              />
              <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitText}>Submit</Text>
              </TouchableOpacity>
            </BlurView>
          </View>
        </KeyboardAvoidingView>

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
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },

  background: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },

  innerContent: {
    flex: 1,
    alignItems: "center",
    paddingTop: 25,
  },

  header: {
    fontSize: 26,
    color: "white",
    fontWeight: "400",
    marginBottom: 15,
    alignSelf: "flex-start",
    marginLeft: 20,
    marginTop: 10,
  },

  glassContainer: {
    width: "85%",
    padding: 20,
    backgroundColor: 'transparent',
    borderRadius: 20,
    overflow: "hidden",
  },

  textInput: {
    height: 120,
    borderColor: "rgba(255, 255, 255, 0.15)",
    borderWidth: 1,
    borderRadius: 20,
    padding: 10,
    fontSize: 16,
    color: "rgba(255,255,255,0.85)",
    backgroundColor: "rgba(255,255,255,0.03)",
    textAlignVertical: "top",
  },

  submitButton: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    padding: 15,
    borderRadius: 20,
    marginTop: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },

  submitText: {
    color: "rgba(255, 255, 255, 0.62)",
    fontSize: 18,
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
});

export default Feedback;
