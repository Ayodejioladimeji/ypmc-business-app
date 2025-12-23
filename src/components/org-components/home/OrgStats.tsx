import React, { useContext, useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { Text } from "../../ui";
import { ActiveRidersIcon, CompletedDeliveriesIcon, TotalDeliveryRequestIcon, TotalEarningsIcon } from "@/assets/images/svgs";
import { s } from "react-native-size-matters";
import { GetRequest } from "@/utils/requests";
import { DataContext } from "@/store/GlobalState";
import { ACTIONS } from "@/store/Actions";
import { formatMoney } from "@/utils/utils";

export const OrgStats = () => {
   const { state, dispatch } = useContext(DataContext)
   const [metrics, setmetrics] = useState<any>(null)
   const [loading, setLoading] = useState(true)

    // get dashboard metrics
    const getMetrics = async() => {
      const res = await GetRequest("/rider-management/dashboard-metrics", state?.token)
      if(res?.status === 200 || res?.status === 201){
        setmetrics(res?.data?.data?.all_time)
      }
      setLoading(false)
    }
  
    useEffect(() => {
      if(state?.token){
        getMetrics()
      }
    }, [state?.packageDelivered, state?.callback])

  
  const statsData = [
    {
      iconName: <TotalEarningsIcon/>,
      iconColor: "black",
      iconBackgroundColor: "#e5e5e5",
      title: "Total earnings",
      value: metrics?.earnings?.count,
      currencyIcon: "naira-sign",
    },
    {
      iconName: <TotalDeliveryRequestIcon />,
      iconColor: "#f97216",
      iconBackgroundColor: "#fef1e8",
      title: "Total delivery request",
      value: metrics?.deliveryRequestCount?.count || 0,
    },
    {
      iconName: <CompletedDeliveriesIcon />,
      iconColor: "blue",
      iconBackgroundColor: "#f3f3f3",
      title: "Completed deliveries",
      value: metrics?.completedDeliveryCount?.count || 0,
    },
    {
      iconName: <ActiveRidersIcon />,
      iconColor: "blue",
      iconBackgroundColor: "#f3f3f3",
      title: "Active riders",
      value: metrics?.activeRiderCount?.count | 0,
    },
  ];

  return (
      <View
        style={{
          marginTop: 12,
          flexDirection: "row",
          gap: 12,
          marginBottom:15,
          justifyContent:'space-between',
          flexWrap:"wrap"
        }}
      >
        {statsData.map((item, index) => (
          <StatsCard
            key={index}
            iconName={item.iconName}
            title={item.title}
            value={item.value}
            currencyIcon={item.currencyIcon}
            loading={loading}
          />
        ))}
      </View>
  );
};

const StatsCard = ({
  iconName,
  title,
  value,
  currencyIcon,
  loading
}: any) => {
  return (
    <View
      style={{
        padding: 15,
        borderRadius: 12,
        backgroundColor: "white",
        width:'48%'
      }}
    >
      {iconName}

      <Text style={{ marginTop: 15, fontSize: s(13), color: "gray" }}>
        {title}
      </Text>

      <Text style={{ fontFamily:'interSemiBold', fontSize: s(15), marginTop:10 }}>
        {currencyIcon && '₦'} {loading ? <ActivityIndicator/> : formatMoney(value)}
      </Text>
    </View>
  );
};
