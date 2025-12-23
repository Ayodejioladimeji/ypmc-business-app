import React from "react";
import { View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Utility function for styles
export const getShipmentStyles = (status: string) => {
    switch (status) {
        case "PENDING":
            return {
                backgroundColor: "#F972161A",
                iconColor: "#F97216",
            };
        case "PAYMENT_COMPLETED":
            return {
                backgroundColor: "#1E83C51A",
                iconColor: "#1E83C5",
            };
        case "RIDER_ASSIGNED":
            return {
                backgroundColor: "#1E83C51A",
                iconColor: "#1E83C5",
            };
        case "PICKED_UP":
            return {
                backgroundColor: "#1E83C51A",
                iconColor: "#1E83C5",
            };
        case "IN_TRANSIT":
            return {
                backgroundColor: "#1E83C51A",
                iconColor: "#1E83C5",
            };
        case "DELIVERED":
            return {
                backgroundColor: "#4FB9481A",
                iconColor: "#4FB948",
            };
        default:
            return {
                backgroundColor: "#F972161A",
                iconColor: "red",
            };
    }
};

// Reusable component 
const ShipmentIcon = ({ status }: { status: string }) => {
    const { backgroundColor, iconColor } = getShipmentStyles(status);

    return (
        <View style={[styles.iconContainer, { backgroundColor }]}>
            <Ionicons name="cube-outline" size={24} style={{ color: iconColor }} />
        </View>
    );
};

export default ShipmentIcon;

const styles = StyleSheet.create({
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
    },
});
