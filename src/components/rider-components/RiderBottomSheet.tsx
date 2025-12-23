import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { ActivityIndicator, AppState, Platform, Pressable, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { RiderAvatar } from "./RiderAvatar";
import { GetRequest, PatchRequest, PostRequest } from "@/utils/requests";
import { DataContext } from "@/store/GlobalState";
import { toast } from "sonner-native";
import { ACTIONS } from "@/store/Actions";
import { RiderStats } from "./RiderStats";
import OngoingShipment from "./ongoing-shipment";
import { VerifyIdCard } from "./VerifyIdCard";
import { colors } from "@/theme";
import { s } from "react-native-size-matters";
import SuccessModal from "./success-modal";
import { Button, ButtonText } from "../ui/button";
import CustomModal from "../ui/modal";
import { useFocusEffect, useRouter } from "expo-router";
import { formatMoney } from "@/utils/utils";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import ShipmentModal from "../ui/shipment-modal";
import ShipmentIcon from "./shipment-icon";
import { CustomButton } from "../CustomButton";
import AppUpdates from "../app-updates";
import DeviceInfo from 'react-native-device-info';
import { SubscriptionIcon } from "@/assets/images/svgs";
import { SafeAreaView } from "react-native-safe-area-context";
import { SvgXml } from "react-native-svg";
import { emptyShipment } from "@/assets/svgs";

// 

export const RiderBottomSheet = () => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { state, dispatch } = useContext(DataContext);
  const { user, profileLoading } = state;
  const [metrics, setMetrics] = useState<any>(null);
  const [isEnabled, setIsEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isToggling, setIsToggling] = useState(false);
  const [ongoingData, setOngoingData] = useState<any>(null)
  const { orderModal, delivered } = state;
  const [confirmModal, setConfirmModal] = useState(false);
  const router = useRouter();
  const [rejectLoading, setRejectLoading] = useState(false);
  const [order, setOrder] = useState<any>(null);
  const [orderLoading, setOrderLoading] = useState(true);
  const [shippingType, setShippingType] = useState("")
  const [userData, setUserData] = useState<any>(null)
  const [buttonLoading, setButtonLoading] = useState(false)
  const [toggleLoading, setToggleLoading] = useState(true)
  const appVersion = DeviceInfo.getVersion();
  const [version, setVersion] = useState()
  const appState = useRef(AppState.currentState);
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [ongoingLoading, setOngoingLoading] = useState(true)


  const getVersion = async () => {

    const res = await GetRequest('/app-versions', state?.token);
    if (res?.status === 200 || res?.status === 201) {

      const ios = res?.data?.data?.find(item => item?.platform === "iosBusiness")
      const android = res?.data?.data?.find(item => item?.platform === "androidBusiness")

      if (
        Platform.OS === 'android' &&
        android?.versionNumber !== appVersion
      ) {
        setVersion(android.versionNumber)
        setIsModalVisible(true);
        console.log(appVersion, android?.versionNumber)
      }

      if (
        Platform.OS === 'ios' &&
        ios?.versionNumber !== appVersion
      ) {
        setVersion(ios.versionNumber)
        setIsModalVisible(true);
        console.log(appVersion, ios?.versionNumber)
      }
    }

  };

  useEffect(() => {
    if (state?.token) {
      getVersion();
    }
  }, [state?.token]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        getVersion()
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [getVersion]);

  useEffect(() => {
    setIsEnabled(user?.status === "ACTIVE")
    setToggleLoading(false)
  }, [user?.status])


  const getAssignedOrder = useCallback(async () => {
    const res = await GetRequest(`/shipping/rider/available-orders`, state?.token);

    if (res?.status === 200 || res?.status === 201) {
      const result = Object.keys(res?.data?.data?.shipping || {}).length === 0;

      setShippingType(result ? "multiple" : 'basic')

      if (result) {
        setOrder(res?.data?.data?.multiShipping);
        if (res?.data?.data?.multiShipping?.shippings?.length > 0) {
          dispatch({ type: ACTIONS.ORDER_MODAL, payload: true });
        }
      }
      else {
        const shippingArray = Object.values(res?.data?.data?.shipping)
        setOrder(shippingArray);
        if (shippingArray?.length > 0) {
          dispatch({ type: ACTIONS.ORDER_MODAL, payload: true });
        }
      }

      setOrderLoading(false);

    }

  }, [state?.token]);

  // get assigned orders
  useEffect(() => {
    if (state?.token) {
      getAssignedOrder();
    }
  }, [state?.token, state?.callback, state?.message]);

  useEffect(() => {
    if (state?.token) {
      getAllDeliveries();
    }
  }, [state?.token, state?.callback]);

  // ongoing orders
  const getAllDeliveries = async () => {
    const res = await GetRequest(`/shipping/rider`, state?.token);
    if (res?.status === 200 || res?.status === 201) {
      const result = res?.data?.data?.filter(
        (item: any) =>
          (item.status === "IN_TRANSIT" || item?.status === "PICKED_UP") && item?.status !== 'CANCELLED'
      );
      setOngoingData(result)
    }
    setOngoingLoading(false);
  };

  // get Assigned orders when rider revisits the app
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {

        getAssignedOrder()
        getAllDeliveries()
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [getAssignedOrder]);



  // Fetch dashboard metrics
  useEffect(() => {
    if (state?.token) {
      const getMetrics = async () => {
        const res = await GetRequest("/rider/metrics", state?.token);
        if (res?.status === 200 || res?.status === 201) {
          setMetrics(res?.data?.data);
        }
        setLoading(false);
      };
      getMetrics();
    }
  }, [state?.token, state?.callback]);

  // handleRoute
  const handleRoute = async (id: string) => {
    setButtonLoading(true);

    const payload = {
      data: "",
    };

    let res: any;

    if (shippingType === "basic") {
      res = await PostRequest(`/shipping/${order[0]?.id}/accept-assignment`, payload, state?.token)
    }
    else {
      res = await PostRequest(`/shipping/${order[0]?.id}/accept-multipleShipping-assignment`, payload, state?.token)
    }

    if (res?.status === 200 || res?.status === 201) {
      dispatch({ type: ACTIONS.ORDER, payload: shippingType === "basic" ? res?.data?.data : res?.data?.data?.shippings[0] })
      if (shippingType === "basic") {
        router.push("/(rider)/start-order");
      }
      else {
        router.push("/(rider)/rider-deliveries");
      }
      dispatch({ type: ACTIONS.ORDER_MODAL, payload: false });
    }

    setButtonLoading(false);
    dispatch({ type: ACTIONS.INCOMING })
  };

  const mainOrder = shippingType === "multiple" ? order?.shippings : order

  // Handle toggle with backend sync
  const handleToggle = async () => {
    if (isToggling) return;
    setIsToggling(true);

    const newStatus = isEnabled ? "INACTIVE" : "ACTIVE";
    setIsEnabled((prev) => !prev);

    try {
      const res = await PatchRequest("/rider/status", { status: newStatus }, state?.token);

      if (res?.status === 200 || res?.status === 201) {
        dispatch({
          type: ACTIONS.USER,
          payload: {
            ...state.user,
            status: newStatus,
          },
        });
      }
    } catch (err) {
      console.error("Toggle error:", err);
      // Revert toggle on error
      setIsEnabled((prev) => !prev);
    } finally {
      setIsToggling(false);
    }
  };

  // 

  return (
    <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>
      <ScrollView
        style={{ flex: 1, paddingTop: 20, paddingHorizontal: 16, gap: 16, paddingBottom: 60, marginTop: 60, backgroundColor: colors.secondary }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ backgroundColor: 'white', paddingVertical: 20, paddingHorizontal: 10, borderRadius: 15 }}>

          {!user ? <ActivityIndicator style={{ marginVertical: 80 }} /> :
            <>
              <View style={{ width: '100%', flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>

                <RiderAvatar />

                {user?.metadata?.verificationStatus === "VERIFIED" && (
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {(isToggling || toggleLoading) && <ActivityIndicator style={{ marginRight: 10 }} />}

                    <Switch
                      value={isEnabled}
                      onValueChange={handleToggle}
                      disabled={isToggling}
                      trackColor={{ false: "#D3D3D3", true: "#f97216" }}
                      thumbColor="white"
                    />
                  </View>
                )}
              </View>

              {user?.metadata?.verificationStatus !== "VERIFIED" && (
                <VerifyIdCard />
              )}

              {user?.metadata?.verificationStatus === "VERIFIED" &&
                <RiderStats metrics={metrics} loading={loading} />
              }
            </>
          }

        </View>

        <OngoingShipment data={ongoingData} loading={ongoingLoading} />


        {/* delivery success modal */}
        <SuccessModal />

        {/* confirmation modal */}
        {orderModal && (
          <CustomModal
            visible={orderModal}
            onClose={() => dispatch({ type: ACTIONS.ORDER_MODAL, payload: false })}
          >
            <View style={{}}>
              <Text style={styles.modalTitle}>New Order Alert?</Text>
              <Text style={styles.modalDescription}>
                Click on view details to see more info on this order
              </Text>

              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20, marginTop: 30 }}>
                <Button
                  onPress={() => {
                    router.push("/(rider)/rider-shippings");
                    dispatch({ type: ACTIONS.ORDER_MODAL, payload: false });
                  }}
                  size="sm" style={{ flex: 1, backgroundColor: colors.primary }}>
                  <ButtonText>View order</ButtonText>
                </Button>

                <Button
                  variant="outline"
                  style={{ flex: 1, borderRadius: 25, paddingVertical: 15 }}
                  onPress={() => dispatch({ type: ACTIONS.ORDER_MODAL, payload: false })}
                >
                  <ButtonText>Cancel</ButtonText>
                </Button>
              </View>
            </View>
          </CustomModal>
        )}


        {/* {isModalVisible && <AppUpdates isModalVisible={isModalVisible} setIsModalVisible={setIsModalVisible} version={version} />} */}
      </ScrollView>
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
    borderColor: "#6363631A",
    // height:290
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
  titleContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: s(13),
    fontFamily: "interBold",
    flexShrink: 1,
    flexWrap: "wrap",
  },
  price: {
    fontSize: s(13),
    fontFamily: "interMedium",
    textAlign: "right",
    minWidth: 80,
  },
  distanceContainer: {
    position: "absolute",
    top: 20,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
    marginTop: -1,
  },
  address: {
    fontSize: s(11),
    fontWeight: "500",
    lineHeight: 25,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 40,
    marginTop: 20,
  },
  primaryButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 50,
    backgroundColor: colors.primary,
  },
  rejectButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 50,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.mutedForeground,
    alignItems: "center",
    justifyContent: "center",
  },
});