import React, { useContext, useEffect, useState } from "react";
import { Platform, SafeAreaView, View } from "react-native";

import { Layout, Tabs } from "@/components";
import {
  RiderAllDeliveries,
  RiderScheduledDeliveries,
} from "@/components/rider-components/deliveries";
import { useGetRiderShipmentsQuery } from "@/redux/actions/rider";
import TopNavigation from "@/components/TopNavigation";
import { Text } from "@/components/ui";
import Navigation from "@/components/Navigation";
import { ActiveDeliveries } from "@/components/org-components/active-deliveries";
import { CompletedDeliveries } from "@/components/org-components/completed-deliveries";
import { DataContext } from "@/store/GlobalState";
import { GetRequest } from "@/utils/requests";

export interface RiderProps {
  allRiders?: any;
  activeRiders?: any;
  pendingRequests?: any;
  isLoading: boolean;
  refetch: () => void;
}

const tabs = ["Active", "Completed"];

const Shippings = () => {
  const [activeTab, setActiveTab] = useState("Active");
  const { state } = useContext(DataContext)
  const [activeData, setActiveData] = useState<any>([])
  const [completedData, setCompletedData] = useState<any>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (state?.token) {
      getActiveDeliveries(state?.token);
      getCompletedDeliveries(state?.token)
    }
  }, [state?.token, state?.callback]);

  // get completed deliveries
  const getCompletedDeliveries = async (token: string) => {
    const res = await GetRequest(`/shipping/partner?statusCategory=DELIVERED&limit=50`, token)
    if (res?.status === 200 || res?.status === 201) {
      setCompletedData(res?.data?.data?.data)
    }
  }

  const getActiveDeliveries = async (token: string) => {
    setLoading(true);
    const res = await GetRequest(`/shipping/partner?statusCategory=ACTIVE`, token);
    if (res?.status === 200 || res?.status === 201) {
      setActiveData(res?.data?.data?.data)
    }

    setLoading(false);
  };


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: 10, paddingTop: Platform.OS === "android" ? 40 : 0 }}>
      <Navigation title="Shippings" />

      <View style={{ marginTop: 10, paddingHorizontal: 10 }}>
        <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
      {/* tabs content */}

        {activeTab === "Active" && <ActiveDeliveries data={activeData} loading={loading} getActiveDeliveries={getActiveDeliveries}
        />}

        {activeTab === "Completed" && <CompletedDeliveries data={completedData} loading={loading} getCompletedDeliveries={getCompletedDeliveries} />}
      </View>
    </SafeAreaView>
  );
};

export default Shippings;
