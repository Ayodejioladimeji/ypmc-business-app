import React, { useContext, useEffect } from "react";

import { Stack } from "expo-router";
import { OneSignal } from "react-native-onesignal";
import { ShowNotify } from "@/components/ui/Toasts";
import { ACTIONS } from "@/store/Actions";
import { DataContext } from "@/store/GlobalState";
import { Platform } from "react-native";
import { SocketClient } from "@/components/rider-components/socket-client";


const OrgLayout = () => {
  const { state, dispatch } = useContext(DataContext)

  useEffect(() => {
    OneSignal.initialize(process.env.EXPO_PUBLIC_ONESIGNAL_APP_ID);
    OneSignal.Notifications.requestPermission(true);

    const onForegroundDisplayListener = (event) => {
      dispatch({ type: ACTIONS.MESSAGE, payload: event?.notification });


      if (event?.notification?.title.includes("chat")) {
        dispatch({ type: ACTIONS.NEW_CHATS, payload: event?.notification });
      }

      console.log(event?.notification?.title)
      
      if (event?.notification?.additionalData?.tag === "rider_assigned") {
        dispatch({ type: ACTIONS.SHIPMENT_ORDER, payload: event?.notification });
      }

      if (event?.notification?.title === "Rider Accepted Assignment") {
        dispatch({ type: ACTIONS.SHIPMENT_ORDER, payload: event?.notification });
      }


      if (event?.notification?.title.includes("KYC Verification Approved")) {
        dispatch({ type: ACTIONS.APPROVAL, payload: true });
      }

      if (event?.notification?.title.includes("Order Delivered by Your Rider")) {
        console.log("notification got here")
        dispatch({ type: ACTIONS.PACKAGE_DELIVERED, payload: event?.notification });
      }

      if (Platform.OS === "android") {
        ShowNotify('toast', event?.notification?.title as string, event?.notification?.body);
      }

      event.getNotification().display();
    };

    // const getToken = async () => {
    //   const deviceToken = await OneSignal.User.pushSubscription.getIdAsync();
    //   console.log("mi token", deviceToken)
    // }
    // getToken()
    // OneSignal.Notifications.addEventListener('click', onClickListener);
    OneSignal.Notifications.addEventListener('foregroundWillDisplay', onForegroundDisplayListener);

    return () => {
      // OneSignal.Notifications.removeEventListener('click', onClickListener);
      OneSignal.Notifications.removeEventListener('foregroundWillDisplay', onForegroundDisplayListener);
    };
  }, []);

  // 

  return (
    <>
      <SocketClient />
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="messages"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="(pages)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="chat/[id]"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="direct-chat/[id]"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </>
  );
};

export default OrgLayout;
