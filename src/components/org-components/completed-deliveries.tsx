import React, { useContext, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { GetRequest } from "@/utils/requests";
import { DataContext } from "@/store/GlobalState";
import DropDownPicker from "react-native-dropdown-picker";
import { s } from "react-native-size-matters";
import { Text } from "@/components/ui";
import { colors } from "@/theme";
import { EmptyShipmentList } from "../rider-components";
import { ShipmentCard } from "./ShipmentCard";
import { sortDeliveries } from "@/utils/filter";

// 

export const CompletedDeliveries = ({ data, loading, getCompletedDeliveries }) => {

  const [filteredData, setFilteredData] = useState<any>([]);
  const { state } = useContext(DataContext)
  const [showStatus, setShowStatus] = useState(false)
  const [showDate, setShowDate] = useState(false)
  const [status, setStatus] = useState("")
  const [transactionDate, setTransactionDate] = useState("")
  const [refreshing, setRefreshing] = React.useState(false);
  const [visibleCount, setVisibleCount] = useState(10);


  const onRefresh = () => {
    setRefreshing(true);
    getCompletedDeliveries(state?.token);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const sortedData = sortDeliveries(data, transactionDate)

  // 

  return (
    <View>
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

      <>
        {loading ? (
          <ActivityIndicator style={{ marginTop: 20 }} />
        ) :

          <FlatList
            data={sortedData?.slice(0, visibleCount)}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <ShipmentCard data={item} />}
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            ListFooterComponent={
              sortedData.length > visibleCount ? (
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
            ListEmptyComponent={
              <EmptyShipmentList message="No active shipment at this time" />
            }
          />
        }

      </>

    </View>
  );
};

const styles = StyleSheet.create({
  transactionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
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
    marginBottom: 420,
    alignItems: "center",
  },
})
