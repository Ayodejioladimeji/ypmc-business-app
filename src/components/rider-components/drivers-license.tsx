import React, { useContext, useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert, ActionSheetIOS, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { s } from "react-native-size-matters";
import ProgressBar from "./progressbar";
import axios from "axios";
import { DataContext } from "@/store/GlobalState";
import { toast } from "sonner-native";
import { colors } from "@/theme";
import { ACTIONS } from "@/store/Actions";

type UploadedFile = {
    uri: string;
    name: string;
    size: number;
};

const DriversLicenseUpload = () => {
    const [uploading, setUploading] = useState(false);
    const { state, dispatch } = useContext(DataContext);
    const {driversLicenseUploadedFile: uploadedFile} = state
    
        const handleImageUpload = (file: UploadedFile) => {
            dispatch({type: ACTIONS.DRIVERS_LICENSE_UPLOADED_FILE, payload: file})
        };
    
        const removeImage = () => {
            dispatch({ type: ACTIONS.DRIVERS_LICENSE_UPLOADED_FILE, payload: null })
        };

    const uploadImage = async (fromCamera = false) => {
        const result = fromCamera
            ? await ImagePicker.launchCameraAsync({
                allowsEditing: false,
                aspect: [1, 1],
                quality: 1,
                base64: false,
            })
            : await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: false,
                quality: 1,
            });

        if (!result.canceled) {
            const file = result.assets[0];
            setUploading(true);

            try {
                const formData = new FormData();
                formData.append("file", {
                    uri: file.uri,
                    name: file.fileName || "uploaded-image.jpg",
                    type: "image/jpeg",
                } as any);
                formData.append("documentType", "DRIVER_LICENSE");
                formData.append("category", "BUSINESS");

                const response = await axios.post(
                    `${process.env.EXPO_PUBLIC_BASE_URL}/kyc/rider/upload`,
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                            Authorization: `Bearer ${state?.token}`,
                        },
                    }
                );

                const uploadedData: UploadedFile = {
                    uri: file.uri,
                    name: file.fileName || "Uploaded Image",
                    size: Math.round(file.fileSize ? file.fileSize / 1024 : 500),
                };

                handleImageUpload(uploadedData);
                toast.success(response?.data?.message);
            } catch (error) {
                console.log(error?.response?.data?.message);
                toast.error(error?.response?.data?.message || "Upload failed");
            } finally {
                setUploading(false);
            }
        }
    };

        const uploadImagePrompt = () => {
            const chooseOption = (fromCamera: boolean) => {
                uploadImage(fromCamera);
            };
    
            if (Platform.OS === "ios") {
                ActionSheetIOS.showActionSheetWithOptions(
                    {
                        options: ["Cancel", "Upload from gallery", "Take a photo"],
                        cancelButtonIndex: 0,
                    },
                    (buttonIndex) => {
                        if (buttonIndex === 1) chooseOption(false);
                        else if (buttonIndex === 2) chooseOption(true);
                    }
                );
            } else {
                Alert.alert("Upload Image", "Choose an option", [
                    { text: "Upload from gallery", onPress: () => chooseOption(false) },
                    { text: "Take a photo", onPress: () => chooseOption(true) },
                    { text: "Cancel", style: "cancel" },
                ]);
            }
        };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Driver’s License</Text>

            {uploading ? (
                <View style={styles.uploadingBox}>
                    <Text style={{ color: "#666" }}>Uploading</Text>
                    <ProgressBar />
                </View>
            ) : uploadedFile ? (
                <View style={styles.uploadedBox}>
                    <Image
                        source={require("@/assets/images/gallery.png")}
                        alt=""
                        style={{ height: 30, width: 30 }}
                    />
                    <View style={styles.fileDetails}>
                        <Text style={styles.fileName} numberOfLines={1}>
                            {uploadedFile.name}
                        </Text>
                        <Text style={styles.fileSize}>{uploadedFile.size} KB</Text>
                    </View>
                    <TouchableOpacity onPress={removeImage} style={styles.removeButton}>
                        <Text style={styles.removeText}>Remove</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <TouchableOpacity onPress={uploadImagePrompt} style={styles.uploadBox}>
                                    <Ionicons name="cloud-upload-outline" size={30} color="#666" />
                                    <Text style={styles.uploadText}>
                                        Click to browse or take a photo of your ID
                                    </Text>
                                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: "500",
        marginBottom: 8,
        color: "#333",
    },
    uploadBox: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        paddingVertical: 20,
        paddingHorizontal: 30,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fafafa",
    },
    uploadText: {
        fontSize: 14,
        color: "#666",
        marginTop: 5,
        textAlign: "center",
    },
    uploadingBox: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        paddingVertical: 25,
        paddingHorizontal: 15,
        flexDirection: "row",
        alignItems: "center",
        gap: 20,
        backgroundColor: "#fafafa",
    },
    uploadedBox: {
        flexDirection: "row",
        alignItems: "center",
        padding: 20,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        backgroundColor: "#f5f5f5",
    },
    upload: {
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderWidth: 0.5,
        borderRadius: 5,
        fontSize: s(11),
    },
    fileDetails: {
        flex: 1,
        marginLeft: 10,
    },
    fileName: {
        fontSize: s(13),
        fontWeight: "500",
        color: "#333",
        marginBottom: 4,
    },
    fileSize: {
        fontSize: s(11),
        color: "#666",
    },
    removeButton: {
        padding: 5,
        backgroundColor: "#eee",
        borderRadius: 5,
    },
    removeText: {
        fontSize: 12,
        color: "#d9534f",
    },
});

export default DriversLicenseUpload;
