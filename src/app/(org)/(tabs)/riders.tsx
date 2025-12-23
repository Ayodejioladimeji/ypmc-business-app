import React, { useContext, useEffect, useState } from "react";
import { SafeAreaView, View } from "react-native";

import { Layout, Tabs } from "@/components";
import {
  OrgAllActiveRiders,
  OrgAllRiders,
  OrgPendingRequest,
} from "@/components/org-components/riders";
import { Text } from "@/components/ui";
import { useOrgGetAllRidersQuery } from "@/redux/actions/org";
import { s } from "react-native-size-matters";
import { PartnerTabs } from "@/components/PartnerTabs";
import { Line, Ruler } from "@/components/ui/line";
import { GetRequest } from "@/utils/requests";
import { DataContext } from "@/store/GlobalState";
import { ActivityIndicator } from "react-native";

export interface RiderProps {
  allRiders?: any;
  activeRiders?: any;
  pendingRequests?: any;
  isLoading: boolean;
  refetch: () => void;
}

const tabs = ["All", "Active", "Pending"];

const Riders = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [allRiders, setAllRiders] = useState<any>([])
  const [activeRiders, setActiveRiders] = useState<any>([])
  const [pendingRiders, setPendingRiders] = useState<any>([])
  const { state } = useContext(DataContext)
  const [loading, setLoading] = useState(true)

  // 

  const getRiders = async () => {
    const res = await GetRequest("/rider-management/riders", state?.token)
    if (res?.status === 200 || res?.status === 201) {
      const response = res?.data?.data
      const all = response?.filter((item: any) => item?.associationStatus === "APPROVED")
      const active = response?.filter((item: any) => item?.associationStatus === "APPROVED" && item?.riderStatus === 'ACTIVE')
      const pending = response?.filter((item: any) => item?.associationStatus === "PENDING")

      setAllRiders(all)
      setActiveRiders(active)
      setPendingRiders(pending)
    }
    setLoading(false)
  }

  useEffect(() => {
    getRiders()
  }, [state?.callback])

  const displayTabContent = () => {
    switch (activeTab) {
      case "All":
        return (
          <OrgAllRiders
            allRiders={allRiders}
            getRiders={getRiders}
          />
        );
      case "Active":
        return (
          <OrgAllActiveRiders
            allRiders={activeRiders}
            getRiders={getRiders}
          />
        );
      case "Pending":
        return (
          <OrgPendingRequest
            allRiders={pendingRiders}
            getRiders={getRiders}
          />
        );
      default:
        break;
    }
  };

  // 

  return (
    <SafeAreaView style={{ backgroundColor: 'white', flex: 1, paddingTop: 30 }}>
      <Text
        style={{
          marginTop: 20,
          marginBottom: 20,
          textAlign: "center",
          fontSize: s(16),
          fontWeight: 700,
        }}
      >
        My Riders
      </Text>

      <View style={{ height: "100%", paddingHorizontal: 15 }}>
        <PartnerTabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

        <Ruler />

        {loading ?
          <ActivityIndicator style={{ marginTop: 30 }} /> :
          <>
            {displayTabContent()}
          </>
        }
      </View>
    </SafeAreaView>
  );
};

export default Riders;
