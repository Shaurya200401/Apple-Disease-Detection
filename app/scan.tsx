import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ImageBackground,
  Dimensions,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { PieChart } from 'react-native-chart-kit';

const Scan: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      await ImagePicker.requestCameraPermissionsAsync();
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    })();
  }, []);

  const pickImage = async () => {
    setLoading(true);
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
      setResult(null);
    }
    setLoading(false);
  };

  const takePhoto = async () => {
    setLoading(true);
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
      setResult(null);
    }
    setLoading(false);
  };

  const handleDone = () => {
    if (image) {
      console.log("Image sent to model:", image);
      setLoading(true);
      setTimeout(() => {
        setResult("Apple Scab");
        setLoading(false);
      }, 1500);
    }
  };

  const pieData = [
    {
      name: 'Healthy',
      population: 75,
      color: 'rgba(90, 122, 155, 0.7)',
      legendFontColor: '#ffffff',
      legendFontSize: 10,
    },
    {
      name: 'Apple Scab',
      population: 25,
      color: 'rgba(45, 77, 112, 0.4)',
      legendFontColor: '#ffffff',
      legendFontSize: 10,
    },
  ];

  const screenWidth = Dimensions.get('window').width;

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/images/index_bg.gif')}
        style={styles.background}
        resizeMode="cover"
      >
        <BlurView intensity={50} tint="dark" style={styles.overlay} />
      </ImageBackground>

      <Text style={styles.scanText}>Image</Text>

      <ScrollView contentContainerStyle={{ alignItems: 'center', paddingBottom: 100 }}>
        <BlurView intensity={50} tint="dark" style={styles.glassContainer}>
          {image ? (
            <Image source={{ uri: image }} style={styles.previewImage} />
          ) : (
            <View style={styles.placeholderBox}>
              <Text style={styles.text}>No image selected</Text>
            </View>
          )}

          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={pickImage} style={[styles.button, { marginRight: 10 }]}>
              <Text style={styles.buttonText}>Upload</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={takePhoto} style={styles.button}>
              <Text style={styles.buttonText}>Camera</Text>
            </TouchableOpacity>
          </View>

          {image && (
            <TouchableOpacity onPress={handleDone} style={styles.doneButton}>
              <Text style={styles.buttonText}>Done</Text>
            </TouchableOpacity>
          )}

          {loading && (
            <Text style={styles.scanningText}>Scanning...</Text>
          )}
        </BlurView>

        {result && (
          <BlurView intensity={40} tint="dark" style={styles.resultContainer}>
            <View style={{ width: screenWidth * 0.85, alignItems: 'flex-start', marginLeft: 10 }}>
              <PieChart
                data={pieData}
                width={screenWidth * 0.94}
                height={180}
                chartConfig={{
                  backgroundColor: 'transparent',
                  backgroundGradientFrom: 'transparent',
                  backgroundGradientTo: 'transparent',
                  decimalPlaces: 0,
                  color: () => '#fff',
                  labelColor: () => '#fff',
                }}
                accessor="population"
                backgroundColor="transparent"
                absolute
                style={{ marginVertical: 5 }}
              />
            </View>

            <Text style={styles.resultText}>Detected: {result}</Text>
            <Text style={styles.resultText}>Healthy: 75%</Text>
            <Text style={styles.resultText}>{result}: 25%</Text>
          </BlurView>
        )}
      </ScrollView>

      <BlurView intensity={20} tint="dark" style={styles.navbar}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/home')}>
          <Ionicons name="home-outline" size={28} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/scan')}>
          <Ionicons name="scan-outline" size={28} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/profile')}>
          <Ionicons name="person-outline" size={28} color="white" />
        </TouchableOpacity>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  background: { flex: 1, width: '100%', height: '100%', position: 'absolute' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0, 0, 0, 0.4)' },
  scanText: { position: 'absolute', top: 76, left: 20, fontSize: 26, color: 'white', fontWeight: '400' },
  glassContainer: {
    width: '85%',
    marginTop: 120,
    padding: 20,
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  text: { color: '#ddd', fontSize: 14 },
  placeholderBox: {
    width: 260,
    height: 180,
    borderColor: '#aaa',
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  previewImage: {
    width: 260,
    height: 180,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#333',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  doneButton: {
    backgroundColor: '#1e90ff',
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 12,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
  },
  scanningText: {
    marginTop: 12,
    fontSize: 16,
    color: '#fff',
    fontStyle: 'italic',
  },
  resultContainer: {
    width: '85%',
    marginTop: 20,
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
  },
  resultText: {
    color: '#fff',
    fontSize: 14,
    marginTop: 4,
  },
  navbar: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 66,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(20, 20, 20, 0.5)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  navItem: {
    padding: 8,
  },
});

export default Scan;
