import React from "react";
import { View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "../ui";
import { s } from "react-native-size-matters";

// Utility function for styles
export const getShipmentStyles = (status: string) => {
    switch (status) {
        case "PENDING":
            return {
                backgroundColor: "#F972161A",
                iconColor: "#F97216",
                text:'Pending'
            };
        case "PAYMENT_COMPLETED":
            return {
                backgroundColor: "#1E83C51A",
                iconColor: "#1E83C5",
                 text:'PaymentCompleted'
            };
        case "RIDER_ASSIGNED":
            return {
                backgroundColor: "#1E83C51A",
                iconColor: "#1E83C5",
                 text:'Assigned'
            };
        case "PICKED_UP":
            return {
                backgroundColor: "#1E83C51A",
                iconColor: "#1E83C5",
                 text:'Pickedup'
            };
        case "IN_TRANSIT":
            return {
                backgroundColor: "#1E83C51A",
                iconColor: "#1E83C5",
                 text:'InTransit'
            };
        case "DELIVERED":
            return {
                backgroundColor: "#4FB9481A",
                iconColor: "#4FB948",
                 text:'Delivered'
            };
        default:
            return {
                backgroundColor: "#F972161A",
                iconColor: "red",
                 text:'Cancelled'
            };
    }
};

// Reusable component
const ShipmentTag = ({ status }: { status: string }) => {
    const { backgroundColor, iconColor, text } = getShipmentStyles(status);

    return (
        <View style={[styles.iconContainer, { backgroundColor }]}>
            <Text style={{color:iconColor, fontSize:s(11)}}> {text}</Text>
        </View>
    );
};

export default ShipmentTag;

const styles = StyleSheet.create({
    iconContainer: {
        paddingVertical:3,
        paddingHorizontal:10,
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center",
    },
});
