import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons, FontAwesome5, MaterialIcons, Feather } from "@expo/vector-icons";
import { colors } from "@/theme";
import { s } from "react-native-size-matters";
import moment from "moment";
import { handleDial } from "@/helpers/dialNumber";
import { useRouter } from "expo-router";
import images from "@/assets/images";

interface Props {
    order: any
}

export default function AssignedSection({ order }: Props) {
    const router = useRouter()

    console.log(order?.rider)

    const handleChat = () => {

        router.push({
            pathname: `/(org)/chat/[id]`,
            params: {
                id: order?.rider?.id as string,
                rider: JSON.stringify(order?.rider),
            },
        });

    }

    //    

    return (
        <View style={styles.container}>
            {/* Rider Assigned Section */}
            <Text style={styles.sectionTitle}>Rider Assigned</Text>

            <View style={styles.riderRow}>
                <Image
                    source={{ uri: order?.rider?.profileImageUrl }}
                    style={styles.avatar}
                />

                <View style={{ flex: 1 }}>
                    <View style={styles.riderNameRow}>
                        <Text style={styles.riderName}>{order?.rider?.firstName} {order?.rider?.lastName}</Text>
                        <Ionicons name="checkmark-circle" size={16} color="#4FB948" />
                        <View style={styles.ratingBadge}>
                            <MaterialIcons name="star" size={12} color="#F97216" />
                            <Text style={styles.ratingText}>{order?.rider?.averageRating}</Text>
                        </View>
                    </View>

                    <View style={styles.rideCountRow}>
                        <FontAwesome5 name="biking" size={12} color="#999" />
                        <Text style={styles.completedRides}>{order?.rider?.completedDeliveries} Completed rides</Text>
                    </View>
                </View>

                <View style={styles.iconButtons}>
                    <TouchableOpacity style={styles.iconButtonWhite} onPress={() => handleDial(order?.rider?.phoneNumber)}>
                        <Feather name="phone" size={18} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconButtonBlack} onPress={handleChat}>
                        <Feather name="message-square" size={18} color="white" />
                    </TouchableOpacity>
                </View>
            </View>

            <TouchableOpacity style={styles.riderInfoBtn} onPress={() => router.push(`/rider-profile/${order?.rider?.id}`)}>
                <Text style={styles.riderInfoText}>Rider Info</Text>
                <Feather name="arrow-right" size={16} />
            </TouchableOpacity>

            {/* Pickup Info */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Pickup Info</Text>

                <View style={styles.infoRow}>
                    <View style={styles.dotAndText}>
                        <View style={styles.orangeDot} />
                        <View>
                            <Text style={styles.locationLabel}>Pickup Location</Text>
                            <Text style={styles.locationText}>{order?.dropoffStreet} {order?.dropoffArea} {order?.dropoffState}</Text>
                        </View>
                    </View>

                    <View>
                        <Text style={styles.timeText}>{moment(order?.estimatedPickupTime).format("ll")}</Text>
                        <Text style={styles.timeText}>{moment(order?.estimatedPickupTime).format("LT")}</Text>
                    </View>
                </View>

                <View style={styles.infoRow}>
                    <View style={styles.avatarAndInfo}>
                        {order?.senderInfo?.profileImageUrl ? <Image
                            source={{ uri: order?.senderInfo?.profileImageUrl }}
                            style={styles.smallAvatar}
                        />
                            :
                            <Image
                                source={images.user}
                                style={styles.smallAvatar}
                            />}
                        <View>
                            <Text style={styles.infoLabel}>Sender’s Info</Text>
                            <Text style={styles.infoText}>{order?.senderInfo?.name} ({order?.senderInfo?.contactInfo?.phoneNumber})</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.callBtn} onPress={() => handleDial(order?.senderInfo?.contactInfo?.phoneNumber)}>
                        <Text style={styles.callBtnText}>Call</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Delivery Info */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Delivery Info</Text>

                <View style={styles.infoRow}>
                    <View style={styles.dotAndText}>
                        <MaterialIcons name="place" size={14} color="#4CAF50" style={{ marginTop: 2 }} />
                        <View>
                            <Text style={styles.locationLabel}>Delivery Location</Text>
                            <Text style={styles.locationText}>{order?.pickupStreet} {order?.pickupArea} {order?.pickupState}</Text>
                        </View>
                    </View>

                    <View>
                        <Text style={styles.timeText}>{moment(order?.estimatedDeliveryTime).format("ll")}</Text>
                        <Text style={styles.timeText}>{moment(order?.estimatedDeliveryTime).format("LT")}</Text>
                    </View>
                </View>

                <View style={styles.infoRow}>
                    <View style={styles.avatarAndInfo}>
                        <Image
                            source={images.user}
                            style={styles.smallAvatar}
                        />
                        <View>
                            <Text style={styles.infoLabel}>Recipient’s Info</Text>
                            <Text style={styles.infoText}>{order?.receiverInfo?.name} ({order?.receiverInfo?.contactInfo?.phoneNumber})</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.callBtn} onPress={() => handleDial(order?.receiverInfo?.contactInfo?.phoneNumber)}>
                        <Text style={styles.callBtnText}>Call</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 16,
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
        borderWidth: 1,
        borderColor: colors.border,
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
    dotAndText: {
        flexDirection: "row",
        gap: 8,
        alignItems: "flex-start",
        flex: 1,
    },
    locationLabel: {
        fontSize: s(11),
        color: "#666",
        marginBottom: 5
    },
    locationText: {
        fontSize: s(12),
        color: "#000",
        marginBottom: 10,
        marginRight: 50
    },
    timeText: {
        fontSize: s(10),
        textAlign: "right",
        color: "#333",
    },
    avatarAndInfo: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    infoLabel: {
        fontSize: s(11),
        color: "#999",
        marginBottom: 5
    },
    infoText: {
        fontSize: s(12),
        fontWeight: "500",
    },
    callBtn: {
        backgroundColor: "#000",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 30,
    },
    callBtnText: {
        color: "white",
        fontSize: 13,
        fontWeight: "500",
    },
    orangeDot: {
        width: 8,
        height: 8,
        borderRadius: 10,
        backgroundColor: "#F97216",
        marginTop: 5,
    },
});
