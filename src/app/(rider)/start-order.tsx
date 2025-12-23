import React, { useContext, useEffect, useRef, useState } from "react";
import MapView, { Marker } from "react-native-maps";
import { ActivityIndicator, Alert, Image, Linking, StyleSheet, TouchableOpacity, View } from "react-native";
import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Text } from "../../components/ui";
import { formatMoney } from "@/utils/utils";
import { DataContext } from "@/store/GlobalState";
import { PostRequest } from "@/utils/requests";
import { s } from "react-native-size-matters";
import { colors, spacing } from "@/theme";
import ShipmentIcon from "@/components/rider-components/shipment-icon";
import { CustomButton } from "@/components";
import CustomMarker2 from "@/components/rider-components/CustomMarker2";
import CustomMarker from "@/components/rider-components/CustomMarker";
import MapViewDirections from "react-native-maps-directions";
import { ACTIONS } from "@/store/Actions";
import { toast } from "sonner-native";
import { useRouter } from "expo-router";
import FullDetails from "@/components/rider-components/full-details";
import { BottomSheetModal, SCREEN_HEIGHT } from "@gorhom/bottom-sheet";
import { useSharedValue } from "react-native-reanimated";
import { Line } from "@/components/ui/line";
import UseChat from "./chat/_components/use-chat";
import { Button } from "@/components/ui/button";
import { handleDial } from "@/helpers/dialNumber";
import images from "@/assets/images";
import { SocketClient } from "@/components/rider-components/socket-client";
import { SubscriptionIcon } from "@/assets/images/svgs";
import RejectorderModal from "@/components/rider-components/modals/reject-order";


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
  const mapRef = useRef<MapView | null>(null);
  const { state, dispatch } = useContext(DataContext)
  const { order, shippingType } = state
  const [pickupLocation, setPickupLocation] = useState<any>(null)
  const [dropoffLocation, setDropoffLocation] = useState<any>(null)
  const [startLoading, setStartLoading] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const [confirmModal, setConfirmModal] = useState(false)

  const infoSheetRef = useRef<BottomSheetModal>(null);
  const infoSheetIndex = useSharedValue<number>(0);
  const infoSheetPosition = useSharedValue<number>(SCREEN_HEIGHT);


  useEffect(() => {
    (async () => {

      setMapRegion({
        latitude: parseFloat(order?.pickupLatitude) || 0,
        longitude: parseFloat(order?.pickupLongitude) || 0,
        latitudeDelta: 0.0122,
        longitudeDelta: 0.0121,
      });

      if (order?.pickupLatitude && order?.pickupLongitude && order?.dropoffLatitude && order?.dropoffLongitude) {
        const pickupCoord = { latitude: parseFloat(order.pickupLatitude), longitude: parseFloat(order.pickupLongitude) };
        const dropoffCoord = { latitude: parseFloat(order.dropoffLatitude), longitude: parseFloat(order.dropoffLongitude) };

        setPickupLocation(pickupCoord);
        setDropoffLocation(dropoffCoord);
      }
    })();
  }, []);

  useEffect(() => {
    if (pickupLocation) {
      setLoading(false)
      mapRef.current?.animateToRegion({
        latitude: parseFloat(order?.pickupLatitude) || 0,
        longitude: parseFloat(order?.pickupLongitude) || 0,
        latitudeDelta: 0.0122,
        longitudeDelta: 0.0121,
      });
    }
  }, [pickupLocation]);

  // start order
  const startOrder = async () => {
    setStartLoading(true)

    const payload = {
      data: ""
    }

    const res = await PostRequest(`/shipping/${order?.id}/start-ride`, payload, state?.token)
    if (res?.status === 200 || res?.status === 201) {
      toast.success(res?.data?.message)
      router.replace("/(rider)/pickup-order")
      dispatch({ type: ACTIONS.ORDER_STARTED, payload: true })
      dispatch({ type: ACTIONS.CALLBACK, payload: !state?.callback })
    }
    setStartLoading(false)
  }

  console.log("see order", order)

  // 

  return (
    <View style={{ position: 'relative', flex: 1 }}>
      <UseChat shippingId={order?.id} />
      <SocketClient />
      {pickupLocation && dropoffLocation &&
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={mapRegion}
          userInterfaceStyle="light"
        >
          <CustomMarker2 coordinate={pickupLocation} />
          <CustomMarker coordinate={dropoffLocation} />

          <MapViewDirections
            origin={{
              latitude: pickupLocation?.latitude,
              longitude: pickupLocation?.longitude,
            }}
            destination={{
              latitude: dropoffLocation?.latitude,
              longitude: dropoffLocation?.longitude,
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
          <View style={styles.spaceBetween}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              {order?.isSubscriptionOrder ?
                <SubscriptionIcon />
                :
                <ShipmentIcon status={order?.status} />
              }

              <Text style={{ fontSize: s(12), fontFamily: "interBold", width: '72%' }}>
                {order?.packageDetails?.name}
              </Text>
            </View>

            <View
              style={{
                position: "absolute",
                top: 5,
                right: 0,
              }}
            >
              <Text style={{ fontSize: s(13), fontFamily: "interMedium" }}>
                ₦{formatMoney(Number(order?.actualPriceInNaira) || 0)}
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  alignSelf: 'flex-end'
                }}
              >
                <Ionicons
                  name="location"
                  size={12}
                  style={{ color: "#636363" }}
                />

                <Text style={{ fontSize: 12 }}>{(order?.distanceInKilometers || 0).toFixed(1)}km</Text>
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
                <Text style={{ fontSize: s(11) }}>Delivery</Text>
                <Text style={styles.address}>
                  {order?.dropoffStreet} {order?.dropoffState}
                </Text>
              </View>
            </View>
          </View>

          <Line />

          {/* sender information */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 15, justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
              <Image source={images?.user} alt="" style={{ height: 35, width: 35 }} />
              <View>
                <Text style={{ fontSize: s(11), color: colors.mutedForeground, marginBottom: 5 }}>Sender's info</Text>
                <Text style={{ fontSize: s(12) }}>{order?.senderInfo?.name}</Text>
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                gap: 10,
                alignItems: 'center',
              }}
            >
              <TouchableOpacity onPress={() => handleDial(order?.senderInfo?.contactInfo?.phoneNumber)}
                style={{ height: 40, width: 40, borderRadius: 50, borderWidth: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons
                  name="call-outline"
                  size={20}
                />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => router.push(`/(rider)/chat/${order?.id}`)} style={{ backgroundColor: "black", height: 40, width: 40, borderRadius: 50, alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons
                  name="chatbox-outline"
                  size={20}
                  style={{ color: "#fff" }}
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
            style={{ gap: 20, paddingVertical: 20 }}
          >
            <CustomButton
              title="Start Pickup"
              onPress={startOrder}
              style={{
                flex: 1,
                paddingVertical: 20,
                borderRadius: 50
              }}
              icon={
                startLoading && <ActivityIndicator color="#fff" size="small" />
              }
            />

            <TouchableOpacity
              style={{
                flex: 1,
                paddingVertical: 20,
                borderRadius: 50,
                backgroundColor: 'transparent',
                borderWidth: 0.5,
                alignItems: 'center',
                borderColor: 'red'
              }}
              onPress={() => setConfirmModal(true)}
            >
              <Text style={{ color: 'red' }}>Cancel Order</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <FullDetails
        ref={infoSheetRef}
        index={infoSheetIndex}
        position={infoSheetPosition}
        startOrder={true}
      />

      {/* reject order modal */}
      {confirmModal &&
        <RejectorderModal
          confirmModal={confirmModal}
          setConfirmModal={setConfirmModal}
        />}
    </View>
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