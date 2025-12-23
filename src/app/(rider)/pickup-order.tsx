import React, { useContext, useEffect, useRef, useState } from "react";

import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import { ActivityIndicator, Alert, Image, Linking, StyleSheet, TouchableOpacity, View } from "react-native";
import { Button } from "../../components/ui/button";
import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Text } from "../../components/ui";
import { formatMoney } from "@/utils/utils";
import { DataContext } from "@/store/GlobalState";
import { PostRequest } from "@/utils/requests";
import { s } from "react-native-size-matters";
import { colors, spacing } from "@/theme";
import ShipmentIcon from "@/components/rider-components/shipment-icon";
import { CustomButton } from "@/components";
import images from "@/assets/images";
import { Line } from "@/components/ui/line";
import FullDetails from "@/components/rider-components/full-details";
import { BottomSheetModal, SCREEN_HEIGHT } from "@gorhom/bottom-sheet";
import { useSharedValue } from "react-native-reanimated";
import CustomMarker2 from "@/components/rider-components/CustomMarker2";
import CustomMarker from "@/components/rider-components/CustomMarker";
import MapViewDirections from "react-native-maps-directions";
import { ACTIONS } from "@/store/Actions";
import { toast } from "sonner-native";
import ConfirmPickup from "@/components/rider-components/confirm-pickup";
import RiderMarker from "@/components/rider-components/RiderMarker";
import NavigatorMarker from "@/components/rider-components/NavigatorMarker";
import CustomMarker3 from "@/components/rider-components/CustomMarker3";
import { current } from "@reduxjs/toolkit";
import { handleDial } from "@/helpers/dialNumber";
import UseChat from "./chat/_components/use-chat";
import { useRouter } from "expo-router";


type Region = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};


const PickupOrder = () => {
  const [mapRegion, setMapRegion] = useState<Region | undefined>(undefined);
  const mapRef = useRef<MapView | null>(null);
  const { state, dispatch } = useContext(DataContext)
  const { order, isArrived, riderLocation, currentLocation } = state
  const confirmSheetRef = useRef<BottomSheetModal>(null);
  const infoSheetRef = useRef<BottomSheetModal>(null);
  const infoSheetIndex = useSharedValue<number>(0);
  const infoSheetPosition = useSharedValue<number>(SCREEN_HEIGHT);
  const [pickupLocation, setPickupLocation] = useState<any>(null)
  const [dropoffLocation, setDropoffLocation] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const [arriveLoading, setArriveLoading] = useState(false)


  useEffect(() => {
    (async () => {
      setMapRegion({
        latitude: riderLocation?.latitude|| 0,
        longitude: riderLocation?.longitude|| 0,
        latitudeDelta: 0.0122,
        longitudeDelta: 0.0121,
      });

      if (order?.pickupLatitude && order?.pickupLongitude && order?.dropoffLatitude && order?.dropoffLongitude) {
        const pickupCoord = { latitude: parseFloat(order?.pickupLatitude), longitude: parseFloat(order?.pickupLongitude) };
        const dropoffCoord = { latitude: parseFloat(order?.dropoffLatitude), longitude: parseFloat(order?.dropoffLongitude) };

        setPickupLocation(pickupCoord);
        setDropoffLocation(dropoffCoord);

        setTimeout(() => {
          setLoading(false)
        }, 2000)
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


  const handleNotify = async () => {
    setArriveLoading(true)
    const payload = {
      locationType: "PICKUP"
    }
    const res = await PostRequest(`/shipping/${order?.id}/notify-arrival`, payload, state?.token)
    if (res?.status === 200 || res?.status === 201) {
      dispatch({ type: ACTIONS.IS_ARRIVED, payload: true })
      toast.success(res?.data?.message)
    }
    setArriveLoading(false)

    setTimeout(() => {
      dispatch({ type: ACTIONS.IS_ARRIVED, payload: false })
    }, 20000)
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
              <MaterialIcons name="circle" size={15} color="#FF5E00" />
              <Text style={{ fontSize: s(11), color: colors.mutedForeground }}>Pickup Location</Text>
            </View>
            <Text style={[styles.address, { paddingBottom: 20, fontSize: s(12) }]}>
              {order?.pickupStreet} {order?.pickupState}
            </Text>
          </View>

          {/* sender information */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 15, justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
              <Image source={images?.user} alt="" style={{ height: 35, width: 35, borderWidth:1, borderRadius:50 }} />
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
                style={{ height: 45, width: 45, borderRadius: 50, borderWidth:1, alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons
                  name="call-outline"
                  size={20}
                />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => router.push(`/(rider)/chat/${order?.id}`)} 
              style={{ height: 45, width: 45, borderRadius: 50, alignItems: 'center', justifyContent: 'center', backgroundColor:'black' }}>
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
                title="Confirm Pickup"
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

      <ConfirmPickup
        ref={confirmSheetRef} />
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