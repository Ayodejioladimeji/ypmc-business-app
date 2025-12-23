import React, { useContext, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, RefreshControl, View, StyleSheet, TouchableOpacity } from "react-native";
import { GetRequest } from "@/utils/requests";
import { DataContext } from "@/store/GlobalState";
import DropDownPicker from "react-native-dropdown-picker";
import { CustomButton } from "@/components/CustomButton";
import { Text } from "@/components/ui";
import { colors } from "@/theme";
import { ShipmentCard } from "./ShipmentCard";
import { EmptyShipmentList } from "../rider-components";

export const ActiveDeliveries = ({loading, data, getActiveDeliveries}) => {
  const { state } = useContext(DataContext);
  const [filteredData, setFilteredData] = useState<any>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [visibleCount, setVisibleCount] = useState(10);


  const onRefresh = () => {
    setRefreshing(true);
    getActiveDeliveries(state?.token);
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <View style={{ height: "100%" }}>

      {loading ? (
        <ActivityIndicator style={{marginTop:20}}/>
      ) : (
        <FlatList
            data={data?.slice(0, visibleCount)}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ShipmentCard data={item} />}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            style={{ marginTop: 20 }}
          ListFooterComponent={
            data.length > visibleCount ? (
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
      )}
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
  dropdown: {
    borderWidth: 0.8,
    borderColor: "#ccc",
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 15,
    justifyContent: "center",
    height: 55,
    width: 150,
  },
  dropdownContainer: {
    borderWidth: 1,
    elevation: 0,
    borderColor: "#ccc",
    borderTopWidth: 0,
  },
  footer: {
    marginBottom: 220,
    alignItems: "center",
  },
});
