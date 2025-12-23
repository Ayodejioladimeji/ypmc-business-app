import React, { useContext, useEffect, useRef, useState } from "react";
import MapView, { Marker } from "react-native-maps";
import { StyleSheet, View } from "react-native";
import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { formatMoney } from "@/utils/utils";
import { DataContext } from "@/store/GlobalState";
import { s } from "react-native-size-matters";
import { colors, spacing } from "@/theme";
import ShipmentIcon from "@/components/rider-components/shipment-icon";
import CustomMarker2 from "@/components/rider-components/CustomMarker2";
import CustomMarker from "@/components/rider-components/CustomMarker";
import MapViewDirections from "react-native-maps-directions";
import { ACTIONS } from "@/store/Actions";
import { Text } from "@/components/ui";
import TopNavigation from "@/components/TopNavigation";
import { SafeAreaView } from "react-native-safe-area-context";
import { Line } from "@/components/ui/line";
import RiderMarker from "@/components/rider-components/RiderMarker";
import NavigatorMarker from "@/components/rider-components/NavigatorMarker";
import RiderNavigatorMarker from "@/components/rider-components/RiderNavigatorMarker";


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
  const { order, rider } = state
  const [pickupLocation, setPickupLocation] = useState<any>(null)
  const [dropoffLocation, setDropoffLocation] = useState<any>(null)
  const [riderLocation, setRiderLocation] = useState<any>(null)

console.log(order)

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
        const riderCoord = { latitude: parseFloat(rider.riderCoordinate.latitude), longitude: parseFloat(rider.riderCoordinate.longitude) };

        setPickupLocation(pickupCoord);
        setDropoffLocation(dropoffCoord);
        setRiderLocation(riderCoord);
      }
    })();
  }, []);

  useEffect(() => {
    if (pickupLocation) {
      mapRef.current?.animateToRegion({
        latitude: parseFloat(order?.pickupLatitude) || 0,
        longitude: parseFloat(order?.pickupLongitude) || 0,
        latitudeDelta: 0.0122,
        longitudeDelta: 0.0121,
      });
    }
  }, [pickupLocation]);


  // 

  return (
    <SafeAreaView style={{ position: 'relative', flex: 1 }}>
      <TopNavigation title="Track" />
      <View style={{ position: 'relative', flex: 1 }}>

        {pickupLocation && dropoffLocation &&
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={mapRegion}
            userInterfaceStyle="light"
          >
            <CustomMarker2 coordinate={pickupLocation} />
            <CustomMarker coordinate={dropoffLocation} />
            <RiderNavigatorMarker coordinate={riderLocation} />

            <MapViewDirections
              origin={{
                latitude: pickupLocation?.latitude,
                longitude: pickupLocation?.longitude,
              }}
              destination={{
                latitude: dropoffLocation?.latitude,
                longitude: dropoffLocation?.longitude,
              }}
              waypoints={[{
                latitude: riderLocation?.latitude,
                longitude: riderLocation?.longitude,
              }]}

              precision="high"
              optimizeWaypoints={true}
              apikey={process.env.EXPO_PUBLIC_API_KEY || ""}
              strokeWidth={3}
              strokeColor="#F97216"
              onError={(errorMessage) => {
                console.warn("MapViewDirections error:", errorMessage);
              }}
            />

          </MapView>
        }



        <View style={styles.mainContainer}>
          <View style={styles.container}>
            <View style={styles.spaceBetween}>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
              >
                <ShipmentIcon status={order?.status} />

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
                  ₦{formatMoney(Number(order?.actualPriceInNaira) ||  0)}
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

                  <Text style={{ fontSize: 12 }}>{order?.distanceInKilometers?.toFixed(1)}km</Text>
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
          </View>
        </View>

      </View>
    </SafeAreaView>
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