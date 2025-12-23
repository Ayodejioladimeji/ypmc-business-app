import React from "react";
import { Pressable, ScrollView, View } from "react-native";

import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Text } from "@/components/ui";
import { RiderHistoryCard } from "@/components/RideHistoryCard";
import { TransitBadge } from "@/components";
import moment from "moment";
import { s } from "react-native-size-matters";
import { colors } from "@/theme";


const RideHistoryList = ({
  backgroundColor,
  padding,
  rider,
}: {
  backgroundColor: string;
  padding: number;
  rider: any,
}) => {

    const handleRoute = (item:any) => {
      router.push({
        pathname: "/(org)/delivery-details",
        params: {
          id: item?.id,
          riderId: rider?.id
        }
      });
    }


  // 

  return (
    <ScrollView
      contentContainerStyle={{
        padding: padding,
        backgroundColor: backgroundColor,
        borderRadius: 16,
        gap: 12,
        paddingVertical:20,
        borderBottomWidth:1,
        borderColor:colors.border
      }}
    >
      {rider?.rideHistory?.length > 1 && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: s(16),
              fontFamily:"interSemiBold",
            }}
          >
            Ride history
          </Text>

          <Pressable
            onPress={() => router.push(`/rider-history/${rider?.id}`)}
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: s(14),
                color: "gray",
              }}
            >
              See all
            </Text>
            <MaterialCommunityIcons
              name="arrow-right-thin"
              color="gray"
              size={25}
            />
          </Pressable>
        </View>
      )}

      {rider?.rideHistory?.slice(0, 5)?.map((item: any, index: number) => (
        <Pressable
          key={index}
          style={{
            borderRadius: 12,
            marginTop: 12,
            marginBottom: 12,
          }}
          onPress={() => handleRoute(item)}
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
              <View
                style={{
                  padding: 2,
                  backgroundColor: item?.status === "In transit" ? "#e8f3f9" : "#edf8ed",
                  width: 35,
                  borderRadius: 40,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <MaterialCommunityIcons
                  name="package-variant-closed"
                  color={item?.status === "In transit" ? "#3a92cc" : "#67c261"}
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
                      fontSize: s(13),
                      fontFamily:"interSemiBold",
                    }}
                  >
                    {item?.packageDetails?.name}
                  </Text>
                  {item?.status === "In transit" && <TransitBadge />}
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
                      fontSize: s(12),
                    }}
                  >
                    {moment(item?.actualDeliveryTime).format("lll")}
                  </Text>
                </View>
              </View>
            </View>

            {/* <View
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
          </Text> */}
            <MaterialIcons name="keyboard-arrow-right" size={20} />
            {/* </View> */}
          </View>
        </Pressable>
      ))}
    </ScrollView>
  );
};

export default RideHistoryList
