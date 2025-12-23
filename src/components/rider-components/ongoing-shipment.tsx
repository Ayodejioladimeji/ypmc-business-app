import React, { useContext, useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

import { s } from "react-native-size-matters";

import { DataContext } from "@/store/GlobalState";
import { GetRequest } from "@/utils/requests";
import { formatMoney } from "@/utils/utils";
import { Text } from "../ui";
import ShipmentIcon from "./shipment-icon";
import { useRouter } from "expo-router";
import { ACTIONS } from "@/store/Actions";
import { CustomButton } from "@/components";
import { DropoffIcon, PickupIcon, SubscriptionIcon } from "@/assets/images/svgs";
import { colors } from "@/theme";
import { SvgXml } from "react-native-svg";
import { emptyShipment } from "@/assets/svgs";

// 

const OngoingShipment = ({ data, loading }: any) => {
    const { state, dispatch } = useContext(DataContext);
    const router = useRouter()


    const handleRoute = (item: any) => {
        
        if (item?.status === "PENDING") {
            dispatch({ type: ACTIONS.ORDER, payload: item })
            router.push("/(rider)/start-order");
        }
        else if (item?.status === "PAYMENT_COMPLETED") {
            dispatch({ type: ACTIONS.ORDER, payload: item })
            router.push("/(rider)/start-order");
        }
        else if (item?.status === "IN_TRANSIT") {
            dispatch({ type: ACTIONS.ORDER, payload: item })
            router.push("/(rider)/pickup-order");

        }
        else if (item?.status === "PICKED_UP") {
            dispatch({ type: ACTIONS.ORDER, payload: item })
            router.push("/(rider)/deliver-order");
        }
        else {
            router.push({
                pathname: "/(rider)/delivery-details",
                params: {
                    id: item?.id
                }
            });
        }
    }

    const formatText = (text: string) => {
        return text
            .toLowerCase()
            .replace(/_/g, " ")
            .replace(/\b\w/g, (char) => char.toUpperCase())
    };

    const subscriptionOrder = data?.filter(item => item?.isSubscriptionOrder)
    const basicOrder = data?.filter(item => !item?.isSubscriptionOrder)


    //

    return (
        <View style={{ flex: 1 }}>
            {loading ?
                <ActivityIndicator style={{marginVertical:80}}/>

                :

                <>
                    {data?.length === 0 ?
                        <View style={{ flex: 1, minHeight: 400, backgroundColor: "white", padding: 20, borderRadius: 15, marginBottom: 40, marginTop:20 }}>
                            <Text style={{ fontFamily: 'interSemiBold', fontSize: s(13) }}>Shipment Order</Text>
                            <View
                                style={{
                                    justifyContent: "center",
                                    alignItems: "center",
                                    marginTop: 30
                                }}
                            >
                                <SvgXml xml={emptyShipment} />
                                <Text
                                    style={{
                                        fontSize: 17,
                                        color: "gray",
                                    }}
                                >
                                    No shipment order at this time
                                </Text>
                            </View>
                        </View>

                        :
                        <>
                            {subscriptionOrder?.length !== 0 && 
                            <View style={{ backgroundColor: "white", padding: 20, borderRadius: 15, borderWidth: 0.5, borderColor: colors.border, marginTop: 20 }}>
                                <Text style={{ fontFamily: 'interSemiBold', marginBottom: 20, color: colors.mutedForeground }}>Ongoing 360 Shipment</Text>
                                {subscriptionOrder?.map((item: any, index: number) => {
                                    return (
                                        <View
                                            key={index}
                                            style={[
                                                { paddingVertical: 20 },
                                                index !== subscriptionOrder.length - 1 && {
                                                    borderBottomWidth: 0.5,
                                                    borderColor: colors.border,
                                                },
                                            ]}>
                                            <View style={styles.spaceBetween}>
                                                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                                                    {item?.isSubscriptionOrder ?
                                                        <SubscriptionIcon />
                                                        :
                                                        <ShipmentIcon status={item?.status} />}

                                                    <View style={{ width: "70%" }}>
                                                        <Text
                                                            style={{ fontSize: s(12), fontFamily: "interBold" }}
                                                        >
                                                            {item?.packageDetails.name}
                                                        </Text>
                                                        <Text
                                                            style={{ fontSize: s(11), marginTop: 5 }}
                                                        >
                                                            {formatText(item?.status || "")}
                                                        </Text>
                                                    </View>
                                                </View>

                                                <View
                                                    style={{
                                                        position: "absolute",
                                                        top: 7,
                                                        right: 0,
                                                        justifyContent: "flex-end",
                                                        alignItems: "flex-end",
                                                    }}
                                                >
                                                    <Text style={{ fontSize: s(13), fontFamily: "interMedium" }}>
                                                        ₦{formatMoney(Number(item?.actualPriceInNaira) || 0)}
                                                    </Text>
                                                </View>
                                            </View>

                                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 20 }}>
                                                <PickupIcon />
                                                <Text
                                                    style={{ flex:1, fontSize: s(11) }}
                                                >
                                                    {item.pickupStreet} {item?.pickupArea} {item?.pickupState}
                                                </Text>
                                            </View>

                                            <TouchableOpacity
                                                activeOpacity={0.7}
                                                style={styles.button}
                                                onPress={() => handleRoute(item)}
                                            >
                                                <Text style={styles.buttonText}>Continue</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )
                                })}
                            </View>}

                            {basicOrder?.length !== 0 &&
                                <View style={{ backgroundColor: "white", padding: 20, borderRadius: 15, borderWidth: 0.5, borderColor: colors.border, marginTop: 20 }}>
                                <Text style={{ fontFamily: 'interSemiBold', marginBottom: 20, color: colors.mutedForeground }}>Ongoing Shipment</Text>
                                {basicOrder?.map((item: any, index: number) => {
                                    return (
                                        <View
                                            key={index}
                                            style={[
                                                { paddingVertical: 20 },
                                                index !== basicOrder.length - 1 && {
                                                    borderBottomWidth: 0.5,
                                                    borderColor: colors.border,
                                                },
                                            ]}>
                                            <View style={styles.spaceBetween}>
                                                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                                                    {item?.isSubscriptionOrder ?
                                                        <SubscriptionIcon />
                                                        :
                                                        <ShipmentIcon status={item?.status} />}

                                                    <View style={{ width: "70%" }}>
                                                        <Text
                                                            style={{ fontSize: s(12), fontFamily: "interBold" }}
                                                        >
                                                            {item?.packageDetails.name}
                                                        </Text>
                                                        <Text
                                                            style={{ fontSize: s(11), marginTop: 5 }}
                                                        >
                                                            {formatText(item?.status || "")}
                                                        </Text>
                                                    </View>
                                                </View>

                                                <View
                                                    style={{
                                                        position: "absolute",
                                                        top: 7,
                                                        right: 0,
                                                        justifyContent: "flex-end",
                                                        alignItems: "flex-end",
                                                    }}
                                                >
                                                    <Text style={{ fontSize: s(13), fontFamily: "interMedium" }}>
                                                        ₦{formatMoney(Number(item?.actualPriceInNaira) || 0)}
                                                    </Text>
                                                </View>
                                            </View>

                                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 20 }}>
                                                <PickupIcon />
                                                <Text
                                                    style={{flex:1, fontSize: s(11) }}
                                                >
                                                    {item.pickupStreet} {item?.pickupArea} {item?.pickupState}
                                                </Text>
                                            </View>

                                            <TouchableOpacity
                                                activeOpacity={0.7}
                                                style={styles.button}
                                                onPress={() => handleRoute(item)}
                                            >
                                                <Text style={styles.buttonText}>Continue</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )
                                })}
                            </View>}

                        </>
                    }
                </>


            }

        </View>

    );
};

const styles = StyleSheet.create({
    spaceBetween: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    button: {
        marginTop: 24,
        backgroundColor: "#000",
        borderRadius: 20,
        paddingVertical: 16,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },

    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
        fontFamily: 'interSemiBold'
    },
});

export default OngoingShipment;
