import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import MapView, { Marker } from "react-native-maps";
import { s } from "react-native-size-matters";
import { toast } from "sonner-native";

import { order } from "@/constants/shipment-order";
import { ACTIONS } from "@/store/Actions";
import { DataContext } from "@/store/GlobalState";
import { colors } from "@/theme";
import { GetRequest, PostRequest } from "@/utils/requests";
import { formatMoney } from "@/utils/utils";

import AddressList from "../addresslist";
import { CustomButton } from "../CustomButton";
import { Text } from "../ui";
import { Button, ButtonText } from "../ui/button";
import CustomModal from "../ui/modal";
import ShipmentModal from "../ui/shipment-modal";
import { RiderBottomSheet } from "./RiderBottomSheet";
import ShipmentIcon from "./shipment-icon";
import SuccessModal from "./success-modal";
import { Line } from "../ui/line";
import RiderMarker from "./RiderMarker";
import NavigatorMarker from "./NavigatorMarker";

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

export const RiderMap = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [mapRegion, setMapRegion] = useState<Region | undefined>(undefined);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const mapRef = useRef<MapView | null>(null);


  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      // let location = await Location.getCurrentPositionAsync({});
      // setLocation(null);

      // setMapRegion({
      //   latitude: location.coords.latitude,
      //   longitude: location.coords.longitude,
      //   latitudeDelta: 0.0122,
      //   longitudeDelta: 0.0121,
      // });
    })();
  }, []);

  useEffect(() => {
    if (location) {
      mapRef.current?.animateToRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0122,
        longitudeDelta: 0.0121,
      });
    }
  }, [location]);


  //

  return (
    <>
      {location && (
        <MapView
          ref={mapRef}
          style={{ flex: 1 }}
          initialRegion={mapRegion}
          userInterfaceStyle="light"
        >
          <NavigatorMarker coordinate={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          }}/>

        </MapView>
      )}

      <RiderBottomSheet />

    </>
  );
};


