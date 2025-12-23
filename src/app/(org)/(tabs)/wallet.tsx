import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ImageBackground,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import moment from "moment";
import { s } from "react-native-size-matters";

import EarningsSummary from "@/components/org-components/earning-summary";
import { DataContext } from "@/store/GlobalState";
import { colors } from "@/theme";
import { formatMoney } from "@/utils/utils";
import Navigation from "@/components/Navigation";
import { ACTIONS } from "@/store/Actions";
import { GetRequest } from "@/utils/requests";

const WalletScreen = () => {
  const { state, dispatch } = useContext(DataContext);
  const { wallets: transaction } = state;
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);


  const handleRoute = (item: any) => {
    router.push({
      pathname: "/transaction-details",
      params: {
        id: item.transactionId,
      },
    });
  };

  const getWallet = async () => {
    const res = await GetRequest("/partner/wallet-dashboard", state?.token);
    if (res?.status === 200 || res?.status === 201) {
      dispatch({ type: ACTIONS.WALLETS, payload: res?.data?.data })
      // console.log("----its here and new", res?.data?.data.walletBalance)
    }
  };

  useEffect(() => {
    if(state?.packageDelivered){
        getWallet()
    }

    setTimeout(() => {
      dispatch({ type: ACTIONS.PACKAGE_DELIVERED })
    }, 10000)
  },[state?.packageDelivered])



  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getWallet()
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, [refreshing]);

  //

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white", paddingTop: 40 }}>
      <Navigation title="Wallet" />

      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} >
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
            Available Balance
          </Text>

          <Text style={styles.walletBalance}>
            ₦{transaction?.walletBalance.toLocaleString() || 0}
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

        <EarningsSummary data={transaction} />


        {/* Transaction Header */}
        <View style={styles.transactionHeader}>
          <Text style={styles.transactionTitle}>Transaction History</Text>
          <TouchableOpacity
            style={styles.seeAllButton}
            onPress={() => router.push("/transactions")}
          >
            <Text style={styles.seeAllText}>See all</Text>
            <Ionicons name="arrow-forward" size={16} color="black" />
          </TouchableOpacity>
        </View>

        {transaction?.transactionHistory?.transactions?.length === 0 ? (
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
        ) : (
          <>
            {transaction?.transactionHistory?.transactions?.slice(0, 5)?.map((item: any, index: number) => {

              return (
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={styles.transactionItem}
                  onPress={() => handleRoute(item)}
                  key={index}
                >
                  <View
                    style={[
                      styles.iconContainer,
                      {
                        backgroundColor:
                          item.transactionStatus === "SUCCESS"
                            ? "#4FB9481A"
                            : "#F972161A",
                      },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name={
                        item.transactionType === "DEBIT"
                          ? "arrow-top-right"
                          : "arrow-bottom-left"
                      }
                      size={18}
                      color={
                        item.transactionStatus === "SUCCESS" ? "#4FB948" : "#F97216"
                      }
                    />
                  </View>

                  <View style={styles.transactionDetails}>
                    <Text style={styles.transactionType}>
                      {item.packageDetails?.name}
                    </Text>
                    <Text style={styles.transactionDate}>
                      {moment(item.createdAt).format("ll")}
                    </Text>
                  </View>

                  <View style={styles.transactionAmount}>
                    <Text style={styles.amountText}>
                      ₦{formatMoney(item.actualAmount || 0)}
                    </Text>

                    <Text
                      style={[
                        styles.status,
                        {
                          backgroundColor:
                            item.transactionStatus === "SUCCESS"
                              ? "#ECFDF3"
                              : "#FEF3F2",
                          color:
                            item.transactionStatus === "SUCCESS"
                              ? "#039855"
                              : "#D92D20",
                        },
                      ]}
                    >
                      {item.transactionStatus}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </>
        )}

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

export default WalletScreen;
