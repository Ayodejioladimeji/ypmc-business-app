import React, { forwardRef, useContext, useMemo } from "react";
import { View, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import BottomSheet, { BottomSheetModal, BottomSheetScrollView, BottomSheetView } from "@gorhom/bottom-sheet";
import { SharedValue } from "react-native-reanimated";
import { colors, spacing } from "@/theme";
import ShipmentIcon from "./shipment-icon";
import { order } from "@/constants/shipment-order";
import { Line } from "../ui/line";
import { Text } from "../ui";
import { s } from "react-native-size-matters";
import { Button } from "../ui/button";
import images from "@/assets/images";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import moment from "moment";
import { formatMoney } from "@/utils/utils";
import { DataContext } from "@/store/GlobalState";
import { handleDial } from "@/helpers/dialNumber";
import { ACTIONS } from "@/store/Actions";
import { useRouter } from "expo-router";
import { SubscriptionIcon } from "@/assets/images/svgs";

type UpdateProps = {
    index: SharedValue<number>;
    position: SharedValue<number>;
    startOrder?: boolean
};

const SNAP_POINTS = ["50%", "80%"]

const FullDetails = forwardRef<BottomSheetModal, UpdateProps>(
    ({ index, position, startOrder }, ref) => {
        const { bottom: bottomSafeArea } = useSafeAreaInsets();
        const { state, dispatch } = useContext(DataContext)
        const { order } = state
        const router = useRouter()

        const scrollViewContentContainer = useMemo(
            () => [
                styles.scrollViewContentContainer,
                { paddingBottom: bottomSafeArea },
            ],
            [bottomSafeArea],
        );

        // handle chat
        const handleChat = () => {
            router.push(`/(rider)/chat/${order?.id}`)
            if (ref && "current" in ref && ref.current) ref.current.dismiss();
        }

        return (
            <BottomSheetModal
                enableDynamicSizing={false}
                enablePanDownToClose={true}
                index={1}
                keyboardBehavior="extend"
                key="FindRider"
                ref={ref}
                snapPoints={SNAP_POINTS}
                style={styles.shadow}
            >

                <BottomSheetScrollView
                    contentContainerStyle={scrollViewContentContainer}
                    keyboardDismissMode="interactive"
                    keyboardShouldPersistTaps="handled"
                    style={styles.scrollView}
                >

                    <View style={{ backgroundColor: "#fff", padding: 16, paddingHorizontal: 10 }}>
                        {/* Package Info */}
                        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
                            {order?.isSubscriptionOrder ?
                                <SubscriptionIcon />
                                :
                                <ShipmentIcon status={order?.status} />
                            }

                            <View style={{ marginLeft: 10 }}>
                                <Text style={{ fontSize: 16, fontFamily: "interSemiBold" }}>{order?.packageDetails?.name}</Text>
                                <Text style={{ color: "gray" }}>#{order?.trackingId}</Text>
                            </View>

                            <Text style={{ marginLeft: "auto", fontWeight: "bold" }}>{order?.packageDetails?.size}</Text>
                        </View>

                        <Line />

                        {/* Pickup Info */}
                        <View>
                            <Text style={{ fontFamily: 'interMedium', fontSize: 16, marginVertical: 20 }}>Pickup Info</Text>
                            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 8 }}>

                                <MaterialIcons name="circle" size={14} color="#FF5E00" />
                                <Text style={{ marginLeft: 8, fontWeight: "600", color: "gray" }}>Pickup Location</Text>
                                <Text style={{ marginLeft: "auto", color: "gray" }}>{moment(order?.estimatedPickupTime).format("ll")}</Text>
                            </View>
                            <Text style={{ marginLeft: 24, fontSize: s(12), marginTop: 8 }}>{order?.pickupStreet} {order?.pickupState}</Text>

                            <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 35, justifyContent: 'space-between' }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                                    <Image source={images?.user} alt="" style={{ height: 35, width: 35 }} />
                                    <View>
                                        <Text style={{ fontSize: s(11), color: colors.mutedForeground }}>Sender's info</Text>
                                        <Text style={{ fontSize: s(13) }}>{order?.senderInfo?.name}</Text>
                                    </View>
                                </View>

                                <View
                                    style={{
                                        flexDirection: "row",
                                        gap: 10,
                                        alignItems: 'center',
                                    }}
                                >
                                    <TouchableOpacity onPress={() => handleDial(order?.senderInfo?.contactInfo?.phoneNumber)} style={{ height: 40, width: 40, borderRadius: 50, borderWidth: 1, alignItems: 'center', justifyContent: 'center' }}>
                                        <Ionicons
                                            name="call-outline"
                                            size={20}

                                        />
                                    </TouchableOpacity>

                                    {/* {!startOrder &&  */}
                                    <TouchableOpacity onPress={handleChat} style={{ height: 40, width: 40, borderRadius: 50, backgroundColor: 'black', alignItems: 'center', justifyContent: 'center' }}>
                                        <Ionicons
                                            name="chatbox-outline"
                                            size={20}
                                            style={{ color: "#fff" }}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>

                        <Line />

                        <View>
                            <Text style={{ fontFamily: 'interMedium', fontSize: 16, marginVertical: 20 }}>Delivery Info</Text>
                            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 8 }}>

                                <MaterialIcons name="place" size={18} color="#4CAF50" />
                                <Text style={{ marginLeft: 8, fontWeight: "600", color: "gray" }}>Delivery Location</Text>
                                <Text style={{ marginLeft: "auto", color: "gray" }}>{moment(order?.estimatedDeliveryTime)?.format("ll")}</Text>
                            </View>
                            <Text style={{ marginLeft: 24, fontSize: s(12), marginTop: 8 }}>{order?.dropoffStreet} {order?.dropoffState}</Text>

                            <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 35, justifyContent: 'space-between' }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                                    <Image source={images.user} alt="" style={{ height: 35, width: 35 }} />
                                    <View>
                                        <Text style={{ fontSize: s(11), color: colors.mutedForeground }}>Receiver's info</Text>
                                        <Text style={{ fontSize: s(14) }}>{order?.receiverInfo?.name}</Text>
                                    </View>
                                </View>

                                <View
                                    style={{
                                        flexDirection: "row",
                                        gap: 10,
                                        alignItems: 'center',
                                    }}
                                >
                                    <TouchableOpacity onPress={() => handleDial(order?.receiverInfo?.contactInfo?.phoneNumber)} style={{ height: 40, width: 40, borderRadius: 50, borderWidth: 1, alignItems: 'center', justifyContent: 'center' }}>
                                        <Ionicons
                                            name="call-outline"
                                            size={20}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>

                        <Line />

                        {/* Delivery Instruction */}
                        <View style={{ backgroundColor: "#FFECE0", padding: 10, marginVertical: 16, borderRadius: 5 }}>
                            <Text style={{ fontFamily: "interMedium", marginBottom: 10 }}>Delivery Instruction</Text>
                            <Text>{order?.packageDetails?.notes || "N/A"}</Text>
                        </View>

                        <Line />

                        {/* Other Info */}
                        <Text style={{ fontFamily: 'interMedium', fontSize: 16, marginTop: 20 }}>Other Info</Text>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 20 }}>
                            <Text>Secure Shipping</Text>
                            <Text>{order?.isSecurityShipping ? "Yes" : "No"}</Text>
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 20 }}>
                            <Text>Estimated Distance</Text>
                            <Text>{order?.distanceInKilometers.toFixed(1)} km</Text>
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 20, marginBottom: 40 }}>
                            <Text style={{ fontFamily: 'interMedium' }}>Fare amount</Text>
                            <Text style={{ fontFamily: 'interMedium' }}>₦{formatMoney(order?.actualPriceInNaira)}</Text>
                        </View>
                    </View>
                </BottomSheetScrollView>
            </BottomSheetModal>
        )
    });

const styles = StyleSheet.create({
    container: {
        paddingVertical: 20,
        paddingHorizontal: 10,
    },
    wrapper: {
        gap: 20,
        marginTop: spacing.xxl,
    },
    scrollView: {
        flex: 1,
    },
    shadow: {
        shadowColor: "#636363",
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.9,
        shadowRadius: 25,
        elevation: 15,
    },
    scrollViewContentContainer: {
        paddingHorizontal: 16,
    },

    footerContainer: {
        marginHorizontal: 12,
        backgroundColor: "#fff",
    },

    bottomSheetContainer: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    bottomSheetContent: {
        padding: spacing.base,
    },
})

export default FullDetails;
