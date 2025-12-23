import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { NetBalanceIcon, TotalWithdrawnIcon } from "@/assets/images/svgs";
import { formatMoney } from "@/utils/utils";
import { router } from "expo-router";

export default function EarningsSummary({data}) {

    
    return (
        <View style={styles.container}> 
            {/* Cards */}
            <View style={styles.cardContainer}>
                <View style={styles.card}>
                    <View style={styles.iconWrapper}>
                        <TotalWithdrawnIcon/>
                    </View>
                    <Text style={styles.cardTitle}>Total Withdrawn</Text>
                    <Text style={styles.cardAmount}>₦{data?.totalWithdrawn || 0}</Text>
                </View>

                {/* <View style={styles.card}>
                    <View style={[styles.iconWrapper, { backgroundColor: "#F972161A" }]}>
                        <NetBalanceIcon/>
                    </View>
                    <Text style={styles.cardTitle}>Total Earnings</Text>
                    <Text style={styles.cardAmount}>₦{formatMoney(data?.totalEarnings) || 0}</Text>
                </View> */}
            </View>

            {/* Buttons */}
            <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.outlinedBtn} onPress={() => router.push("/request-withdrawal")}>
                    <Text style={styles.outlinedBtnText}>Request Withdrawal</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.filledBtn} onPress={() => router.push("/riders-earnings")}>
                    <Feather name="credit-card" size={16} color="#fff" />
                    <Text style={styles.filledBtnText}>Riders Earning</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 16,
        backgroundColor: "#fff",
    },
    cardContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 12,
    },
    card: {
        flex: 1,
        backgroundColor: "#fff",
        borderRadius: 12,
        borderColor: "#eee",
        borderWidth: 1,
        padding: 16,
    },
    iconWrapper: {
        backgroundColor: "#4FB9481A",
        padding: 8,
        borderRadius: 25,
        alignSelf: "flex-start",
        marginBottom: 8,
    },
    cardTitle: {
        fontSize: 12,
        color: "#888",
        marginBottom: 4,
    },
    cardAmount: {
        fontSize: 16,
        fontWeight: "bold",
    },
    buttonRow: {
        flexDirection: "row",
        gap: 12,
        marginTop: 24,
    },
    outlinedBtn: {
        flex: 1,
        borderColor: "#ccc",
        borderWidth: 1,
        paddingVertical: 14,
        borderRadius: 40,
        alignItems: "center",
        justifyContent: "center",
    },
    outlinedBtnText: {
        fontSize: 14,
        fontWeight: "500",
        color: "#000",
    },
    filledBtn: {
        flex: 1,
        backgroundColor: "#000",
        flexDirection: "row",
        gap: 8,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 14,
        borderRadius: 40,
    },
    filledBtnText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "500",
    },
});
