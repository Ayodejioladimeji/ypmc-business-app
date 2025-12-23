import React, { useContext, useEffect, useState } from "react";
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, View } from "react-native";

import { FontAwesome6 } from "@expo/vector-icons";
import { Text } from "@/components/ui";
import { s } from "react-native-size-matters";
import { useRouter } from "expo-router";
import { DataContext } from "@/store/GlobalState";
import { GetRequest, PostRequest } from "@/utils/requests";
import { toast } from "sonner-native";
import TopNavigation from "@/components/TopNavigation";
import { colors } from "@/theme";
import { formatMoney } from "@/utils/utils";


const DeliveryRates = () => {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const { state } = useContext(DataContext)
    const [rates, setRates] = useState<any>(null)


    useEffect(() => {
        if (state?.token) {
            const getkilometerRate = async () => {
                const res = await GetRequest("/pricing-model/rider", state?.token)
                if (res?.status === 200 || res?.status === 201) {
                    const payload = {
                        kilometerRate: Number(res?.data?.data?.ratePerKilometer).toString(),
                        hourlyRate: Number(res?.data?.data?.ratePerHour).toString(),
                        otherCosts: Number(res?.data?.data?.otherOperationalCosts).toString(),
                    }
                    setRates(payload)
                }
                setLoading(false)
            }
            getkilometerRate()
        }
    }, [state?.token])



    // 

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white', paddingTop: 40 }}>
            <TopNavigation title="" />

            <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingHorizontal: 16 }}>
                <View style={{ gap: 12, marginBottom: 40 }}>
                    <View style={styles.headerContainer}>
                        <FontAwesome6 name="naira-sign" size={25} />
                        <Text style={{ fontWeight: "500", fontSize: s(22) }}>
                            Delivery Rate
                        </Text>
                    </View>
                    <Text style={{ fontSize: 18, color: "gray" }}>
                        This is the delivery rate set by your partner for all orders.
                    </Text>
                </View>

                {loading ? <ActivityIndicator size="large" /> :

                    <>
                        <View style={styles.box}>
                            <Text style={styles.label}>Rate per kilometer (NGN)</Text>
                            <Text style={[styles.label, {color:'black', fontWeight:"bold"}]}>N{formatMoney(rates?.kilometerRate || 0)}</Text>
                        </View>

                        <View style={styles.box}>
                            <Text style={styles.label}>Hourly Rate (NGN)</Text>
                            <Text style={[styles.label, {color:'black', fontWeight:"bold"}]}>N{formatMoney(rates?.hourlyRate || 0)}</Text>
                        </View>

                        <View style={styles.box}>
                            <Text style={styles.label}>Other Operational Costs (NGN)</Text>
                            <Text style={[styles.label, {color:'black', fontWeight:"bold"}]}>N{formatMoney(rates?.otherCosts || 0)}</Text>
                        </View>


                        <View style={styles.orangeBox}>
                            <Text style={{ color: "#f97216", fontSize: s(15), fontWeight: "bold", marginBottom: 10 }}>
                                NGN 0.00
                            </Text>
                            <Text>
                                Your earning for a distance of 0km and time of 0hr
                            </Text>
                        </View>
                    </>
                }


            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginTop: 12,
    },
    box: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 30,
        borderBottomWidth: 0.3,
        borderColor: colors.border,
        paddingHorizontal:10
    },
    label:{
        fontSize: s(13),
        color: "gray",
    },
    orangeBox: {
        marginTop: 12,
        backgroundColor: "#fff8f3",
        paddingHorizontal: 12,
        paddingVertical: 20,
        borderRadius: 20,
    },
});

export default DeliveryRates