import React, { useContext, useEffect, useRef, useState } from "react";
import { ActivityIndicator, AppState, Pressable, ScrollView, View } from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useOrgGetAllRidersQuery } from "@/redux/actions/org";

import { Text } from "../../ui";
import { s } from "react-native-size-matters";
import { RiderCard } from "@/components/RiderCard";
import { GetRequest } from "@/utils/requests";
import { DataContext } from "@/store/GlobalState";

export const OrgActiveRiders = () => {
  const { data } = useOrgGetAllRidersQuery("");
  const [riders, setRiders] = useState<any>([])
  const { state } = useContext(DataContext)
  const [loading, setLoading] = useState(true)
  const appState = useRef(AppState.currentState);

  const getRider = async () => {
    const res = await GetRequest(`/rider-management/riders`, state?.token)
    if (res?.status === 200 || res?.status === 201) {
      const active = res?.data?.data.filter((item: any) => item?.associationStatus === "APPROVED" && item?.riderStatus === 'ACTIVE')
      setRiders(active)
    }
    setLoading(false)
  }

  useEffect(() => {
    if (state?.token) {
      getRider()
    }
  }, [state?.callback])

    useEffect(() => {
      const subscription = AppState.addEventListener('change', nextAppState => {
        if (
          appState.current.match(/inactive|background/) &&
          nextAppState === 'active'
        ) {
  
            getRider();
          
        }
        appState.current = nextAppState;
      });
  
      return () => {
        subscription.remove();
      };
    }, [getRider]);



  // 

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 15,
        backgroundColor: "white",
        borderRadius: 16,
        gap: 12,
        marginBottom: 120
      }}
    >
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
            fontWeight: "bold",
          }}
        >
          Active riders
        </Text>

       {riders?.length > 0 && <Pressable
          onPress={() => router.push("/riders")}
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: s(13),
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
        </Pressable>}
      </View>



      {loading ?
        <ActivityIndicator style={{ marginVertical: 30 }} />
        :

        <>
          {riders?.length === 0 ?
            <View style={{ backgroundColor: 'white', paddingVertical: 30 }}>
              <Text style={{ textAlign: 'center', fontSize: s(13) }}>No available shipment</Text>
            </View>
            :
            <>
              {riders?.slice(0,5)?.map((item: any, index: number) => {
                return (
                  <RiderCard
                    key={index}
                    item={item}
                  />
                )
              })}
            </>
          }
        </>
      }

    </ScrollView>
  );
};
