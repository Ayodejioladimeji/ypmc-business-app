import React, { useCallback, useContext, useEffect, useRef, useState } from "react";

import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import { ActivityIndicator, Alert, Image, Linking, StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, ButtonText } from "../../components/ui/button";
import { AntDesign, Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Text } from "../../components/ui";
import { formatMoney } from "@/utils/utils";
import { DataContext } from "@/store/GlobalState";
import { GetRequest, PostRequest } from "@/utils/requests";
import { s } from "react-native-size-matters";
import { colors } from "@/theme";
import { CustomButton } from "@/components";
import images from "@/assets/images";
import { Line } from "@/components/ui/line";
import FullDetails from "@/components/rider-components/full-details";
import { BottomSheetModal, SCREEN_HEIGHT } from "@gorhom/bottom-sheet";
import { useSharedValue } from "react-native-reanimated";
import CustomMarker from "@/components/rider-components/CustomMarker";
import MapViewDirections from "react-native-maps-directions";
import { ACTIONS } from "@/store/Actions";
import { toast } from "sonner-native";
import ConfirmDelivery from "@/components/rider-components/confirm-delivery";
import DeliveryVerification from "@/components/rider-components/delivery-verification";
import NavigatorMarker from "@/components/rider-components/NavigatorMarker";
import { handleDial } from "@/helpers/dialNumber";
import UseChat from "./chat/_components/use-chat";
import DeliveryCodeModal from "@/components/ui/delivery-code-modal";
import CustomModal from "@/components/ui/modal";
import { PaymentPromptIcon } from "@/assets/images/svgs";


type Region = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

const data = Array.from({ length: 10 }).map((_, index) => ({
  id: String(index),
  title: `${index} `,
}));

