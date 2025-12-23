import React, { useContext, useEffect, useRef, useState } from "react";
import { ActivityIndicator, AppState, Pressable, ScrollView, View } from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";

import { Text } from "@/components/ui";

import { OrgShipmentOrderComponent } from "./OrgShipmentOrderComponent";
import { s } from "react-native-size-matters";
import { GetRequest } from "@/utils/requests";
import { DataContext } from "@/store/GlobalState";

export const OrgShipmentOrderList = () => {
  const [orders, setOrders] = useState<any>([])
  const { state } = useContext(DataContext)
  const [loading, setLoading] = useState(true)
  const appState = useRef(AppState.currentState);

  const getOrder = async () => {
    const res = await GetRequest(`/rider-management/associated-riders-proposed-shippings?page=1&limit=5`, state?.token)
    if (res?.status === 200 || res?.status === 201) {
      setOrders(res?.data?.data)
    }
    setLoading(false)
  }

  useEffect(() => {
    if (state?.token) {
      getOrder()
    }
  }, [state?.token, state?.shipmentOrder, state?.callback])

    useEffect(() => {
      const subscription = AppState.addEventListener('change', nextAppState => {
        if (
          appState.current.match(/inactive|background/) &&
          nextAppState === 'active'
        ) {
            getOrder();
          
        }
        appState.current = nextAppState;
      });
  
      return () => {
        subscription.remove();
      };
    }, [getOrder]);

  // 

  return (
    <ScrollView>
      <View
        style={{
          paddingVertical: 20,
          paddingHorizontal: 10,
          backgroundColor: "white",
          borderRadius: 16,
          gap: 12,
          marginBottom: 16,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: s(15), fontWeight: "bold" }}>
            Shipment order
          </Text>

          {orders?.length >0 && <Pressable onPress={() => router.push("/shipment-order")}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: s(14), color: "gray" }}>See all</Text>
              <MaterialCommunityIcons
                name="arrow-right-thin"
                color="gray"
                size={25}
              />
            </View>
          </Pressable>}
        </View>

        {loading ?
          <ActivityIndicator style={{marginVertical:30}}/>
          :

          <>
            {orders?.length === 0 ?
              <View style={{ backgroundColor: 'white', paddingVertical: 30 }}>
                <Text style={{ textAlign: 'center', fontSize: s(13) }}>No available shipment</Text>
              </View>
              :
              <>
                {orders?.map((item, index) => (
                  <OrgShipmentOrderComponent key={index} item={item}
                  />
                ))}
              </>
            }
          </>
        }



      </View>
    </ScrollView>
  );
};
