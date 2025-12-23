import React, { Fragment, useContext, useEffect, useState } from "react";
import { FlatList, RefreshControl, SafeAreaView, StyleSheet, TouchableOpacity, View, ActivityIndicator, ScrollView, Platform } from "react-native";

import { CustomButton, Layout, Tabs } from "@/components";
import TopNavigation from "@/components/TopNavigation";
import { DataContext } from "@/store/GlobalState";
import { GetRequest, PostRequest } from "@/utils/requests";
import { EmptyShipmentList } from "@/components/rider-components";
import { Text } from "@/components/ui";
import { colors } from "@/theme";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { formatMoney } from "@/utils/utils";
import ShipmentIcon from "@/components/rider-components/shipment-icon";
import { useRouter } from "expo-router";
import { toast } from "sonner-native";
import { s } from "react-native-size-matters";
import { Button, ButtonText } from "@/components/ui/button";
import CustomModal from "@/components/ui/modal";
import { ACTIONS } from "@/store/Actions";
import { Divider, Line, Ruler } from "@/components/ui/line";

export interface RiderProps {
  allRiders?: any;
  activeRiders?: any;
  pendingRequests?: any;
  isLoading: boolean;
  refetch: () => void;
}

const tabs = ["All", "Scheduled"];

const RiderDeliveries = () => {
  const [data, setData] = useState<any>([])
  const { state, dispatch } = useContext(DataContext)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = React.useState(false);
  const [rejectLoading, setRejectLoading] = useState(false)
  const [acceptLoading, setAcceptLoading] = useState(false)
  const router = useRouter()
  const [confirmModal, setConfirmModal] = useState(false);
  const [orderId, setOrderId] = useState("")
  const [callback, setCallback] = useState(false)
  const [shippingType, setShippingType] = useState("")


  // get all rider deliveries
  useEffect(() => {
    if (state?.token) {
      getAllDeliveries(state?.token)
    }
  }, [state?.token, callback, state?.message])

  // get all deliveries
  const getAllDeliveries = async (token: string) => {
    const res = await GetRequest(`/shipping/rider/available-orders`, token)
    if (res?.status === 200 || res?.status === 201) {
      setData(res?.data?.data?.orders);
      setLoading(false);

    }
  }

  const onRefresh = React.useCallback(() => {
    getAllDeliveries(state?.token)
    setRefreshing(true);

    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, [refreshing]);


  // handle accept
  const handleAccept = async (item: any) => {
    setOrderId(item?.id)
    setAcceptLoading(true)

    const payload = {
      data: ""
    }

    let res: any;

    if (item.type === "single") {
      res = await PostRequest(`/shipping/rider/available-orders/${item.id}/accept?type=single`, payload, state?.token)
    }
    else {
      res = await PostRequest(`/shipping/rider/available-orders/${item.id}/accept?type=multi`, payload, state?.token)
    }

    if (res?.status === 200 || res?.status === 201) {
      
      if (item?.type === "single") {
        dispatch({ type: ACTIONS.ORDER, payload: res?.data?.data})
        setCallback(!callback)
        router.push("/(rider)/start-order");
      }
      
      if(item?.type === "multi"){
        router.push("/(rider)/rider-deliveries");
      }
    }
    dispatch({ type: ACTIONS.ORDER_MODAL, payload: false });
    setAcceptLoading(false)
  };



  // 
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white', paddingTop: 40 }}>
      <TopNavigation title="Assigned Shippings" />

      <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 20 }}>
        {loading ? (
          <ActivityIndicator size="small" />
        ) : (
          <FlatList
            data={data}
            keyExtractor={(order) => order.id}
            renderItem={({ item }) => (
              <View style={styles.container}>

                {item.type === "single" ?
                  <>
                    <View style={styles.spaceBetween}>
                      <View
                        style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
                      >
                        <ShipmentIcon status={item?.status} />

                        <Text style={{ fontSize: s(12), fontFamily: "interBold", width: "73%" }}>
                          {item?.packageDetails.name}
                        </Text>
                      </View>

                      <View
                        style={{
                          position: "absolute",
                          top: 7,
                          right: 0,
                          justifyContent: "flex-end",
                          alignItems: "flex-end",
                        }}
                      >
                        <Text style={{ fontSize: s(13), fontFamily: "interMedium" }}>
                          ₦{formatMoney(Number(item?.estimatedPriceInNaira) || 0)}
                        </Text>

                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                          <Ionicons name="location" size={12} style={{ color: "#636363" }} />
                          <Text style={{ fontSize: 12 }}>{item?.distanceInKilometers.toFixed(1) || 0} km</Text>
                        </View>
                      </View>
                    </View>

                    <View style={styles.addressContainer}>
                      <View style={styles.rowContainer}>
                        <View style={styles.iconWrapper}>
                          <MaterialIcons name="circle" size={17} color="#FF5E00" />
                          <View style={styles.verticalLine} />
                        </View>

                        <View style={styles.textContainer}>
                          <Text style={{ fontSize: s(11) }}>Pickup</Text>
                          <Text style={[styles.address, { paddingBottom: 20 }]}>
                            {item?.pickupStreet} {item?.pickupState}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.rowContainer}>
                        <View style={styles.iconWrapper}>
                          <MaterialIcons name="place" size={21} color="#4CAF50" />
                        </View>

                        <View style={styles.textContainer}>
                          <Text style={{ fontSize: s(11) }}>Delivery</Text>
                          <Text style={styles.address}>
                            {item?.dropoffStreet} {item?.dropoffState}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </>
                : 

                <>
                   {item.shippings?.map(((shipping, index:number) => (
                     <View key={index}>
                       <View style={styles.spaceBetween}>
                         <View
                           style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
                         >
                           <ShipmentIcon status={shipping?.status} />

                           <Text style={{ fontSize: s(12), fontFamily: "interBold", width: "73%" }}>
                             {shipping?.packageDetails.name}
                           </Text>
                         </View>

                         <View
                           style={{
                             position: "absolute",
                             top: 7,
                             right: 0,
                             justifyContent: "flex-end",
                             alignItems: "flex-end",
                           }}
                         >
                           <Text style={{ fontSize: s(13), fontFamily: "interMedium" }}>
                             ₦{formatMoney(Number(shipping?.estimatedPriceInNaira) || 0)}
                           </Text>

                           <View style={{ flexDirection: "row", alignItems: "center" }}>
                             <Ionicons name="location" size={12} style={{ color: "#636363" }} />
                             <Text style={{ fontSize: 12 }}>{shipping?.distanceInKilometers?.toFixed(1) || 0} km</Text>
                           </View>
                         </View>
                       </View>

                       <View style={styles.addressContainer}>
                         <View style={styles.rowContainer}>
                           <View style={styles.iconWrapper}>
                             <MaterialIcons name="circle" size={17} color="#FF5E00" />
                             <View style={styles.verticalLine} />
                           </View>

                           <View style={styles.textContainer}>
                             <Text style={{ fontSize: s(11) }}>Pickup</Text>
                             <Text style={[styles.address, { paddingBottom: 20 }]}>
                               {shipping?.pickupStreet} {shipping?.pickupState}
                             </Text>
                           </View>
                         </View>

                         <View style={styles.rowContainer}>
                           <View style={styles.iconWrapper}>
                             <MaterialIcons name="place" size={21} color="#4CAF50" />
                           </View>

                           <View style={styles.textContainer}>
                             <Text style={{ fontSize: s(11) }}>Delivery</Text>
                             <Text style={styles.address}>
                               {shipping?.dropoffStreet} {shipping?.dropoffState}
                             </Text>
                           </View>
                         </View>
                       </View>

                       {index !== item.shippings.length - 1 && <Divider />}
                     </View>
                   )))}
                </>
              }

                <CustomButton
                  title={item.type === "single" ? "Accept Order" : `Accept Orders (multiple +${item.shippingCount})`}
                  onPress={() => handleAccept(item)}
                  icon={
                    acceptLoading && item.id === orderId ? (
                      <ActivityIndicator color="#fff" size="small" />
                    ) : (
                      <Ionicons name="checkmark" size={24} style={{ color: "#fff" }} />
                    )
                  }
                  style={{
                    flex: 1,
                    paddingVertical: 10,
                    borderRadius: 50,
                    backgroundColor: colors.primary,
                    height: 50,
                    marginTop: 20
                  }}
                />
              </View>
            )}
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            ListEmptyComponent={<EmptyShipmentList message="No deliveries yet. Stay ready!" />}
            contentContainerStyle={{ paddingBottom: 200 }}
          />
        )}
      </View>

      {/* Confirmation modal */}
      {confirmModal && (
        <CustomModal visible={confirmModal} onClose={() => setConfirmModal(false)}>
          <View style={{ paddingHorizontal: 10 }}>
            <Text style={styles.modalTitle}>New Order Alert?</Text>
            <Text style={styles.modalDescription}>
              Click on view details to see more info on this order
            </Text>

            <View style={{ marginTop: 50 }}>
              <Button onPress={handleAccept} size="sm" style={{ backgroundColor: "#E73323" }}>
                <ButtonText>View details</ButtonText>
              </Button>

              <Button
                variant="outline"
                style={{ marginTop: 10, borderRadius: 25, paddingVertical: 15 }}
                onPress={() => setConfirmModal(false)}
              >
                <ButtonText>Cancel</ButtonText>
              </Button>
            </View>
          </View>
        </CustomModal>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F3F3F380",
    paddingHorizontal: 15,
    paddingVertical: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 20,
  },
  spaceBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  addressContainer: {
    paddingTop: 16,
    marginTop: 10,
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
    marginTop: -5,
  },
  address: {
    fontSize: s(11),
    fontWeight: "500",
    lineHeight: 25,
  },
  modalTitle: {
    fontSize: 16,
    fontFamily: "interSemiBold",
    textAlign: "center",
  },
  modalDescription: {
    marginTop: 20,
    color: "#636363",
    fontSize: 14,
    fontFamily: "interRegular",
    textAlign: "center",
  },
});


export default RiderDeliveries;
