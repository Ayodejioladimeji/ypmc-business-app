import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { s } from "react-native-size-matters";

const KYCSuccess = () => {
    const router = useRouter();

    return (
        <View style={styles.container}>
           
            <Image source={require("@/assets/images/kyc-success.png")} style={styles.image} />

            {/* Success Message */}
            <Text style={styles.title}>Verification Requirements Uploaded!</Text>
            <Text style={styles.subtitle}>
                Our team will review them shortly to confirm your verification.
            </Text>

            {/* Return Home Button */}
            <TouchableOpacity style={styles.button} onPress={() => router.push("/(rider)/home")}>
                <Text style={styles.buttonText}>Return to Home</Text>
            </TouchableOpacity>
        </View>
    );
};

export default KYCSuccess;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
        paddingHorizontal: 20,
    },
    image: {
        width: 200,
        height: 150,
        resizeMode: "contain",
        marginBottom: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: "gray",
        textAlign: "center",
        marginBottom: 20,
    },
    button: {
        backgroundColor: "black",
        paddingVertical: 14,
        paddingHorizontal: 30,
        borderRadius: 25,
        width: "90%",
        alignItems: "center",
    },
    buttonText: {
        color: "white",
        fontSize: s(12),
        fontWeight: "bold",
    },
});
