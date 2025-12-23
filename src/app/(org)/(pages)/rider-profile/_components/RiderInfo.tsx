import React from "react";
import { View } from "react-native";

import { FontAwesome6, MaterialCommunityIcons } from "@expo/vector-icons";

import { StarRating } from "@/components";
import { Text } from "@/components/ui";
import { s } from "react-native-size-matters";
import { colors } from "@/theme";
import { formatMoney } from "@/utils/utils";

 const RiderInfo = ({ riderDetails }:any) => {

  return (
    <View style={{ backgroundColor: "white", padding: 18, borderBottomWidth:1,borderColor:colors.border }}>
      <Text style={{ fontSize: s(16), fontFamily:'interSemiBold' }}>
        Rider info
      </Text>

      <View style={{ marginTop: 24, gap: 32 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: s(14) }}>Phone number</Text>
          <Text style={{ fontSize: s(14) }}>{riderDetails?.user?.phoneNumber}</Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: s(14) }}>Email</Text>
          <Text style={{ fontSize: s(14) }}>{riderDetails?.user?.email}</Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: s(14) }}>Vehicle type</Text>
          <Text style={{ fontSize: s(14) }}>{riderDetails?.vehicleType} ({riderDetails?.vehiclePlateNumber})</Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: s(14) }}>Rating</Text>
          <StarRating rating={riderDetails?.averageRating} />
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: s(14) }}>Completed deliveries</Text>
          <View style={{ flexDirection: "row", gap: 6, alignItems: "center" }}>
            <MaterialCommunityIcons name="bike" color="black" size={18} />
            <Text style={{ fontSize: s(14) }}>{riderDetails?.metadata?.completedDeliveries}</Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: s(14) }}>Total earnings</Text>
          <View style={{ flexDirection: "row", gap: 2, alignItems: "center" }}>
            <FontAwesome6 name="naira-sign" color="black" size={12} />
            <Text style={{ fontSize: s(14) }}>{formatMoney(riderDetails?.totalEarnings)}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default RiderInfo
