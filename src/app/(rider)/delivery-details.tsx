import React, { useContext, useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";

import { Layout } from "@/components";
import TopNavigation from "@/components/TopNavigation";
import { useLocalSearchParams } from "expo-router";
import { DataContext } from "@/store/GlobalState";
import ShipmentIcon from "@/components/rider-components/shipment-icon";
import { Text } from "@/components/ui";
import moment from "moment";
import { s } from "react-native-size-matters";
import ShipmentTag from "@/components/rider-components/shipment-tag";
import { ImageBackground } from "expo-image";
import { images } from "@/constants";
import { formatMoney } from "@/utils/utils";
import { Line } from "@/components/ui/line";
import { colors } from "@/theme";
import { MaterialIcons } from "@expo/vector-icons";
import { GetRequest } from "@/utils/requests";

export interface RiderProps {
  allRiders?: any;
  activeRiders?: any;
  pendingRequests?: any;
  isLoading: boolean;
  refetch: () => void;
}


const RiderDeliveryDetails = () => {
  const { id } = useLocalSearchParams()
  const { state, dispatch } = useContext(DataContext)
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    if (state?.token) {
      const getDelivery = async () => {
        const res = await GetRequest(`/shipping/rider/${id}`, state?.token)
        if (res?.status === 200 || res?.status === 201) {
          setOrder(res?.data?.data)
        }
        setLoading(false)
      }
      getDelivery()
    }
  }, [state?.token])


  // 

  return (
    <Layout>
      <TopNavigation title={order?.trackingId} />

      {loading ? <ActivityIndicator />
        :
        <ScrollView style={{ marginTop: 20 }} showsVerticalScrollIndicator={false}>
          <View style={{ flexDirection: "row", marginBottom: 16 }}>
            <ShipmentIcon status={order?.status} />
            <View style={{ marginLeft: 10, flex: 1 }}>
              <Text
                style={{
                  flex: 1,
                  fontSize: s(12),
                  fontFamily: "interSemiBold",
                  flexShrink: 1,
                }}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {order?.packageDetails?.name || "N/A"}
              </Text>

              <Text style={{ color: "gray", marginTop: 10 }}>
                {moment(order?.estimatedDeliveryTime).format("lll")}
              </Text>
            </View>

          </View>

          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <ImageBackground
              source={images.shipment}
              style={{
                width: "100%",
                height: 200,
                justifyContent: "center",
                alignItems: "center",
              }}
            />

            <View style={{ position: 'absolute', right: 20, top: 20 }}>
              <ShipmentTag status={order?.status} />
            </View>
          </View>

          <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 20 }}>
            <Text style={{ color: colors.mutedForeground }}>Duration</Text>
            <Text style={{ color: colors.mutedForeground }}>Distance</Text>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
            <Text style={{ fontFamily: 'interMedium' }}>{order?.estimatedDuration}min</Text>
            <Text style={{ fontFamily: 'interMedium' }}>{order?.distanceInKilometers.toFixed(1) || 0}km</Text>
          </View>

          <View style={styles.addressContainer}>
            <View style={styles.rowContainer}>
              {/* First Address Icon with Line */}
              <View style={styles.iconWrapper}>
                <MaterialIcons name="circle" size={17} color="#FF5E00" />
                <View style={styles.verticalLine} />
              </View>

              <View style={styles.textContainer}>
                <Text style={{ fontSize: s(11), color: colors.mutedForeground }}>Pickup</Text>
                <Text style={[styles.address, { paddingBottom: 20 }]}>
                  {order?.pickupStreet} {order?.pickupState}
                </Text>
              </View>
            </View>

            {/* Second Address */}
            <View style={styles.rowContainer}>
              <View style={styles.iconWrapper}>
                <MaterialIcons name="place" size={21} color="#4CAF50" />
              </View>

              <View style={styles.textContainer}>
                <Text style={{ fontSize: s(11), color: colors.mutedForeground }}>Delivery</Text>
                <Text style={styles.address}>
                  {order?.dropoffStreet} {order?.dropoffState}
                </Text>
              </View>
            </View>
          </View>

          <Line />

          <View>
            <Text style={{ fontFamily: 'interMedium', fontSize: 16, marginTop: 10 }}>Your Earnings</Text>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 20 }}>
              <Text>Payment Method</Text>
              <Text>Bank Transfer</Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 20 }}>
              <Text>Fare Amount</Text>
              <Text>₦{formatMoney(Number(order?.actualPriceInNaira || 0))}</Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 20, marginBottom: 40 }}>
              <Text style={{ fontFamily: 'interMedium' }}>Total Earnings</Text>
              <Text style={{ fontFamily: 'interMedium' }}>₦{formatMoney(Number(order?.actualPriceInNaira || 0))}</Text>
            </View>
          </View>
        </ScrollView>}
    </Layout>
  );
};

const styles = StyleSheet.create({
  addressContainer: {
    paddingTop: 16,
    marginVertical: 20,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  iconWrapper: {
    alignItems: "center",
    marginRight: 5,
    position: "relative",
  },
  verticalLine: {
    position: "absolute",
    top: 18,
    left: 8.5,
    width: 1.5,
    height: "100%",
    borderWidth: 1.2,
    borderColor: colors.mutedForeground,
    borderStyle: "dashed",
  },
  textContainer: {
    flex: 1,
  },
  address: {
    fontSize: s(11),
    fontWeight: "500",
    lineHeight: 25,
  },
});

export default RiderDeliveryDetails;
