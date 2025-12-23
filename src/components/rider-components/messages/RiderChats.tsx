import React from "react";
import { Pressable, View } from "react-native";

import { router } from "expo-router";

import { Avatar } from "@/components/Avatar";
import { Text } from "@/components/ui";

export const RiderChat = ({
  companyName,
  message,
  time,
}: {
  companyName: string;
  message: string;
  time: string;
}) => {
  return (
    <Pressable
      onPress={() => router.push("/(chat)/[id]")}
      style={{
        borderRadius: 12,
      }}
    >
      <Text
        style={{
          fontSize: 16,
          color: "gray",
        }}
      >
        Company
      </Text>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 24,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            gap: 8,
          }}
        >
          <Avatar
            size={40}
            source={{
              uri: "",
            }}
          />
          <View
            style={{
              gap: 3,
            }}
          >
            <Text
              style={{
                fontSize: 17,
                fontWeight: 600,
              }}
            >
              {companyName}
            </Text>
            <Text
              style={{
                fontSize: 15,
                color: "gray",
              }}
            >
              {message.slice(0, 40)}...
            </Text>
          </View>
        </View>

        <Text
          style={{
            fontSize: 14,
            color: "#797979",
            fontWeight: 600,
          }}
        >
          {time}
        </Text>
      </View>
    </Pressable>
  );
};
