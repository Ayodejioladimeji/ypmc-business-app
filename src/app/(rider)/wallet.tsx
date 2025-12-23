import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  FlatList,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import SafeAreaViews from "@/components/safe-area-view";
import { colors } from "@/theme";
import { Image } from "expo-image";
import { DataContext } from "@/store/GlobalState";
import TopNavigation from "@/components/TopNavigation";
import { s } from "react-native-size-matters";
import { useRouter } from "expo-router";
import { GetRequest } from "@/utils/requests";
import { formatMoney } from "@/utils/utils";
import moment from "moment";
import { ACTIONS } from "@/store/Actions";



const WalletScreen = () => {
  const { state, dispatch } = useContext(DataContext)
  const { token, user } = state
  const router = useRouter()
  const [transactions, setTransactions] = useState<any>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false);

  const getTransactions = async () => {
    const res = await GetRequest("/transactions/rider", token)
    if (res?.status === 200 || res?.status === 201) {
      setTransactions(res?.data?.data)

    }
    setLoading(false)
  }

  useEffect(() => {
    if (token) {
      getTransactions()
    }
  }, [token])

  const handleRoute = (item: any) => {

    router.push({
      pathname: "/(rider)/transaction-details",
      params: {
        id: item.id
      }
    })
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    getTransactions()
    dispatch({type:ACTIONS.CALLBACK, payload: !state?.callback})

    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, [refreshing]);


  // 

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white', paddingTop: 40 }}>
      <TopNavigation title="Wallet" />
      <View style={styles.container}>
        <View style={styles.wallet}>
          <Text
            style={{
              fontSize: 14,
              color: "#fff",
              marginTop: 20,
              marginLeft: 20,
              fontWeight: 500
            }}
          >
            Available Balance
          </Text>

          <Text style={styles.walletBalance}>₦{formatMoney(user?.walletBalance)}

          </Text>

          <Image
            source={require("@/assets/images/wallet.png")}
            style={styles.walletImage}
          />

          <Image
            source={require("@/assets/images/ring.png")}
            style={styles.ring}
          />
        </View>

        {/* Request Withdrawal Button */}
        {user?.metadata?.verificationStatus === "VERIFIED" && <TouchableOpacity activeOpacity={0.7} onPress={() => router.push("/(rider)/request-withdrawal")} style={styles.withdrawButton}>
          <Text style={styles.withdrawText}>Request Withdrawal</Text>
        </TouchableOpacity>}

        {/* Transaction Header */}
        <View style={styles.transactionHeader}>
          <Text style={styles.transactionTitle}>Transaction History</Text>
          <TouchableOpacity style={styles.seeAllButton} onPress={() => router.push("/(rider)/transactions")}>
            <Text style={styles.seeAllText}>See all</Text>
            <Ionicons name="arrow-forward" size={16} color="black" />
          </TouchableOpacity>
        </View>


        {loading ?
          <ActivityIndicator />
          :

          <FlatList
            data={transactions}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity activeOpacity={0.7} style={styles.transactionItem} onPress={() => handleRoute(item)}>
                <View style={[styles.iconContainer, { backgroundColor: item.status === "SUCCESS" ? "#4FB9481A" : "#F972161A" }]}>
                  <MaterialCommunityIcons name={item.transactionType === "DEBIT" ? "arrow-top-right" : "arrow-bottom-left"} size={18} color={item.status === "SUCCESS" ? "#4FB948" : "#F97216"} />
                </View>

                <View style={styles.transactionDetails}>
                  <Text style={styles.transactionType}>{item.transactionCategory}</Text>
                  <Text style={styles.transactionDate}>{moment(item.created_at).format("ll")}</Text>
                </View>

                <View style={styles.transactionAmount}>
                  <Text style={styles.amountText}>
                    ₦{formatMoney(item.amountInNaira || 0)}
                  </Text>

                  <Text style={[styles.status, { backgroundColor: item.status === "SUCCESS" ? "#ECFDF3" : "#FEF3F2", color: item.status === "SUCCESS" ? "#039855" : "#D92D20" }]}>
                    {item.status}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View
                style={{
                  backgroundColor: "#FFF",
                  // marginTop: 150,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Image
                  source={require("@/assets/images/empty-transaction.png")}
                  style={{
                    width: 184,
                    height: 184,
                  }}
                  contentFit="contain"
                />
                <Text style={{ color: "#636363", fontSize: 16 }}>
                  Your transaction history is empty.
                </Text>
              </View>
            }

            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            }
          />
        }
      </View>
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
    paddingVertical: 20,
    height: 190,
  },
  wallet: {
    position: "relative",
    height: 150,
    backgroundColor: '#1E83C5',
    borderRadius: 20,
    paddingVertical: 20,
    marginTop: 20
  },
  walletName: {
    fontFamily: "interMedium",
    fontSize: 12,
    color: "#fff",
    letterSpacing: 4,
    marginLeft: 20
  },
  walletBalance: {
    fontFamily: "interSemiBold",
    fontSize: 24,
    color: "#fff",
    marginTop: 10,
    marginLeft: 20
  },
  walletImage: {
    width: "70%",
    height: 120,
    position: "absolute",
    bottom: 0,
    right: 0,
    objectFit: 'contain',
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
    borderColor: "#E4E7EC"

  },
  transactionTitle: {
    fontSize: s(14),
    fontWeight: "500",
    color: "#101828",
    textTransform: 'capitalize'
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
    textTransform: 'capitalize'
  },
});

export default WalletScreen;
