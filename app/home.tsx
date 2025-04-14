import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Animated, ImageBackground, TouchableOpacity } from "react-native";
import * as Location from "expo-location";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

interface WeatherState {
  city: string;
  temperature: string;
  condition: string;
  range: string;
}

export default function Home() {
  const router = useRouter();
  const opacityAnim = useState(new Animated.Value(0))[0];

  const [weather, setWeather] = useState<WeatherState>({
    city: "Fetching location...",
    temperature: "--",
    condition: "Loading...",
    range: "--°C — --°C",
  });

  useEffect(() => {
    Animated.timing(opacityAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    checkPermissionsAndGetLocation();
  }, []);

  async function checkPermissionsAndGetLocation() {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setWeather((prev) => ({ ...prev, city: "Location permission denied" }));
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      fetchWeather(location.coords.latitude, location.coords.longitude);
      fetchCityName(location.coords.latitude, location.coords.longitude);
    } catch (error) {
      setWeather((prev) => ({ ...prev, city: "Location error" }));
    }
  }

  async function fetchWeather(lat: number, lon: number) {
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
      );
      const data = await response.json();

      if (data.current_weather) {
        setWeather((prevWeather) => ({
          ...prevWeather,
          temperature: `${Math.round(data.current_weather.temperature)}`,
          condition: getWeatherCondition(data.current_weather.weathercode),
          range: `${Math.round(data.current_weather.temperature - 3)}°C — ${Math.round(data.current_weather.temperature + 3)}°C`,
        }));
      } else {
        setWeather((prevWeather) => ({ ...prevWeather, condition: "Weather data unavailable" }));
      }
    } catch (error) {
      setWeather((prevWeather) => ({ ...prevWeather, condition: "Weather error" }));
    }
  }

  async function fetchCityName(lat: number, lon: number) {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
      );
      const data = await response.json();

      if (data.address?.city) {
        setWeather((prevWeather) => ({ ...prevWeather, city: data.address.city }));
      } else if (data.address?.town) {
        setWeather((prevWeather) => ({ ...prevWeather, city: data.address.town }));
      } else if (data.address?.village) {
        setWeather((prevWeather) => ({ ...prevWeather, city: data.address.village }));
      } else {
        setWeather((prevWeather) => ({ ...prevWeather, city: "Unknown Location" }));
      }
    } catch (error) {
      setWeather((prevWeather) => ({ ...prevWeather, city: "City name error" }));
    }
  }

  function getWeatherCondition(code: number): string {
    const conditions: { [key: number]: string } = {
      0: "Clear Sky",
      1: "Mostly Clear",
      2: "Partly Cloudy",
      3: "Cloudy",
      45: "Foggy",
      48: "Dense Fog",
      51: "Drizzle",
      61: "Light Rain",
      63: "Moderate Rain",
      65: "Heavy Rain",
      71: "Light Snow",
      73: "Moderate Snow",
      75: "Heavy Snow",
      95: "Thunderstorm",
    };
    return conditions[code] || "Unknown Weather";
  }

  return (
    <View style={styles.container}>
      <ImageBackground source={require("../assets/images/index_bg.gif")} style={styles.background} resizeMode="cover">
        <Animated.View style={[styles.overlay, { opacity: opacityAnim }]} />
      </ImageBackground>

      <BlurView intensity={50} tint="dark" style={styles.glassContainer}>
        <View style={styles.weatherContainer}>
          <Text style={styles.city}>{weather.city}</Text>
          <Text style={styles.temperature}>
            {weather.temperature}
            <Text style={styles.smallUnit}>°C</Text>
          </Text>
          <Text style={styles.condition}>{weather.condition}</Text>
          <Text style={styles.range}>{weather.range}</Text>
        </View>
      </BlurView>

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
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 150, 
  },

  weatherContainer: { alignItems: "center",marginTop: 30, },

  city: { fontSize: 20, color: "#FFFFFF", fontWeight: "600", textAlign: "center" },
  temperature: { fontSize: 90, color: "#FFFFFF", fontWeight: "800", textAlign: "center" },
  smallUnit: { fontSize: 18, color: "#FFFFFF", fontWeight: "600" },
  condition: { fontSize: 18, color: "#CCCCCC", textAlign: "center", marginTop: 3 },
  range: { fontSize: 16, color: "#999999", textAlign: "center", marginTop: 3 },

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
