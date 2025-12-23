import React, { useContext } from "react";
import { Pressable, View } from "react-native";

import { Avatar } from "@/components/Avatar";
import { Text } from "@/components/ui";
import { useRouter } from "expo-router";
import moment from "moment";
import { colors } from "@/theme";
import { DataContext } from "@/store/GlobalState";
import { ACTIONS } from "@/store/Actions";

export const RiderCustomerMessages = ({ data }: any) => {
  const router = useRouter();
  const { state, dispatch } = useContext(DataContext);


  // Handle view message
  const viewMessage = async () => {
    if (state?.socket) {
      dispatch({ type: ACTIONS.RECIPIENT, payload: data });
      state?.socket.emit("markAsRead", { partnerId: data?.id, riderId: state?.user?.id });
      router.push(`/(chat)/${data?.id}`);
    }
  };

  return (
    <Pressable
      onPress={viewMessage}
      style={{
        borderRadius: 12,
        marginTop: 20,
        marginBottom: 10,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View style={{ flexDirection: "row", gap: 8, flex: 1 }}>
          <Avatar
            size={45}
            source={{
              uri: data?.profileImage,
            }}
          />
          <View style={{ flexShrink: 1 }}>
            <Text
              style={{
                fontSize: 17,
                fontWeight: "600",
              }}
            >
              {data?.name}
            </Text>
            <Text
              style={{
                fontSize: 15,
                color: "gray",
                flexShrink: 1,
                marginTop:4
              }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {data?.lastMessage?.message.slice(0, 100)}
              {data?.lastMessage?.message.length > 100 && "..."}
            </Text>
          </View>
        </View>

        {data?.lastMessage?.isRead || data?.unreadCount === 0 ? (
          <Text
            style={{
              fontSize: 14,
              color: "#797979",
              fontWeight: "600",
              marginLeft: 10,
            }}
          >
            {moment(data?.lastMessage?.createdAt).format("LT")}
          </Text>
        ) : (
          <View
            style={{
              height: 30,
              width: 30,
              borderRadius: 50,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: colors.primary,
              marginLeft: 10,
            }}
          >
            <Text style={{ color: "white", fontFamily: "interBold" }}>
              {data?.unreadCount}
            </Text>
          </View>
        )}
      </View>
    </Pressable>
  );
};
