import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import { AntDesign, Feather } from "@expo/vector-icons";
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { CustomButton } from "@/components";
import { Text } from "@/components/ui";
import { ReactHookFormFunctionTypes } from "@/types/type";
import { s } from "react-native-size-matters";
import { toast } from "sonner-native";
import { DataContext } from "@/store/GlobalState";
import images from "@/assets/images";
import { storeData } from "@/utils/helper";

// 

export const UploadPhoto = ({
  control,
  nextStep,
}: ReactHookFormFunctionTypes) => {
  const [image, setImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const { state } = useContext(DataContext)
  const [loading, setLoading] = useState(false)


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
        Alert.alert("Sorry, we need camera permissions to make this work!");
        return false;
      }
    }
    return true;
  };

  const pickImage = async (): Promise<void> => {
    if (await requestPermissions()) {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        aspect: [1, 1],
        quality: 1,
        base64: false
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImage(result.assets[0]);
      }
    }
  };

  const takePhoto = async (): Promise<void> => {

    if (await requestPermissions()) {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
        aspect: [1, 1],
        quality: 1,
        base64: false
      });


      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImage(result.assets[0]);
      }
    }
  };

  // upload profile image
  const handleSave = async () => {

    if (image) {
      setLoading(true);

      // Create FormData object for multipart/form-data
      const formData: any = new FormData();
      formData.append('file', {
        uri: image.uri,
        type: image.mimeType,
        name: image.fileName,
      });


      try {
        const res = await fetch(`${process.env.EXPO_PUBLIC_BASE_URL}/rider/upload-profile-image`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${state?.token}`,
          },
          body: formData,
        });

        const data = await res.json();

        if (res.status === 200 || res.status === 201) {
          router.push('/(rider)/home');
          await storeData("kyc", "true")
        }
        toast.success(data?.message);
      } catch (error: any) {
        console.log("Error from backend", error)
        toast.error(error?.message);
      } finally {
        setLoading(false);
      }
      setLoading(false);
    }
  }

  return (
    <SafeAreaView >
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16 }}>

        <Pressable 
        onPress={() => router.replace("/(rider)/home")}
        style={{ flexDirection: 'row', alignSelf: 'flex-end', marginRight: 10 }}>
          <Text style={{fontWeight:'bold', fontSize:15}}>Skip</Text>
          <AntDesign name="arrowright" size={18} color="#000" />
        </Pressable>

        <View>
          <Text style={styles.heroText}>Upload profile picture</Text>
          <Text style={styles.subText}>Tap below to upload or take a photo.</Text>
        </View>

        <View style={styles.imageOuterContainer}>
          <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
            {image ? (
              <Image source={{ uri: image.uri }} style={styles.image} />
            ) : (
              <Image
                source={images.user}
                style={styles.image}
              />
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          {image ? (
            <CustomButton
              onPress={handleSave}
              style={{ gap: 5 }}
              icon={
                loading ? <ActivityIndicator color="white"/> : <AntDesign name="check" size={18} color="white" />
              }
              title="Save"
            />
          ) : (
            <>
              <CustomButton
                onPress={pickImage}
                icon={<Feather name="upload" size={18} color="white" />}
                style={{ gap: 7 }}
                title="Upload"
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

        {image && <TouchableOpacity style={{ marginVertical: 30}} onPress={() => setImage(null)}>
          <Text style={{ textAlign: 'center', textDecorationLine: 'underline' }}>Change picture</Text>
        </TouchableOpacity>}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  skipText: {
    fontWeight: "500",
  },
  heroText: {
    fontSize: s(28),
    fontWeight: 500,
    maxWidth: 300,
    marginBottom: 10,
  },
  subText: {
    marginBottom: 20,
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
