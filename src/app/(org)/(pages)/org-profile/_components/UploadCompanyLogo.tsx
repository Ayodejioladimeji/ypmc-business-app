import React, { useState } from "react";
import {
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { AntDesign, Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
// import { SvgXml } from "react-native-svg";

import { userBig } from "@/assets/svgs";
import { CustomButton, Loader } from "@/components";

 const UploadCompanyLogo = () => {
  const [image, setImage] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const requestPermissions = async (): Promise<boolean> => {
    if (Platform.OS !== "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
        return false;
      }
      const { status: cameraStatus } =
        await Camera.requestCameraPermissionsAsync();
      if (cameraStatus !== "granted") {
        alert("Sorry, we need camera permissions to make this work!");
        return false;
      }
    }
    return true;
  };

  const pickImage = async (): Promise<void> => {
    if (await requestPermissions()) {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImage(result.assets[0].uri);
      }
    }
  };

  const takePhoto = async (): Promise<void> => {
    if (await requestPermissions()) {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImage(result.assets[0].uri);
      }
    }
  };

  // const uploadImage = async (imageUri: string): Promise<void> => {
  //   try {
  //     setIsLoading(true);

  //     const accessToken = await AsyncStorage.getItem("accessToken");
  //     if (!accessToken) {
  //       throw new Error("Authentication token not found. Please log in again.");
  //     }

  //     const formData = new FormData();
  //     formData.append("file", {
  //       uri: image,
  //       name: "profile.jpg",
  //       type: "image/jpeg",
  //     });

  //     const response = await fetch(
  //       `${process.env.EXPO_PUBLIC_API_URL}rider/upload-profile-image`,
  //       {
  //         method: "POST",
  //         headers: {
  //           Authorization: `Bearer ${accessToken}`,
  //         },
  //         body: formData,
  //       }
  //     );

  //     if (!response.ok) {
  //       setIsLoading(false);
  //       const errorData = await response.json();
  //       throw new Error(
  //         errorData.message || "Failed to upload profile picture"
  //       );
  //     }

  //     const result = await response.json();
  //     console.log("Upload successful:", result);
  //     router.replace("/(rider)/home");
  //     alert("Profile picture saved successfully!");
  //   } catch (error:any) {
  //     console.error("Upload failed:", error);
  //     alert(
  //       error.message || "An error occurred while uploading the profile picture"
  //     );
  //   }
  // };

  if (isLoading) return <Loader />;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heroText}>Upload profile picture</Text>
      <Text style={styles.subText}>Tap below to upload or take a photo.</Text>

      <View style={styles.imageOuterContainer}>
        <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
          {image ? (
            <Image source={{ uri: image }} style={styles.image} />
          ) : (
            <View style={styles.placeholderContainer}>
              {/* <SvgXml xml={userBig} /> */}
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        {image ? (<></>
          // <CustomButton
          //   onPress={uploadImage}
          //   style={{ gap: 5 }}
          //   icon={<AntDesign name="check" size={18} color="white" />}
          //   title="Save"
          // />
        ) : (
          <>
            <CustomButton
              onPress={pickImage}
              icon={<Feather name="download" size={18} color="black" />}
              style={{ gap: 7 }}
              title="Upload Photo"
            />
            <CustomButton
              bgVariant="secondary"
              textVariant="secondary"
              icon={<Feather name="camera" size={18} color="black" />}
              style={{ color: "red", gap: 7 }}
              onPress={takePhoto}
              title="Take Photo"
            />
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 25,
  },
  skip: {
    alignSelf: "flex-end",
    padding: 5,
  },
  skipText: {
    fontWeight: "500",
  },
  heroText: {
    fontSize: 34,
    textAlign: "center",
    fontWeight: "600",
    marginBottom: 20,
    marginTop: 60,
  },
  subText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  imageOuterContainer: {
    position: "relative",
    alignItems: "center",
    marginBottom: 30,
  },
  imageContainer: {
    marginTop: 20,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#EEEEEE",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  placeholderContainer: {
    alignItems: "center",
  },
  checkmarkContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 5,
  },
  buttonContainer: {
    marginTop: 20,
    gap: 10,
  },
  button: {
    marginBottom: 10,
  },
});

export default UploadCompanyLogo