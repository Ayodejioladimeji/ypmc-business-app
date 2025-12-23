import React, { useState } from "react";
import { Platform, SafeAreaView, View } from "react-native";

import { Layout, Tabs } from "@/components";
import {
  RiderAllDeliveries,
  RiderScheduledDeliveries,
} from "@/components/rider-components/deliveries";
import { useGetRiderShipmentsQuery } from "@/redux/actions/rider";
import TopNavigation from "@/components/TopNavigation";

export interface RiderProps {
  allRiders?: any;
  activeRiders?: any;
  pendingRequests?: any;
  isLoading: boolean;
  refetch: () => void;
}

const tabs = ["Ongoing", "Completed"];

const RiderDeliveries = () => {
  const [activeTab, setActiveTab] = useState("Ongoing");


  const displayTabContent = () => {
    switch (activeTab) {
      case "Ongoing":
        return (
          <RiderAllDeliveries
          />
        );
      case "Completed":
        return <RiderScheduledDeliveries />;
      default:
        break;
    }
  };

  return (
    <SafeAreaView style={{flex:1, backgroundColor:'white', paddingHorizontal:10, paddingTop: Platform.OS === "android" ? 40 : 0}}>
      <TopNavigation title="My Deliveries"/>
      <View style={{marginTop:20, paddingHorizontal:10}}>
        <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
        {displayTabContent()}
      </View>
    </SafeAreaView>
  );
};

export default RiderDeliveries;
