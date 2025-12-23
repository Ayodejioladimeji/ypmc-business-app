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
  const [notifications, setNotifications] = useState<NotificationsProps[]>([])
  const [loading, setLoading] = useState(true)
  const { state } = useContext(DataContext)

  useEffect(() => {
    if (state?.token) {
      const getNotifications = async () => {
        const res = await GetRequest("/notifications?page=1&limit=30", state?.token)
        if (res?.status === 200 || res.status === 201) {
          setNotifications(res?.data?.data?.data)
        }
        setLoading(false)
      }
      getNotifications()
    }
  }, [state?.token])


  return (
    <SafeAreaView style={{flex:1, backgroundColor:'white'}}>
      <TopBarNavigation title="Notifications" />

      {loading ? <ActivityIndicator color={colors.primary} style={{ marginTop: 50 }} />
        :
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
      }


    </SafeAreaView>
  );
};

export default Notifications;
