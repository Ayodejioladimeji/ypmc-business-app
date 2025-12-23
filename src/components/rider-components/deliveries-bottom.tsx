import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { formatMoney } from "@/utils/utils";
import { useSegments } from "expo-router";
import { CalendarIcon, SubscriptionIcon } from "@/assets/images/svgs";
import moment from "moment";

// Utility function for styles
export const getShipmentStyles = (status: string) => {
    switch (status) {
        case "PENDING":
            return { backgroundColor: "#F972161A", iconColor: "#F97216" };
        case "PAYMENT_COMPLETED":
        case "RIDER_ASSIGNED":
        case "PICKED_UP":
        case "IN_TRANSIT":
            return { backgroundColor: "#1E83C51A", iconColor: "#1E83C5" };
        case "DELIVERED":
            return { backgroundColor: "#4FB9481A", iconColor: "#4FB948" };
        default:
            return { backgroundColor: "#F972161A", iconColor: "red" };
    }
};

// Reusable component
const DeliveriesBottom = ({ data }: any) => {
    const { backgroundColor, iconColor } = getShipmentStyles(data?.status);
    const segments = useSegments();
    const scheduledSegment = segments.find((seg) => seg === "scheduled-shipment");

    return (
        <View style={styles.container}>
            <View style={styles.leftSection}>
                {/* Icon */}
                <View style={[styles.iconContainer, { backgroundColor }]}>
                    {data?.isSubscriptionOrder ?
                        <SubscriptionIcon />
                        :
                        <Ionicons name="cube-outline" size={24} style={{ color: iconColor }} />
                    }
                </View>

                {/* Text Content */}
                <View style={styles.textContainer}>
                    <Text style={styles.title} numberOfLines={2}>
                        {data?.packageDetails?.name}
                    </Text>
                    {scheduledSegment === "scheduled-shipment" ?
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 4,
                            }}
                        >
                            <CalendarIcon />
                            <Text>{moment(data?.scheduledPickupTime).format('lll')}</Text>

                        </View>
                        :
                        <Text style={styles.eta}>ETA: {data?.estimatedDuration} mins</Text>
                    }
                </View>
            </View>

            {/* Amount Section */}
            <View style={styles.amountContainer}>
                <FontAwesome6 name="naira-sign" />
                <Text style={styles.amount}>
                    {formatMoney(Number(data?.actualPriceInNaira) || 0)}
                </Text>
            </View>
        </View>
    );
};

// Styles
const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 15,
    },
    leftSection: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    iconContainer: {
        width: 45,
        height: 45,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
    },
    textContainer: {
        flex: 1, // Takes up available space
        marginLeft: 8,
    },
    title: {
        fontSize: 15,
        fontWeight: "bold",
        flexShrink: 1,
        marginBottom: 5
    },
    eta: {
        fontSize: 15,
    },
    amountContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginLeft: 10,
    },
    amount: {
        fontSize: 15,
        fontWeight: "bold",
    },
});

export default DeliveriesBottom;
