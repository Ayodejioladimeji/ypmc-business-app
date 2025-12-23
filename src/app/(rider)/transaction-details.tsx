import React, { useContext, useEffect, useState } from "react";
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

import {  MaterialCommunityIcons } from "@expo/vector-icons";

import SafeAreaViews from "@/components/safe-area-view";
import TopNavigation from "@/components/TopNavigation";
import { useLocalSearchParams } from "expo-router";
import { s } from "react-native-size-matters";
import AddressList from "@/components/addresslist";
import { DataContext } from "@/store/GlobalState";
import { GetRequest } from "@/utils/requests";
import moment from "moment";
import { formatMoney } from "@/utils/utils";

const ShipmentDetails = () => {
  const { state } = useContext(DataContext)
  const {token } = state
  const [transaction, setTransaction] = useState<any>([])
  const [loading, setLoading] = useState(true)
  const { id } = useLocalSearchParams()


  const getTransactions = async () => {
    const res = await GetRequest(`/transactions/rider/${id}`, token)
    if (res?.status === 200 || res?.status === 201) {
      setTransaction(res?.data?.data)
    }
    setLoading(false)
  }

  useEffect(() => {
    if (token && id) {
      getTransactions()
    }
  }, [token, id])

  // 

  return (
    <SafeAreaView style={{flex:1, paddingTop:40, backgroundColor:'#fff'}}>
      <TopNavigation title="Transaction Details" />

      {loading ? 
      <View style={{marginTop:40}}>
          <ActivityIndicator /> 
      </View>

      : 
      
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: transaction?.status === "SUCCESS" ? "#D1FADF" : "#FEE4E2" }]}>
            <MaterialCommunityIcons
              name={transaction?.transactionType === "DEBIT" ? "arrow-top-right" : "arrow-bottom-left"}
              size={18}
              color={transaction?.status === "SUCCESS" ? "#4FB948" : "#F97216"}
            />
          </View>

          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Text style={styles.category}>{transaction?.shipping?.packageName || transaction?.transactionType}</Text>
              <Text style={[styles.status, { backgroundColor: transaction?.status === "SUCCESS" ? "#D1FADF" : "#FEE4E2", color: transaction.status !== "SUCCESS" ? "#D92D20" : "#039855" }]}>{transaction?.status}</Text>
            </View>

            <Text style={styles.date}>
              {moment(transaction?.created_at).format("ll")}• {moment(transaction?.created_at).format('LT')}
            </Text>
          </View>
        </View>

        {/* {!transaction?.shipping &&
         <>
          <View style={styles.earnings}>
            <View style={styles.earningRow}>
              <Text style={styles.label}>Transaction ID</Text>
              <Text style={styles.value}>{transaction?.reference}</Text>
            </View>

            <View style={styles.earningRow}>
              <Text style={styles.label}>Amount Withdrawn</Text>
              <Text style={styles.value}>₦9,000</Text>
            </View>

            <View style={styles.earningRow}>
              <Text style={styles.label}>Withdrawal Date</Text>
              <Text style={styles.value}>₦3,700</Text>
            </View>

            <View style={styles.earningRow}>
              <Text style={styles.label}>Withdrawal Time</Text>
                  <Text style={styles.value}>{moment(transaction?.created_at).format("LT")}</Text>
            </View>

            <View style={{ height: 2, marginVertical: 15, backgroundColor: colors.muted }}></View>

            <View style={styles.earningRow}>
              <Text style={styles.label}>Withdrawal Method</Text>
              <Text style={styles.value}>Bank Account (****1234)</Text>
            </View>
            <View style={styles.earningRow}>
              <Text style={styles.label}>Status</Text>
              <Text style={styles.value}>{transaction?.status}</Text>
            </View>
            <View style={styles.earningRow}>
              <Text style={styles.label}>Transaction Fee</Text>
                  <Text style={styles.value}>₦{formatMoney(transaction?.amountInNaira || 0)}</Text>
            </View>
            <View style={styles.earningRow}>
              <Text style={styles.label}>Reference Number</Text>
              <Text style={styles.value}>{transaction?.reference}</Text>
            </View>

            <View style={{
              flexDirection: 'row',
              backgroundColor: '#FEE4E2',
              borderRadius: 25,
              paddingVertical: 20,
              gap: 10,
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 25
            }}>
              <AntDesign name="exclamationcircleo" size={17} color="black" />
              <Text style={{ color: "#FEE4E2 " }}>Funds will be available in 1-3 business days.</Text>
            </View>
          </View>
        </>} */}

          <>
            <View style={styles.infoRow}>
              <View>
                <Text style={styles.label}>Duration</Text>
                <Text style={styles.value}>{transaction?.shipping?.duration}</Text>
              </View>

              <View>
                <Text style={styles.label}>Distance</Text>
                <Text style={styles.value}>{transaction?.shipping?.distanceInKilometers?.toFixed(1)}km</Text>
              </View>
            </View>

            <AddressList data={transaction?.shipping} />

            <View style={styles.earnings}>
              <Text style={styles.sectionTitle}>Shipment Earnings</Text>
              <View style={styles.earningRow}>
                <Text style={styles.label}>Customer’s name</Text>
                <Text style={styles.value}>{transaction?.shipping?.customerName}</Text>
              </View>

              <View style={styles.earningRow}>
                <Text style={styles.label}>Payment method</Text>
                <Text style={styles.value}>{transaction?.paymentMethod}</Text>
              </View>

              <View style={styles.earningRow}>
                <Text style={styles.label}>Fare amount</Text>
                <Text style={styles.value}>₦{formatMoney(transaction?.amountInNaira || 0)}</Text>
              </View>

              <View style={styles.earningRow}>
                <Text style={styles.label}>Total earning</Text>
                <Text style={styles.value}>₦{formatMoney(transaction?.amountInNaira || 0)}</Text>
              </View>
            </View>
          </>
        
      </ScrollView>
      }

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#fff", flex: 1 },
  header: { flexDirection: "row" },
  category: { fontSize: 18, fontWeight: 500 },
  status: {
    backgroundColor: "#d4f5d4",
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 10,
    color: "green",
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  date: { color: "#666", marginVertical: 8 },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 25,
    marginTop: 35,
  },
  label: { color: "#666", fontSize: s(13) },
  value: { fontSize: s(13), fontWeight: 500, },
  route: { marginVertical: 12 },
  address: { fontSize: 16, marginVertical: 4 },
  earnings: {
    borderTopWidth: 1,
    borderColor: "#ddd",
    paddingTop: 12,
    marginTop: 30,
  },
  sectionTitle: { fontSize: s(14), fontWeight: 500, marginBottom: 25, marginTop: 20 },
  earningRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems:'center',
    marginBottom:30
  },
});

export default ShipmentDetails;
