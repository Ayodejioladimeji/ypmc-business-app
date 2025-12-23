import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "@/theme";
import { s } from "react-native-size-matters";

export default function AddressListRider({ data }: any) {
    return (
        <View style={styles.container}>
            <View style={styles.rowContainer}>
                {/* First Address Icon with Line */}
                <View style={styles.iconWrapper}>
                    <MaterialIcons name="circle" size={17} color="#FF5E00" />
                    <View style={styles.verticalLine} />
                </View>

                <View style={[styles.textContainer, { marginBottom: 20 }]}>
                    <Text>Pickup</Text>
                    <Text style={[styles.address, {marginBottom:20}]}>
                        {data?.pickupStreet} {data?.pickupArea} {data?.pickupState}
                    </Text>
                </View>
            </View>

            {/* Second Address */}
            <View style={styles.rowContainer}>
                <View style={styles.iconWrapper}>
                    <MaterialIcons name="place" size={21} color="#4CAF50" />
                </View>

                <View style={styles.textContainer}>
                    <Text>Delivery</Text>
                    <Text style={styles.address}>{data?.dropoffStreet} {data?.dropoffArea} {data?.dropoffState}</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 16,
        marginTop: 10,
    },
    rowContainer: {
        flexDirection: "row",
        alignItems: "flex-start"
    },
    iconWrapper: {
        alignItems: "center",
        marginRight: 5,
        position: "relative",

    },
    verticalLine: {
        position: "absolute",
        top: 18,
        left: 8.5,
        width: 1.5,
        height: "100%",
        borderWidth: 1.2,
        borderColor: colors.mutedForeground,
        borderStyle: "dashed",
    },
    textContainer: {
        flex: 1,
        marginTop:0
    },
    address: {
        fontSize: s(13),
        fontWeight: "500",
        color: "#666",
        lineHeight: 25,
    },
});
