import React, { useCallback, useContext, useEffect, useState } from "react";
import {
    ActivityIndicator,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { Image } from "expo-image";
import { useRouter } from "expo-router";
import moment from "moment";
import { s } from "react-native-size-matters";
import { DataContext } from "@/store/GlobalState";
import { colors } from "@/theme";
import { GetRequest } from "@/utils/requests";
import { formatMoney } from "@/utils/utils";
import Navigation from "@/components/Navigation";
import images from "@/assets/images";
import TopNavigation from "@/components/TopNavigation";

const RidersEarnings = () => {
    const { state } = useContext(DataContext);
    const { token, user, wallets: transaction } = state;
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [earnings, setEarnings] = useState<any>([])


    useEffect(() => {
        const getEarnings = async () => {
            const res = await GetRequest(`/partner/riders-earnings`, state?.token)
            if (res?.status === 200 || res?.status === 201) {
                setEarnings(res?.data?.data)
            }
            setLoading(false)
        }

        if (state?.token) {
            getEarnings()
        }
    }, [])

    console.log(earnings)

    //

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "white", paddingTop: 40 }}>
            <TopNavigation title="Riders Earnings" />

            <ScrollView showsVerticalScrollIndicator={false} style={styles.container} >
                <View style={styles.wallet}>
                    <Text
                        style={{
                            fontSize: 14,
                            color: "#fff",
                            marginTop: 20,
                            marginLeft: 20,
                            fontWeight: 500,
                        }}
                    >
                        Total to Disburse
                    </Text>
                    {loading ?
                        <ActivityIndicator color="white" style={{alignSelf:'flex-start', marginLeft:30, marginTop:20}} />
                        :
                        <Text style={styles.walletBalance}>
                            ₦{formatMoney(earnings?.totalRidersEarnings)}
                        </Text>}

                    <Image
                        source={require("@/assets/images/ring.png")}
                        style={styles.ring}
                    />
                </View>


                {/* Transaction Header */}
                <View style={styles.transactionHeader}>
                    <Text style={styles.transactionTitle}>Riders Payment Breakdown</Text>
                </View>

                {loading ? <ActivityIndicator />

                    :

                    <>
                        {earnings?.riders?.length === 0 ? (
                            <View
                                style={{
                                    backgroundColor: "#FFF",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <Image
                                    source={require("@/assets/images/empty-earnings.png")}
                                    style={{
                                        width: 184,
                                        height: 184,
                                    }}
                                    contentFit="contain"
                                />
                                <Text style={{ color: "#636363", fontSize: 16 }}>
                                    All clear! No pending disbursements.
                                </Text>
                            </View>
                        ) : (
                            <>
                                {Object?.entries(
                            earnings?.riders?.reduce((acc: any, rider: any) => {
                                const date = moment(rider.associatedSince).format("DD MMM YYYY");
                                if (!acc[date]) acc[date] = [];
                                acc[date].push(rider);
                                return acc;
                            }, {})
                        )?.map(([date, entries]: [string, any[]]) => (
                            <View key={date}>
                                <Text
                                    style={{
                                        color: colors.mutedForeground,
                                        fontFamily: "interMedium",
                                        marginTop: 20,
                                        marginBottom: 8,
                                    }}
                                >
                                    {date === moment().format("DD MMM YYYY") ? "Today" : date}
                                </Text>

                                {entries.map((item, index) => (
                                    <TouchableOpacity
                                        activeOpacity={0.7}
                                        style={styles.transactionItem}
                                        key={`${date}-${index}`}
                                    >
                                        <Image
                                            source={item?.profileImage || images?.user}
                                            style={{
                                                width: 40,
                                                height: 40,
                                                borderRadius: 50,
                                                borderWidth:0.5,
                                                borderColor:colors.mutedForeground
                                            }}
                                            contentFit="contain"
                                        />

                                        <View style={styles.transactionDetails}>
                                            <Text style={styles.transactionType}>
                                                {item?.firstName} {item?.lastName}
                                            </Text>
                                            <Text style={styles.transactionDate}>
                                                {moment(item.associatedSince).format("hh:mm A")}
                                            </Text>
                                        </View>

                                        <View style={styles.transactionAmount}>
                                            <Text style={styles.amountText}>
                                                ₦{formatMoney(item.earnings?.total || 0)}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        ))}
                            </>
                        )}
                    </>
                }


            </ScrollView>
        </SafeAreaView>
    );
};

// Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 16,
    },
    walletContainer: {
        paddingHorizontal: 20,
        padding: 20,
        height: 190,
    },
    wallet: {
        position: "relative",
        height: 150,
        backgroundColor: "#1E83C5",
        borderRadius: 20,
        paddingVertical: 20,
        marginTop: 20,
    },
    walletName: {
        fontFamily: "interMedium",
        fontSize: 12,
        color: "#fff",
        letterSpacing: 4,
        marginLeft: 20,
    },
    walletBalance: {
        fontFamily: "interSemiBold",
        fontSize: 24,
        color: "#fff",
        marginTop: 10,
        marginLeft: 20,
    },
    walletImage: {
        width: "70%",
        height: 120,
        position: "absolute",
        bottom: 0,
        right: 0,
        objectFit: "contain",
    },
    itemContainer: {
        backgroundColor: "#ffffff",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginBottom: 20,
    },
    ring: {
        width: 176,
        height: 176,
        position: "absolute",
        top: -118,
        left: 20,
    },
    withdrawButton: {
        borderWidth: 1,
        borderColor: "#D0D5DD",
        borderRadius: 25,
        paddingVertical: 18,
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 16,
    },
    withdrawText: {
        fontSize: 16,
        fontWeight: "500",
        color: "#101828",
    },
    transactionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 20,
        marginTop: 20,
        borderTopWidth: 1,
        borderColor: "#E4E7EC",
    },
    transactionTitle: {
        fontSize: s(14),
        fontWeight: "500",
        color: "#101828",
        textTransform: "capitalize",
    },
    seeAllButton: {
        flexDirection: "row",
        alignItems: "center",
    },
    seeAllText: {
        fontSize: s(13),
        fontWeight: "500",
        color: colors.mutedForeground,
        marginRight: 4,
    },
    transactionItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        gap: 10
        // borderBottomWidth: 1,
        // borderBottomColor: "#E4E7EC",
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },
    transactionDetails: {
        flex: 1,
    },
    transactionType: {
        fontSize: 14,
        fontWeight: "500",
        color: "#101828",
    },
    transactionDate: {
        fontSize: 12,
        color: "#667085",
        marginTop: 2,
    },
    transactionAmount: {
        alignItems: "flex-end",
    },
    amountText: {
        fontSize: s(14),
        fontWeight: "600",
    },
    status: {
        fontSize: s(11),
        fontWeight: "500",
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 6,
        marginTop: 4,
        textTransform: "capitalize",
    },
});

export default RidersEarnings;
