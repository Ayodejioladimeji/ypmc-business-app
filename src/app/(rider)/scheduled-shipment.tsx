
import React, { useContext, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Platform, RefreshControl, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { GetRequest } from "@/utils/requests";
import { DataContext } from "@/store/GlobalState";
import DropDownPicker from "react-native-dropdown-picker";
import { s } from "react-native-size-matters";
import { Text } from "@/components/ui";
import { colors } from "@/theme";
import { EmptyShipmentList, ShipmentCard } from "@/components/rider-components";
import TopNavigation from "@/components/TopNavigation";

const ScheduledShipment = () => {
    const [data, setData] = useState<any>([])
    const [filteredData, setFilteredData] = useState<any>([]);
    const { state } = useContext(DataContext)
    const [loading, setLoading] = useState(true)
    const [showDate, setShowDate] = useState(false)
    const [status, setStatus] = useState("")
    const [transactionDate, setTransactionDate] = useState("")
    const [refreshing, setRefreshing] = React.useState(false);
    const [visibleCount, setVisibleCount] = useState(10);

    // get all rider deliveries
    useEffect(() => {
        if (state?.token) {
            getAllDeliveries(state?.token)
        }
    }, [state?.token])

    // get all deliveries
    const getAllDeliveries = async (token: string) => {
        const res = await GetRequest(`/shipping/rider?statusCategory=SCHEDULED`, token)
        if (res?.status === 200 || res?.status === 201) {
            setData(res?.data?.data)
            setLoading(false)
        }
        else{
            setLoading(false)
        }
    }

    const filterData = (deliveries: any[], dateFilter: string) => {
        if (dateFilter === "all") {
            setFilteredData(deliveries);
        } else {
            const now = new Date();
            const filtered = deliveries.filter((item) => {
                const createdAt = new Date(item.createdAt);
                switch (dateFilter) {
                    case "last month":
                        const oneMonthAgo = new Date(now);
                        oneMonthAgo.setMonth(now.getMonth() - 1);
                        return createdAt >= oneMonthAgo;
                    case "6 months":
                        const sixMonthsAgo = new Date(now);
                        sixMonthsAgo.setMonth(now.getMonth() - 6);
                        return createdAt >= sixMonthsAgo;
                    case "1 year":
                        const oneYearAgo = new Date(now);
                        oneYearAgo.setFullYear(now.getFullYear() - 1);
                        return createdAt >= oneYearAgo;
                    default:
                        return true;
                }
            });
            setFilteredData(filtered);
        }
        setVisibleCount(10);
    };

    useEffect(() => {
        filterData(data, transactionDate);
        
    }, [transactionDate, data]);


    const onRefresh = () => {
        setRefreshing(true);
        getAllDeliveries(state?.token);
        setTimeout(() => setRefreshing(false), 1000);
    };

    // 

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: 15, paddingTop: Platform.OS === "android" ? 40 : 0 }}>
            <TopNavigation title="Scheduled Shipment" />
            <View style={styles.transactionHeader}>

                <View>
                    <DropDownPicker
                        open={showDate}
                        value={transactionDate}
                        items={[
                            { label: "All", value: "all" },
                            { label: "Last month", value: "last month" },
                            { label: "6 months", value: "6 months" },
                            { label: "1 year", value: "1 year" },
                        ]}
                        setOpen={setShowDate}
                        setValue={(value) => setTransactionDate(value)}
                        placeholder="Date : All"
                        style={{
                            borderWidth: 0.8,
                            borderColor: "#ccc",
                            borderRadius: 25,
                            paddingHorizontal: 15,
                            justifyContent: "center",
                            // height: 55,
                            width: 150,
                        }}
                        dropDownContainerStyle={{
                            // backgroundColor: "#f3f3f3",
                            borderWidth: 1,
                            elevation: 0,
                            borderColor: "#ccc",
                            borderTopWidth: 0,
                        }}
                    />
                </View>
            </View>

            {loading ?
                <ActivityIndicator />
                :

                <>
                    {
                        filteredData?.length === 0 ?
                            <EmptyShipmentList message="No deliveries yet. Stay ready!" />
                            :

                            <FlatList
                                data={filteredData.slice(0, visibleCount)}
                                keyExtractor={(item) => item.id}
                                renderItem={({ item }) => <ShipmentCard data={item} />}
                                showsVerticalScrollIndicator={false}
                                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                                ListFooterComponent={
                                    filteredData.length > visibleCount ? (
                                        <View style={styles.footer}>
                                            <TouchableOpacity style={{ marginTop: 20 }}
                                                onPress={() => setVisibleCount(visibleCount + 10)}
                                            >
                                                <Text style={{ color: colors.primary, textDecorationLine: "underline" }}>Load More</Text>
                                            </TouchableOpacity>
                                        </View>
                                    ) :
                                        <View style={styles.footer} />
                                }
                                style={{ paddingHorizontal: 15 }}
                            />
                    }
                </>

            }
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    transactionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 20,
        paddingHorizontal: 15,
        marginBottom: 20,
        borderBottomWidth: 1,
        borderColor: "#E4E7EC",

    },
    transactionTitle: {
        fontSize: s(14),
        fontWeight: "500",
        color: "#101828",
    },
    footer: {
        marginBottom: 80,
        alignItems: "center",
    },
})

export default ScheduledShipment
