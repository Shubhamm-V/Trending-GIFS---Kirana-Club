import React, { useContext } from "react";

import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Share,
  Alert,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { darkTheme, lightTheme } from "@/constants/THEMES";
import ThemeContext from "@/context/ThemeContext";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";

const GIF = ({ item }: any) => {
  const { isDarkMode } = useContext(ThemeContext);

  const currentTheme = isDarkMode ? darkTheme : lightTheme;

  const downloadGIF = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission denied", "We need permission to save GIFs");
        return;
      }

      const fileUri = FileSystem.cacheDirectory + "downloaded.gif";
      const { uri } = await FileSystem.downloadAsync(item.url, fileUri);

      await MediaLibrary.createAssetAsync(uri);
      Alert.alert("Download complete", "GIF saved to your gallery!");
    } catch (error) {
      console.error("Error downloading GIF: ", error);
      Alert.alert("Error", "Failed to download GIF");
    }
  };
  const shareGIF = async () => {
    try {
      await Share.share({
        message: `Checkout this Trending GIF by Shubham Vyavhare ${item.url}`,
      });
    } catch (error: any) {
      Alert.alert(error.message);
    }
  };
  return (
    <View style={styles.gifContainer}>
      <Image
        source={{ uri: item.url }}
        style={styles.gifImage}
        resizeMode="cover"
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={downloadGIF}>
          <Ionicons
            size={20}
            color={currentTheme.textColor}
            name="download-outline"
          />
          <Text style={{ fontSize: 16, color: currentTheme.textColor }}>
            Download
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={shareGIF}>
          <Ionicons
            size={20}
            color={currentTheme.textColor}
            name="share-social-outline"
          />
          <Text style={{ fontSize: 16, color: currentTheme.textColor }}>
            Share
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default GIF;

const styles = StyleSheet.create({
  gifContainer: {
    marginVertical: 10,
    alignItems: "center",
  },
  button: {
    width: "50%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },
  buttonContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderColor: "lightgray",
    borderWidth: 1,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
  },
  gifImage: {
    width: "100%",
    height: 250,
    borderColor: "lightgray",
    borderWidth: 1,
    borderRadius: 10,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
  },
});
