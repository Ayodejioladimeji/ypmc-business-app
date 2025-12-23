import React, { useContext, useEffect } from "react";

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { RiderSidebar } from "@/components/rider-components";
import { OneSignal } from "react-native-onesignal";
import { ShowNotify } from "@/components/ui/Toasts";
import { ACTIONS } from "@/store/Actions";
import { DataContext } from "@/store/GlobalState";
import { Platform } from "react-native";
import { SocketClient } from "@/components/rider-components/socket-client";
import LocationEmitter from "@/helpers/LocationEmitter";


const RiderLayout = () => {
  const { state, dispatch } = useContext(DataContext)


  useEffect(() => {
    OneSignal.initialize(process.env.EXPO_PUBLIC_ONESIGNAL_APP_ID);
    OneSignal.Notifications.requestPermission(true);

    // const onClickListener = (event) => {
    //   console.log('OneSignal: notification clicked:', event);
    // };

    const onForegroundDisplayListener = (event) => {
      dispatch({ type: ACTIONS.MESSAGE, payload: event?.notification });


      // if (event?.notification?.title.includes("Shipping Assignment")) {
      //   dispatch({ type: ACTIONS.ORDER_MODAL, payload: true });
      // }

      if (event?.notification?.additionalData?.tag === "shipping_created") {
        dispatch({ type: ACTIONS.ORDER_MODAL, payload: true });
      }

      if (event?.notification?.title.includes("Assignment Expired")) {
        dispatch({ type: ACTIONS.ORDER_MODAL, payload: false });
      }

      if (event?.notification?.title.includes("KYC Verification Approved")) {
        dispatch({ type: ACTIONS.APPROVAL, payload: true });
      }

      if (event?.notification?.additionalData?.tag === "rider_assigned"){
        dispatch({ type: ACTIONS.INCOMING, payload: event?.notification });
      }
      
      if (event?.notification?.additionalData?.tag === "chat_message"){
        dispatch({ type: ACTIONS.MESSAGES, payload: event?.notification });
      }


      if (Platform.OS === "android") {
        ShowNotify('toast', event?.notification?.title as string, event?.notification?.body);
      }

      event.getNotification().display();
    };

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
      <LocationEmitter />
      <Stack screenOptions={{ gestureEnabled: false }} >
        <Stack.Screen
          name="support"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="home"
          options={{
            header: () => <RiderSidebar />,
          }}
        />
        <Stack.Screen
          name="rider-deliveries"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="rider-shippings"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="wallet"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="rider-notifications"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="notification-settings"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="rider-messages"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="transactions"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="transaction-details"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="request-withdrawal"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="success-withdrawal"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="account"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="rider-profile"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="business-hours"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="partner-business-hours"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="delivery-rate"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="partner-delivery-rate"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="change-password"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="faqs"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="delivery-details"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="success-bank"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="start-order"
          options={{
            header: () => <RiderSidebar />,
          }}
        />
        <Stack.Screen
          name="pickup-order"
          options={{
            header: () => <RiderSidebar />,
          }}
        />
        <Stack.Screen
          name="deliver-order"
          options={{
            header: () => <RiderSidebar />,
          }}
        />
        <Stack.Screen
          name="partner-info"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="kyc"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="kyc-success"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="scheduled-shipment"
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
      
      </Stack>
      <StatusBar style="dark" />
    </>
  );
};

export default RiderLayout;
