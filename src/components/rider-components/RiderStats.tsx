import React, { useContext } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";

import { FontAwesome6, MaterialCommunityIcons } from "@expo/vector-icons";

import { Text } from "../ui";
import { GenericData } from "@/types/type";
import { DataContext } from "@/store/GlobalState";

const StatsCard = ({
  iconName,
  iconColor,
  iconBackgroundColor,
  title,
  value,
  currencyIcon,
  loading
}: any) => {
  const { state } = useContext(DataContext)
  return (
    <View
      style={{
        minWidth: 200,
        padding: 24,
        borderRadius: 12,
        backgroundColor: "white",
        borderWidth: 0.3,
        borderColor: 'gray'
      }}
    >
      <View
        style={{
          padding: 2,
          backgroundColor: iconBackgroundColor,
          width: 40,
          height: 40,
          borderRadius: 40,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <MaterialCommunityIcons name={iconName} color={iconColor} size={23} />
      </View>

      <Text style={{ marginTop: 24, marginBottom: 7, fontSize: 15, color: "gray" }}>
        {title}
      </Text>

      {loading ? <ActivityIndicator style={{alignSelf:'flex-start'}}/> :
        <Text style={{ fontFamily: "interSemiBold", fontSize: 22 }}>
          {currencyIcon && <FontAwesome6 name={currencyIcon} size={18} />} {value}
        </Text>}
    </View>
  );
};

export const RiderStats = ({ metrics, loading }: any) => {

  const statsData = [
    {
      iconName: "database-arrow-up",
      iconColor: "black",
      iconBackgroundColor: "#e5e5e5",
      title: "Total earnings",
      value: metrics?.totalEarnings?.toLocaleString() || 0,
      currencyIcon: "naira-sign",
    },
    {
      iconName: "package-variant-closed",
      iconColor: "#f97216",
      iconBackgroundColor: "#fef1e8",
      title: "Total deliveries",
      value: metrics?.totalDeliveries || 0,
    },
    {
      iconName: "bike",
      iconColor: "#1e83c5",
      iconBackgroundColor: "#e8f3f9",
      title: "Distance Covered",
      value: `${metrics?.totalDistanceInKilometers || 0} km`,
    },
  ];

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View
        style={{
          marginTop: 12,
          flexDirection: "row",
          gap: 12,
      
        }}
      >
        {statsData.map((item, index) => (
          <StatsCard
            key={index}
            iconName={item.iconName}
            iconColor={item.iconColor}
            iconBackgroundColor={item.iconBackgroundColor}
            title={item.title}
            value={item.value}
            currencyIcon={item.currencyIcon}
            loading={loading}
          />
        ))}
      </View>
    </ScrollView>
  );
};
