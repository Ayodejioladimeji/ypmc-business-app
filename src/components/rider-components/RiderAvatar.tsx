import React, { useContext } from "react";
import { View } from "react-native";

import { useGetRiderDetailsQuery } from "@/redux/actions/rider";

import { Avatar } from "../Avatar";
import { RiderActiveBadge } from "../RiderActiveBadge";
import { Text } from "../ui";
import { DataContext } from "@/store/GlobalState";
import { s } from "react-native-size-matters";
import { getInitials } from "@/utils/utils";
import { Image } from "expo-image";

export const RiderAvatar = () => {
  const { state } = useContext(DataContext)
  const { user } = state


  // 

  return (
    <View
      style={{
        flexDirection: "row",
        gap: 12,
      }}
    >
      {user?.metadata?.profileImageUrl ?
        <Image
          source={{ uri: user?.metadata?.profileImageUrl }}
          style={{
            width: 35,
            height: 35,
            borderRadius:50

          }}
        />
        :
        <View style={{ alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: "50%", borderWidth: 1, borderColor: "#999" }}>
          <Text>{user?.firstName.charAt(0).toUpperCase()}{user?.lastName.charAt(0).toUpperCase()}</Text>
        </View>
        }

      <View>

        <Text
          style={{
            fontSize: s(13),
            fontWeight: 500,
            marginBottom: 2
          }}
        >
          {user?.firstName} {user?.lastName}
        </Text>

        <View style={{ gap: 6 }}>
          <RiderActiveBadge
          />

          <Text style={{ maxWidth: 200, fontSize: s(10) }}>
            Ready to roll? Toggle on to start receiving orders 📦!
          </Text>
        </View>
      </View>
    </View>
  );
};
