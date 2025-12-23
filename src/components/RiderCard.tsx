import React, { useContext } from "react";
import { Pressable, View } from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";

import { StarRating } from ".";
import { Avatar } from "./Avatar";
import { Text } from "./ui";
import { DataContext } from "@/store/GlobalState";
import { ACTIONS } from "@/store/Actions";
import { Image } from "expo-image";
import images from "@/assets/images";
import { colors } from "@/theme";

export const RiderCard = ({ item }: any) => {
  const { dispatch } = useContext(DataContext)

  const handleRoute = () => {
    dispatch({ type: ACTIONS.RIDER_ID, payload: item.riderId })
    router.push(`/rider-profile/${item?.riderId}`)
  }


  return (
    <Pressable
      onPress={handleRoute}
      style={{
        borderRadius: 12,
        marginTop: 12,
        marginBottom: 12,
      }}
    >
      <View
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
          <Image
            source={item?.picture || images?.user}
            style={{
              width: 40,
              height: 40,
              borderRadius: 50,
              borderWidth: 0.5,
              borderColor: colors.mutedForeground
            }}
            contentFit="contain"
          />
          <View>
            <View>
              <View
                style={{
                  flexDirection: "row",
                  gap: 4,
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                  {item?.fullName}
                </Text>

                {item?.averageRating && <StarRating rating={item?.averageRating} />}
              </View>
            </View>


            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
                marginTop: 5,
              }}
            >
              <MaterialCommunityIcons name="bike" color="gray" size={15} />
              <Text
                style={{
                  color: "gray",
                  fontSize: 14,
                }}
              >
                {item?.completedRides} completed rides
              </Text>
            </View>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
            backgroundColor: '#4FB9481A',
            borderRadius: 20,
            paddingVertical: 4,
            paddingHorizontal: 8
          }}
        >
          <View
            style={{
              height: 8,
              width: 8,
              backgroundColor: "#4fb948",
              borderRadius: 40,
            }}
          />
          <Text
            style={{
              fontSize: 13,
            }}
          >
            Active
          </Text>
        </View>
      </View>
    </Pressable>
  );
};