const PickupOrder = () => {
  const [mapRegion, setMapRegion] = useState<Region | undefined>(undefined);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const mapRef = useRef<MapView | null>(null);
  const { state, dispatch } = useContext(DataContext)
  const { order, isArrived, riderLocation, currentLocation } = state
  const verificationRef = useRef<BottomSheetModal>(null);
  const confirmSheetRef = useRef<BottomSheetModal>(null);
  const infoSheetRef = useRef<BottomSheetModal>(null);
  const infoSheetIndex = useSharedValue<number>(0);
  const infoSheetPosition = useSharedValue<number>(SCREEN_HEIGHT);
  const [pickupLocation, setPickupLocation] = useState<any>(null)
  const [dropoffLocation, setDropoffLocation] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [deliveryCodeModal, setDeliveryCodeModal] = useState(false)
  const [arriveLoading, setArriveLoading] = useState(false)
  const [promptModal, setPromptModal] = useState(false)
  const [isPaid, setIsPaid] = useState(false)
  const [refreshLoading, setRefreshLoading] = useState(false)
  const [notifyLoading, setNotifyLoading] = useState(false)


  // check if the customer has paid
  const getDelivery = async () => {
    const res = await GetRequest(`/shipping/rider/${order?.id}`, state?.token)
    if (res?.status === 200 || res?.status === 201) {
      setIsPaid(res?.data?.data?.isPaid)
    }
    setLoading(false)
  }

  useEffect(() => {
    if (state?.token) {
      getDelivery()
    }
  }, [state?.token, state?.message])


  useEffect(() => {
    (async () => {
      setMapRegion({
        latitude: riderLocation?.latitude || 0,
        longitude: riderLocation?.longitude || 0,
        latitudeDelta: 0.0122,
        longitudeDelta: 0.0121,
      });

      if (order?.pickupLatitude && order?.pickupLongitude && order?.dropoffLatitude && order?.dropoffLongitude) {
        const pickupCoord = { latitude: parseFloat(order.pickupLatitude), longitude: parseFloat(order.pickupLongitude) };
        const dropoffCoord = { latitude: parseFloat(order.dropoffLatitude), longitude: parseFloat(order.dropoffLongitude) };

        setPickupLocation(pickupCoord);
        setDropoffLocation(dropoffCoord);

        // setTimeout(() => {
        //   setLoading(false)
        // }, 2000)
      }
    })();
  }, []);

  useEffect(() => {
    if (riderLocation && mapRegion) {
      mapRef.current?.animateToRegion({
        latitude: riderLocation?.latitude || 0,
        longitude: riderLocation?.longitude || 0,
        latitudeDelta: 0.0122,
        longitudeDelta: 0.0121,
      });
    }
  }, [riderLocation, mapRegion]);

  const confirmOrder = () => {
    if (!isPaid) {
      setPromptModal(true)
    }
    else {
      setDeliveryCodeModal(true)
    }
  }

  const handleNotify = async () => {
    setArriveLoading(true)
    const payload = {
      locationType: "DROPOFF"
    }

    const res = await PostRequest(`/shipping/${order?.id}/notify-arrival`, payload, state?.token)
    if (res?.status === 200 || res?.status === 201) {
      dispatch({ type: ACTIONS.IS_ARRIVED, payload: true })
      toast.success(res?.data?.message)
    }
    setArriveLoading(false)

    setTimeout(() => {
      dispatch({ type: ACTIONS.IS_ARRIVED, payload: false })
    }, 200000)
  }

  const paymentNotification = async () => {
    setNotifyLoading(true)

    const payload = {
      shippingId: order?.id
    }
    const res = await PostRequest(`/shipping/rider/send-payment-reminder`, payload, state?.token)
    if (res?.status === 200 || res?.status === 201) {
      toast.success(res?.data?.message)
    }
    setNotifyLoading(false)
  }

  const refreshPayment = async () => {
    setRefreshLoading(true)
    await getDelivery()
    setRefreshLoading(false)
  }

  // 

  return (
    <View style={{ position: 'relative', flex: 1 }}>
      <UseChat shippingId={order?.id} />

      {riderLocation && dropoffLocation &&
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={mapRegion}
          userInterfaceStyle="light"
        >

          <CustomMarker coordinate={dropoffLocation} />
          <NavigatorMarker coordinate={riderLocation} />

          <MapViewDirections
            origin={{
              latitude: riderLocation?.latitude || 0,
              longitude: riderLocation?.longitude || 0,
            }}
            destination={{
              latitude: dropoffLocation?.latitude || 0,
              longitude: dropoffLocation?.longitude || 0,
            }}
            precision="high"
            optimizeWaypoints={true}
            apikey={process.env.EXPO_PUBLIC_API_KEY || ""}
            strokeWidth={3}
            strokeColor="#F97216"
            // lineDashPattern={[7]}
            onError={(errorMessage: any) => {
              // Alert.alert(
              //   'Error',
              //   `MapViewDirections Error: ${errorMessage}`,
              // );
            }}
          />
        </MapView>}

      <View style={styles.mainContainer}>
        <View style={styles.container}>

          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5, gap: 3 }}>
              <MaterialIcons name="circle" size={15} color="green" />
              <Text style={{ fontSize: s(11), color: colors.mutedForeground }}>Delivery Location</Text>
            </View>
            <Text style={[styles.address, { paddingBottom: 20, fontSize: s(12) }]}>
              {order?.pickupStreet} {order?.pickupState}
            </Text>
          </View>

          {/* sender information */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 15, justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
              <Image source={images.user} alt="" style={{ height: 35, width: 35, borderWidth: 1, borderRadius: 50 }} />
              <View>
                <Text style={{ fontSize: s(11), color: colors.mutedForeground, marginBottom: 5 }}>Receiver's info</Text>
                <Text style={{ fontSize: s(12) }}>{order?.receiverInfo.name}</Text>
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                gap: 10,
                alignItems: 'center',
              }}
            >
              <TouchableOpacity onPress={() => handleDial(order?.receiverInfo?.contactInfo?.phoneNumber)}
                style={{ height: 45, width: 45, borderRadius: 50, borderWidth: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons
                  name="call-outline"
                  size={20}
                />
              </TouchableOpacity>
            </View>
          </View>

          <Line />

          <TouchableOpacity onPress={() => infoSheetRef.current?.present()} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 20 }}>
            <Text style={{ fontSize: s(13) }}>View Shipment Details</Text>

            <Feather name="chevron-up" size={24} color="black" />
          </TouchableOpacity>

          <Line />

          <View
            style={{ flexDirection: "row", gap: 40, paddingVertical: 20 }}
          >
            {!isArrived ? <CustomButton
              title="I Have Arrived"
              onPress={handleNotify}
              style={{
                flex: 1,
                paddingVertical: 20,
                borderRadius: 50,
                backgroundColor: '#fff',
                borderWidth: 1,
                borderColor: colors.mutedForeground,
              }}
              textVariant="secondary"
              icon={arriveLoading && <ActivityIndicator />}
            // disabled={loading}
            />
              :

              <CustomButton
                title="Confirm Delivery"
                onPress={() => confirmSheetRef.current?.present()}
                style={{
                  flex: 1,
                  paddingVertical: 20,
                  borderRadius: 50
                }}
              />}
          </View>
        </View>

      </View>

      <FullDetails
        ref={infoSheetRef}
        index={infoSheetIndex}
        position={infoSheetPosition} />

      <ConfirmDelivery
        ref={confirmSheetRef}
        confirmOrder={confirmOrder}
      />

      {deliveryCodeModal && 
      <DeliveryCodeModal
        visible={deliveryCodeModal}
        onClose={() =>
          setDeliveryCodeModal(false)
        }
      >
        <DeliveryVerification />
      </DeliveryCodeModal>}

      {promptModal &&
        <CustomModal
          visible={promptModal}
          onClose={() => setPromptModal(false)}
        >
          <View style={{ alignItems: 'center' }}>
            <PaymentPromptIcon />

            {!isPaid ?
              <>
                <Text style={styles.modalTitle}>Payment Required Before Completion</Text>
                <Text style={styles.modalDescription}>
                  You can’t complete this delivery until the customer makes the payment.
                </Text>
              </>
              :
              <>
                <Text style={styles.modalTitle}>Payment Successful</Text>
                <Text style={styles.modalDescription}>
                  Customer has successfully completed the payment, You can proceed to deliver the order.
                </Text>
              </>}

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20, marginTop: 50 }}>
              {!isPaid ?
                <Button
                  onPress={paymentNotification}
                  size="sm" style={{ flex: 1, backgroundColor: 'black' }}>
                  <ButtonText>Send Payment Reminder</ButtonText>
                  {notifyLoading && <ActivityIndicator color="white" />}
                </Button>
                :
                <Button
                  onPress={() => setPromptModal(false)}
                  size="sm" style={{ flex: 1, backgroundColor: 'black' }}>
                  <ButtonText>Close</ButtonText>
                </Button>
              }
            </View>

            <TouchableOpacity onPress={refreshPayment} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, marginTop: 20 }}>
              <Text style={[styles.modalDescription, { color: 'red', textDecorationLine: 'underline', textDecorationColor: 'red', marginTop: 0 }]}>
                Refresh payment
              </Text>

              {refreshLoading && <ActivityIndicator color="red" />}
            </TouchableOpacity>
          </View>
        </CustomModal>}
    </View >
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    paddingHorizontal: 15,
    paddingVertical: 20,
    borderRadius: 20,
    position: 'absolute',
    bottom: 0,
    width: '100%'
  },
  container: {
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 20,
    borderRadius: 20,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
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
    alignItems: "flex-start"
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
    lineHeight: 25,
  },
  modalTitle: {
    fontSize: 16,
    fontFamily: "interSemiBold",
    textAlign: "center",
    marginTop: 20
  },
  modalDescription: {
    marginTop: 20,
    color: "#636363",
    fontSize: 14,
    fontFamily: "interRegular",
    textAlign: "center",
  },
})

export default PickupOrder