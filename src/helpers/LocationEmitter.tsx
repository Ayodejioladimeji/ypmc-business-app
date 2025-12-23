// import { ACTIONS } from '@/store/Actions';
// import { DataContext } from '@/store/GlobalState';
// import React, { useContext, useEffect, useRef, useState } from 'react'
// import { Alert, PermissionsAndroid, Platform } from 'react-native';
// import io from "socket.io-client";
// import Geolocation from 'react-native-geolocation-service';


// const SOCKET_URL = process.env.EXPO_PUBLIC_SOCKET_URL;

// const LocationEmitter = () => {
//   const { state, dispatch } = useContext(DataContext)
//   const socketRef = useRef<any>(null);
//   const watchId = useRef<any>(null);

//   const requestLocationPermission = async () => {
//     if (Platform.OS === 'ios') {
//       const authStatus = await Geolocation.requestAuthorization('whenInUse');
//       return authStatus === 'granted';
//     }

//     try {
//       const granted = await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//         {
//           title: 'Location Permission',
//           message: 'App needs access to your location.',
//           buttonNeutral: 'Ask Me Later',
//           buttonNegative: 'Cancel',
//           buttonPositive: 'OK',
//         },
//       );
//       return granted === PermissionsAndroid.RESULTS.GRANTED;
//     } catch (err) {
//       console.log(err);
//       return false;
//     }
//   };


//   // Emit riders location
//   useEffect(() => {
//     if (state?.token) {
//       const emitLocation = async () => {

//         socketRef.current = io(SOCKET_URL + "/rider-location", {
//           auth: {
//             token: `Bearer ${state?.token}`,
//           },
//           transports: ["websocket"]
//         });


//         // Log connection status
//         socketRef.current.on('connect', () => {
//           console.log('Successfully connected to the location socket');
//         });

//         // socket.on("connection_success", (message) => {
//         //   console.log("Confirmation of successful connection:", message);
//         // });

//         socketRef.current.on("locationUpdated", (message) => {
//           console.log("Confirmation of location updated:", message);
//         });

//         // Start watching location
//         const startWatchingLocation = async () => {
//           const hasLocationPermission = await requestLocationPermission();
//           if (!hasLocationPermission) {
//             return;
//           }

//           // Get the initial rider locatiom

//           Geolocation.getCurrentPosition(
//             position => {
//               dispatch({ type: ACTIONS.RIDER_LOCATION, payload: position.coords })
//               // console.log(position?.coords)

//               socketRef.current.emit(
//                 "updateLocation",{
//                   latitude: position.coords.latitude,
//                   longitude: position.coords.longitude,
//                 })
//             },
//             error => {
//               console.error(error);
//               Alert.alert('Error', 'Unable to get your location');
//             },
//             {
//               enableHighAccuracy: true,
//               distanceFilter: 1,
//             },
//           );

//           watchId.current = Geolocation.watchPosition(
//             position => {
//               // console.log(position.coords)
//               dispatch({ type: ACTIONS.CURRENT_LOCATION, payload: position.coords })
//               // console.log(position?.coords)

//               socketRef.current.emit(
//                 "updateLocation", {
//                 latitude: position.coords.latitude,
//                 longitude: position.coords.longitude
//               })
//             },
//             error => {
//               console.error(error);
//             },
//             {
//               enableHighAccuracy: true,
//               distanceFilter: 1,
//               interval: 60000,
//               fastestInterval: 60000,
//               forceRequestLocation: true,
//               showLocationDialog: true,
//             },
//           );
//         };

//         startWatchingLocation();



//         // Clean up the location watcher when the component unmounts
//         return () => {
//           if (watchId.current !== null) {
//             Geolocation.clearWatch(watchId.current);
//           }
//         };
//       };
//       emitLocation();
//     }
//   }, [state?.token]);


//   return (
//     <></>
//   )
// }

// export default LocationEmitter


import { ACTIONS } from '@/store/Actions';
import { DataContext } from '@/store/GlobalState';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Alert, Platform } from 'react-native';
import io from "socket.io-client";
import * as Location from 'expo-location'; // Import expo-location

const SOCKET_URL = process.env.EXPO_PUBLIC_SOCKET_URL;

const LocationEmitter = () => {
  const { state, dispatch } = useContext(DataContext);
  const socketRef = useRef(null);
  const locationSubscription = useRef(null); // Use ref for location subscription

  const requestLocationPermission = async () => {
    // Request foreground location permissions (required for watching position)
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Denied',
        'Permission to access location was denied. Please enable it in settings to continue.',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  };

  // Emit rider's location
  useEffect(() => {
    if (state?.token && SOCKET_URL) { // Ensure SOCKET_URL is defined
      const emitLocation = async () => {
        const hasLocationPermission = await requestLocationPermission();
        if (!hasLocationPermission) {
          console.warn("Location permission not granted, cannot emit location.");
          return;
        }

        // Initialize socket connection
        if (!socketRef.current) {
          socketRef.current = io(SOCKET_URL + "/rider-location", {
            auth: {
              token: `Bearer ${state?.token}`,
            },
            transports: ["websocket"],
          });

          // Log connection status
          socketRef.current.on('connect', () => {
            console.log('Successfully connected to the location socket');
          });

          socketRef.current.on('connect_error', (error) => {
            console.error('Socket connection error:', error.message);
            // Optionally, handle reconnection or notify user
          });

          socketRef.current.on('disconnect', (reason) => {
            console.log('Socket disconnected:', reason);
            // Optionally, handle reconnection
          });

          socketRef.current.on("locationUpdated", (message) => {
            console.log("Confirmation of location updated:", message);
          });
        }


        // Get the initial rider location
        try {
          const initialPosition = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
          });

          
          const coordinates = {
            latitude: initialPosition?.coords?.latitude,
            longitude: initialPosition?.coords?.longitude,
            timestamp: initialPosition?.timestamp
          }

          
          dispatch({ type: ACTIONS.RIDER_LOCATION, payload: coordinates });
          socketRef.current.emit(
            "updateLocation",
            {
              latitude: initialPosition.coords.latitude,
              longitude: initialPosition.coords.longitude,
              timestamp: initialPosition?.timestamp
            }
          );
        } catch (error) {
          console.error("Error getting initial location:", error);
          Alert.alert('Error', 'Unable to get your current location.');
        }


        
        try {
          locationSubscription.current = await Location.watchPositionAsync(
            {
              accuracy: Location.Accuracy.High,
              distanceInterval: 1, // Update every 1 meter movement
              timeInterval: 60000, // Update every 60 seconds (60000 ms)
            },
            (position) => {
              const coordinates = {
                latitude: position?.coords?.latitude,
                longitude:position?.coords?.longitude,
                timestamp:position?.timestamp
              }
              console.log(coordinates)
              dispatch({ type: ACTIONS.CURRENT_LOCATION, payload: coordinates });
              socketRef.current.emit(
                "updateLocation",
                {
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                  timestamp: position?.timestamp
                }
              );
            }
          );
        } catch (error) {
          // console.error("Error watching location:", error);
          Alert.alert('Error', 'Failed to start live location tracking.');
        }
      };

      emitLocation();
    }

    
    return () => {
      // Clean up the location watcher
      if (locationSubscription.current) {
        locationSubscription.current.remove();
        locationSubscription.current = null;
      }
      // Disconnect socket if connected
      if (socketRef.current && socketRef.current.connected) {
        socketRef.current.disconnect();
        socketRef.current = null;
        console.log("Location socket disconnected on unmount.");
      }
    };
  }, [state?.token, SOCKET_URL, dispatch]);

  return <></>; 
};

export default LocationEmitter;