import React, { useContext, useEffect, useState } from "react";
import { Pressable, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { Text } from "@/components/ui";
import { s } from "react-native-size-matters";
import { ACTIONS } from "@/store/Actions";
import { GetRequest, PatchRequest } from "@/utils/requests";
import { DataContext } from "@/store/GlobalState";

export const OrgNotifications = () => {
const { state, dispatch } = useContext(DataContext)
  const [count, setCount] = useState(0)

    useEffect(() => {
      if (state?.token) {
        const getNotifications = async () => {
          const res = await GetRequest("/notifications?page=1&limit=30", state?.token)
          if (res?.status === 200 || res.status === 201) {
            dispatch({ type: ACTIONS.NOTIFICATIONS, payload: res?.data?.data?.data })
            const notificationCount = res?.data?.data?.data?.filter(item => item?.isRead === false)
            setCount(notificationCount?.length)
          }
          
        }
        getNotifications()
      }
    }, [state?.token, state?.message, state?.notificationCallback]) 

  const handleRead = async () => {
    router.push("/notifications")
    const res = await PatchRequest(`/notifications/read-all`, {}, state?.token)
    if (res?.status === 200 || res?.status === 201) {
      dispatch({ type: ACTIONS.NOTIFICATION_CALLBACK, payload: !state?.notificationCallback })
    }
  }


  return (
    <Pressable
      onPress={handleRead}
      style={{ position: "relative" }}
    >
      <Ionicons name="notifications-outline" size={22} />
      {count > 0 && <View
        style={{
          position: "absolute",
          right: -5,
          top: -5,
          height: 15,
          width: 15,
          backgroundColor: "red",
          borderRadius: 20,
          alignItems: "center",
          justifyContent:'center',
        
        }}
      >
        <Text
          style={{
            color: "white",
            fontSize: s(8),
            fontFamily:"interSemiBold"
          }}
        >
          {count}
        </Text>
      </View>}
    </Pressable>
  );
};
