import React, { useContext, useEffect, useState } from "react";
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, View } from "react-native";

import { Image } from "expo-image";

import SafeAreaViews from "@/components/safe-area-view";
import TopNavigation from "@/components/TopNavigation";
import { GetRequest } from "@/utils/requests";
import { DataContext } from "@/store/GlobalState";
import { colors } from "@/theme";
import NotificationComponent from "@/components/rider-components/notifications/notification";
import TopBarNavigation from "@/components/TopBarNavigation";

interface NotificationsProps {
  id: string,
  createdAt: string,
  message: string,
  isRead: boolean,
  title: string,
  type: string,
}

const Notifications = () => {
  const [loading, setLoading] = useState(true)
  const { state } = useContext(DataContext)
  const {notifications} = state


  return (
    <SafeAreaView style={{flex:1, backgroundColor:'white'}}>
      <TopBarNavigation title="Notifications" />

        <>
          {notifications?.length === 0 ? 
          <View
            style={{
              backgroundColor: "#FFF",
              marginTop:150,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              source={require("@/assets/images/push-notifications.png")}
              style={{
                width: 184,
                height: 184,
              }}
              contentFit="contain"
            />
            <Text style={{ color: "#636363", fontSize: 16 }}>
              No notifications at the moment
            </Text>
          </View>

            :

            <NotificationComponent notifications={notifications} />

          }
        </>
    </SafeAreaView>
  );
};

export default Notifications;
