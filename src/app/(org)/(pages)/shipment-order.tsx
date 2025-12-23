import React, { useContext, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, View } from "react-native";

import { Layout } from "@/components";
import { OrgShipmentOrderComponent } from "@/components/org-components/home/OrgShipmentOrderComponent";
import { GetRequest } from "@/utils/requests";
import { DataContext } from "@/store/GlobalState";
import { SafeAreaView } from "react-native-safe-area-context";
import TopNavigation from "@/components/TopNavigation";


const ShipmentOrder = () => {
const [shipmentData, setShipmentData] = useState<any>([])
const {state} = useContext(DataContext)
const [loading ,setLoading] = useState(true)

  useEffect(() => {
    const getOrder = async () => {
      const res = await GetRequest(`/rider-management/associated-riders-proposed-shippings`, state?.token)
      if (res?.status === 200 || res?.status === 201) {
        setShipmentData(res?.data?.data)
      }
      setLoading(false)
    }

    if (state?.token) {
      getOrder()
    }
  }, [state?.token, state?.shipmentOrder, state?.callback])

  // 
  

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white", paddingHorizontal:16, paddingTop:0 }}>
      <TopNavigation title="Shipment Order"/>
       {loading ? <ActivityIndicator/>
       :
          <FlatList
            data={shipmentData}
            keyExtractor={(_item, index) => index.toString()}
            renderItem={({ item, index }) => (
                <OrgShipmentOrderComponent
                  key={index} item={item}
                />
            )}
            contentContainerStyle={{ paddingBottom: 12 }}
            showsVerticalScrollIndicator={false}
          />}
      </SafeAreaView>
  );
};

export default ShipmentOrder;
