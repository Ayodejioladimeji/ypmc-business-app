import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons, FontAwesome5, MaterialIcons, Feather } from "@expo/vector-icons";
import { colors } from "@/theme";
import { handleDial } from "@/helpers/dialNumber";
import { useRouter } from "expo-router";

interface Props{
    order:any
}

export default function RiderRowSection({order}:Props) {
        const router = useRouter()
        const {rider} = order?.shipping

//    

    return (
        <View style={styles.container}>
            {/* Rider Assigned Section */}
            <Text style={styles.sectionTitle}>Rider Assigned</Text>

            <View style={styles.riderRow}>
                <Image
                    source={{ uri: rider?.image}}
                    style={styles.avatar}
                />

                <View style={{ flex: 1 }}>
                    <View style={styles.riderNameRow}>
                        <Text style={styles.riderName}>{rider?.name}</Text>
                        <Ionicons name="checkmark-circle" size={16} color="#4FB948" />
                        <View style={styles.ratingBadge}>
                            <MaterialIcons name="star" size={12} color="#F97216" />
                            <Text style={styles.ratingText}>{rider?.rating}</Text>
                        </View>
                    </View>

                    <View style={styles.rideCountRow}>
                        <FontAwesome5 name="biking" size={12} color="#999" />
                        <Text style={styles.completedRides}>{rider?.completedRides} Completed rides</Text>
                    </View>
                </View>

            </View>

            <TouchableOpacity style={styles.riderInfoBtn} onPress={() => router.push(`/rider-profile/${rider?.id}`)}>
                <Text style={styles.riderInfoText}>Rider Info</Text>
                <Feather name="arrow-right" size={16} />
            </TouchableOpacity>


        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 16,
        backgroundColor: "#fff",
        borderRadius: 12,
    },
    section: {
        marginTop: 20,
        borderTopWidth: 1,
        borderTopColor: "#eee",
        paddingTop: 20,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: "600",
        color: "#000",
        marginBottom: 30,
    },
    riderRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    riderNameRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    riderName: {
        fontSize: 14,
        fontWeight: "bold",
    },
    ratingBadge: {
        flexDirection: "row",
        backgroundColor: "#F3F3F3",
        borderRadius: 20,
        paddingHorizontal: 6,
        paddingVertical: 2,
        alignItems: "center",
        gap: 2,
    },
    ratingText: {
        fontSize: 12,
        color: "#333",
    },
    rideCountRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 4,
        gap: 4,
    },
    completedRides: {
        fontSize: 12,
        color: "#666",
    },
    avatar: {
        height: 48,
        width: 48,
        borderRadius: 48,
        borderWidth:0.5,
        borderColor:colors.border
    },
    smallAvatar: {
        height: 36,
        width: 36,
        borderRadius: 36,
        marginRight: 10,
    },
    iconButtons: {
        flexDirection: "row",
        gap: 10,
    },
    iconButtonWhite: {
        backgroundColor: "#F3F3F3",
        borderRadius: 25,
        padding: 10,
    },
    iconButtonBlack: {
        backgroundColor: "#000",
        borderRadius: 25,
        padding: 10,
    },
    riderInfoBtn: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 16,
        gap: 4,
        borderWidth:1,
        borderColor:colors.border,
        borderRadius: 25,
        paddingVertical: 10,
        paddingHorizontal: 16,
        alignSelf: "flex-start",
    },
    riderInfoText: {
        fontSize: 14,
        fontWeight: "500",
    },
    infoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
        alignItems: "center",
    },
    
    avatarAndInfo: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
   
});
