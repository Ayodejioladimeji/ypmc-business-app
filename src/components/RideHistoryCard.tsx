import React from "react";
import { Pressable, View } from "react-native";

import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

import { TransitBadge } from ".";
import { Text } from "./ui";

export const RiderHistoryCard = ({item}:any) => {

  return (
    <Pressable
      style={{
        borderRadius: 12,
        marginTop: 12,
        marginBottom: 12,
      }}
    >
      {/* <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
          }}
        >
          <View
            style={{
              padding: 2,
              backgroundColor: status === "In transit" ? "#e8f3f9" : "#edf8ed",
              width: 35,
              borderRadius: 40,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <MaterialCommunityIcons
              name="package-variant-closed"
              color={status === "In transit" ? "#3a92cc" : "#67c261"}
              size={29}
            />
          </View>
          <View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
              }}
            >
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "bold",
                }}
              >
                {type}
              </Text>
              {status === "In transit" && <TransitBadge />}
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
                marginTop: 5,
              }}
            >
              <Text
                style={{
                  color: "gray",
                  fontSize: 14,
                }}
              >
                {date}
              </Text>
            </View>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
          }}
        >
          <Text
            style={{
              fontSize: 15,
            }}
          >
            {number}
          </Text>
          <MaterialIcons name="keyboard-arrow-right" size={20} />
        </View>
      </View> */}
    </Pressable>
  );
};
