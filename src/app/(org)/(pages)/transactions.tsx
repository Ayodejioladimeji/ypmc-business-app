import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import SafeAreaViews from "@/components/safe-area-view";
import { colors } from "@/theme";
import { Image } from "expo-image";
import { DataContext } from "@/store/GlobalState";
import TopNavigation from "@/components/TopNavigation";
import { s } from "react-native-size-matters";
import DropDownPicker from "react-native-dropdown-picker";
import { useRouter } from "expo-router";
import { GetRequest } from "@/utils/requests";
import { formatMoney } from "@/utils/utils";
import moment from "moment";

const Transactions = () => {
  const { state } = useContext(DataContext);
  const { user, token } = state;
  const [showStatus, setShowStatus] = useState(false);
  const [showDate, setShowDate] = useState(false);
  const [status, setStatus] = useState("all");
  const [transactionDate, setTransactionDate] = useState("all");
  const router = useRouter();
  const [transactions, setTransactions] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const getTransactions = async () => {
    setLoading(true);
    const res = await GetRequest("/transactions/partner?limit=50", token);
    if (res?.status === 200 || res?.status === 201) {
      let data = res?.data?.data || [];

      // Apply sorting
      if (status !== "all") {
        data = data.filter((item: any) => item.status === status);
      }

      if (transactionDate !== "all") {
        const now = moment();
        data = data.filter((item: any) => {
          const itemDate = moment(item.created_at);
          if (transactionDate === "last month") {
            return now.diff(itemDate, "months") < 1;
          } else if (transactionDate === "6 months") {
            return now.diff(itemDate, "months") < 6;
          } else if (transactionDate === "1 year") {
            return now.diff(itemDate, "years") < 1;
          }
          return true;
        });
      }

      setTransactions(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (token) {
      getTransactions();
    }
  }, [token, status, transactionDate]);

  const handleRoute = (item: any) => {
    router.push({
      pathname: "/transaction-details",
      params: { id: item?.id },
    });
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getTransactions();
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  // 

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white', paddingTop: 40 }}>
      <TopNavigation title="Transaction History" />
      <View style={styles.container}>
        <View style={styles.transactionHeader}>
          <View>
            <DropDownPicker
              open={showStatus}
              value={status}
              items={[
                { label: "All", value: "all" },
                { label: "Success", value: "SUCCESS" },
                { label: "Pending", value: "PENDING" },
              ]}
              setOpen={setShowStatus}
              setValue={setStatus}
              placeholder="Status: All"
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
            />
          </View>

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
              setValue={setTransactionDate}
              placeholder="Date: All"
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
            />
          </View>
        </View>

        {loading ? (
          <ActivityIndicator />
        ) : (
          <FlatList
            data={transactions}
            keyExtractor={(item) => item.trackingId}
            renderItem={({ item }) => (
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.transactionItem}
                onPress={() => handleRoute(item)}
              >
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: item.status === "SUCCESS" ? "#4FB9481A" : "#F972161A" },
                  ]}
                >
                  <MaterialCommunityIcons
                    name={item.transactionType === "DEBIT" ? "arrow-top-right" : "arrow-bottom-left"}
                    size={18}
                    color={item.status === "SUCCESS" ? "#4FB948" : "#F97216"}
                  />
                </View>

                <View style={styles.transactionDetails}>
                  <Text style={styles.transactionType}>{item.shipping?.packageName}</Text>
                  <Text style={styles.transactionDate}>{moment(item.createdAt).format("ll")}</Text>
                </View>

                <View style={styles.transactionAmount}>
                  <Text style={styles.amountText}>₦{formatMoney(item.amountInNaira || 0)}</Text>

                  <Text
                    style={[
                      styles.status,
                      {
                        backgroundColor: item.status === "SUCCESS" ? "#ECFDF3" : "#FEF3F2",
                        color: item.status === "SUCCESS" ? "#039855" : "#D92D20",
                      },
                    ]}
                  >
                    {item.status}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Image
                  source={require("@/assets/images/empty-transaction.png")}
                  style={styles.emptyImage}
                  contentFit="contain"
                />
                <Text style={styles.emptyText}>Your transaction history is empty.</Text>
              </View>
            }
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },
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
    height: 55,
    width: 150,
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderTopWidth: 0,
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
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
    fontSize: 14,
    fontWeight: "600",
  },
  status: {
    fontSize: 12,
    fontWeight: "500",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginTop: 4,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  emptyImage: {
    width: 184,
    height: 184,
  },
  emptyText: {
    color: "#636363",
    fontSize: 16,
  },
});

export default Transactions;
