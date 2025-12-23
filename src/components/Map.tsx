import { useEffect, useRef, useState } from "react";
import { Alert, Dimensions, Image, StyleSheet } from "react-native";

import * as ExpoLocation from "expo-location";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";

import { GOOGLE_MAPS_API_KEY } from "@/api/maps";
import { detailedMapStyle } from "@/constants/maps-theme";
import { useGetCurrentLocation } from "@/hooks/useGetCurrentLocation";
import {
  LATITUDE_DELTA,
  LONGITUDE_DELTA,
  windowHeight,
  windowWidth,
} from "@/lib/helper";

type Coordinates = {
  latitude: number;
  longitude: number;
};

interface AppMapProps {
  showDirections?: boolean;
  showParcel?: boolean;
  showOrigin?: boolean;
  showDestination?: boolean;
  showUserLocation?: boolean;
  origin?: Coordinates;
  destination?: Coordinates;
  parcel?: Coordinates;
  userLocation?: Coordinates;
}

// Add type for MapViewDirections result
type DirectionsResult = {
  coordinates: Coordinates[];
  distance: number;
  duration: number;
  fare: any;
  waypointOrder: number[];
};

export const AppMap = ({
  showDirections,
  origin,
  destination,
  parcel,
  showParcel,
  showOrigin,
  showUserLocation,
  showDestination,
  userLocation,
}: AppMapProps) => {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const mapRef = useRef<MapView>(null);

  const onReady = (result: DirectionsResult) => {
    if (mapRef.current && result?.coordinates) {
      mapRef.current.fitToCoordinates(result.coordinates, {
        edgePadding: {
          right: windowWidth / 25,
          bottom: windowHeight / 25,
          left: windowWidth / 25,
          top: windowHeight / 25,
        },
        animated: true,
      });
    }
  };

  useEffect(() => {
    let locationSubscription: ExpoLocation.LocationSubscription | null = null;

    const setupLocation = async () => {
      try {
        // First, request location permissions
        const { status } =
          await ExpoLocation.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          Alert.alert(
            "Permission Denied",
            "Location permission is required to show your current location."
          );
          return;
        }

        // Get initial location
        const initialLocation = await ExpoLocation.getCurrentPositionAsync({
          accuracy: ExpoLocation.Accuracy.High,
        });

        setCoordinates({
          latitude: initialLocation.coords.latitude,
          longitude: initialLocation.coords.longitude,
        });

        // Start watching position
        locationSubscription = await ExpoLocation.watchPositionAsync(
          {
            accuracy: ExpoLocation.Accuracy.High,
            timeInterval: 1000,
            distanceInterval: 1,
          },
          (location) => {
            setCoordinates({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            });

            // Optionally animate to new position
            mapRef.current?.animateToRegion({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA,
            });
          }
        );
      } catch (error) {
        Alert.alert(
          "Error",
          "Failed to get location. Please check your device settings."
        );
      }
    };

    setupLocation();

    // Cleanup
    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, []);

  if (!coordinates) {
    return null; // Or a loading component
  }

  return (
    <>
    { showUserLocation && coordinates &&


    <MapView
      style={stylesMap.map}
      provider={PROVIDER_GOOGLE}
      initialRegion={{
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      }}
      ref={mapRef}
      customMapStyle={detailedMapStyle}
      showsUserLocation={showUserLocation}
      showsMyLocationButton={true}
      showsCompass={true}
    >
      {showUserLocation && coordinates && (
        <Marker
          coordinate={{
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,
          }}
        >
          <Image
            source={require("@/assets/images/marker-pin-4x.png")}
            resizeMode="contain"
            style={{ height: 52, width: 52 }}
          />
        </Marker>
      )}
      {showDirections && origin && destination && (
        <MapViewDirections
          origin={{
            latitude: origin.latitude,
            longitude: origin.longitude,
          }}
          destination={{
            longitude: destination.longitude,
            latitude: destination.latitude,
          }}
          apikey={GOOGLE_MAPS_API_KEY}
          strokeColors={["#181F18", "#16A34A"]}
          lineDashPattern={[3, 3]}
          strokeWidth={4}
          optimizeWaypoints={true}
          onReady={onReady}
          language="en"
          precision="low"
          resetOnChange={true}
          mode="DRIVING"
          region="NG"
        />
      )}
    </MapView>
    }
    </>
  );
};

const stylesMap = StyleSheet.create({
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});