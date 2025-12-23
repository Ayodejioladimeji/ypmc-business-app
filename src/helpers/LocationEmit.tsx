import { ACTIONS } from '@/store/Actions';
import { DataContext } from '@/store/GlobalState';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { Alert, PermissionsAndroid, Platform } from 'react-native';
import io from "socket.io-client";
import Geolocation from 'react-native-geolocation-service';


const SOCKET_URL = process.env.EXPO_PUBLIC_SOCKET_URL;

const LocationEmit = () => {
  const { state, dispatch } = useContext(DataContext)
  const socketRef = useRef<any>(null);
  const watchId = useRef<any>(null);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      const authStatus = await Geolocation.requestAuthorization('whenInUse');
      return authStatus === 'granted';
    }

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'App needs access to your location.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.log(err);
      return false;
    }
  };


  // Emit riders location
  useEffect(() => {
    if (state?.token) {
      const emitLocation = async () => {

        const socket = io(SOCKET_URL + "/rider-location", {
          auth: {
            token: `Bearer ${state?.token}`,
          },
          transports: ["websocket"]
        });


        // Log connection status
        socket.on('connect', () => {
          console.log('Successfully connected to the location socket');
        });

        // socket.on("connection_success", (message) => {
        //   console.log("Confirmation of successful connection:", message);
        // });

        socket.on("locationUpdated", (message) => {
          console.log("Confirmation of location updated:", message);
        });

        // Start watching location
        const startWatchingLocation = async () => {
          const hasLocationPermission = await requestLocationPermission();
          if (!hasLocationPermission) {
            return;
          }

          // Get the initial rider locatiom

          Geolocation.getCurrentPosition(
            position => {
              dispatch({ type: ACTIONS.RIDER_LOCATION, payload: position.coords })
              // console.log(position?.coords)

              // socket.emit(
              //   "updateLocation",{
              //     latitude: position.coords.latitude,
              //     longitude: position.coords.longitude,


              //   })
            },
            error => {
              console.error(error);
              // Alert.alert('Error', 'Unable to get your location');
            },
            {
              enableHighAccuracy: true,
              distanceFilter: 1,
            },
          );

          watchId.current = Geolocation.watchPosition(
            position => {
              // console.log(position.coords)
              dispatch({ type: ACTIONS.CURRENT_LOCATION, payload: position.coords })
              // console.log(position?.coords)

              // socket.emit(
              //   "updateLocation", {
              //   latitude: position.coords.latitude,
              //   longitude: position.coords.longitude
              // })
            },
            error => {
              console.error(error);
            },
            {
              enableHighAccuracy: true,
              distanceFilter: 0,
              interval: 1000,
              fastestInterval: 1000,
              forceRequestLocation: true,
              showLocationDialog: true,
            },
          );
        };

        startWatchingLocation();



        // Clean up the location watcher when the component unmounts
        return () => {
          if (watchId.current !== null) {
            Geolocation.clearWatch(watchId.current);
          }
        };
      };
      emitLocation();
    }
  }, [state?.token]);

  useEffect(() => {
    if (state?.socket) {

      // listen to active chats for rider/partner
      state.socket.on("activeChats", (active) => {
        // console.log("Active Chats received:", active);

        dispatch({
          type: ACTIONS.ACTIVE_CHATS,
          payload: active,
        });

        dispatch({
          type: ACTIONS.PARTNER_CHAT_LOADING,
          payload: false,
        });

      });

    }
  }, [state?.socket]);


  return (
    <></>
  )
}

export default LocationEmit