import React, { useContext, useEffect, useState } from "react";
import { ActivityIndicator, RefreshControl, ScrollView, View } from "react-native";

import { RiderProps } from "@/app/(org)/(tabs)/riders";
import { Avatar, RiderActiveBadge, SearchBar } from "@/components";
import { EmptyRiderList } from "@/components/rider-components";
import { Text } from "@/components/ui";
import { GetRequest } from "@/utils/requests";
import { DataContext } from "@/store/GlobalState";
import { s } from "react-native-size-matters";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import images from "@/assets/images";
import { colors } from "@/theme";
import { DataFilter } from "@/utils/filter";

export const OrgAllActiveRiders = ({ allRiders, getRiders }: any) => {
  const [search, setSearch] = useState('')
  // const [allRiders, setAllRiders] = useState<any>([])
  const { state } = useContext(DataContext)
  const [isLoading, setIsLoading] = useState(false)
  const [loading, setLoading] = useState(true)

    const filtered = DataFilter(allRiders, search)

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={getRiders} />
      }
      style={{ paddingTop: 15 }}
    >
      <SearchBar placeholder={"Search"} value={search} onChangeText={(value) => setSearch(value)} />

      {allRiders?.length > 0 && (
        <Text style={{ fontFamily: 'interSemiBold', fontSize: s(15), marginVertical: 25 }}>
          Active Riders
        </Text>
      )}

      <View>
        {filtered?.length === 0 ? (
          <EmptyRiderList message="No available rider" />
        ) : (
          filtered?.map(
            (rider: any, index: number) => (
              <AllRidersCard
                key={index}
                {...rider}
              />
            )
          )
        )}
      </View>

      <View style={{ paddingBottom: 100 }}></View>
    </ScrollView>
  );
};

const AllRidersCard = (item: any) => {
  const router = useRouter()

  // 

  return (
    <TouchableOpacity
      onPress={() => router.push(`/rider-profile/${item?.riderId}`)}
      style={{
        borderRadius: 12,
        marginBottom: 32,
      }}
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
          <Image
            source={item?.picture || images?.user}
            style={{
              width: 40,
              height: 40,
              borderRadius: 50,
              borderWidth: 0.5,
              borderColor: colors.mutedForeground
            }}
            contentFit="contain"
          />
          <View>
            <View style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }}>
              <Text
                style={{
                  fontSize: s(13),
                  fontFamily: "interSemiBold"
                }}
              >
                {item?.fullName}
              </Text>

              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2, backgroundColor: "#F3F3F3", paddingHorizontal: 5, paddingVertical: 3, borderRadius: 20 }}>
                <FontAwesome name="star" size={10} color="#F97216" />
                <Text style={{ fontSize: s(10), fontFamily: "interSemiBold", color: '#636363' }}>{item?.averageRating}</Text>
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
                marginTop: 3,
              }}
            >
              <MaterialIcons name="directions-bike" size={15} color="black" />
              <Text
                style={{
                  color: "gray",
                  fontSize: 12,
                }}
              >
                {item?.completedRides} Completed rides
              </Text>
            </View>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
            backgroundColor: item?.riderStatus === "INACTIVE" ? "gray" : "#4FB9481A",
            paddingHorizontal:8,
            paddingVertical:3,
            borderRadius:50
          }}
        >
          <View
            style={{
              height: 8,
              width: 8,
              backgroundColor: item?.riderStatus === "INACTIVE" ? "gray" : "#4fb948",
              borderRadius: 40,
            }}
          />
          <Text
            style={{
              fontSize: s(10),
            }}
          >
            {item?.riderStatus === "INACTIVE" ? "Offline" : "Active"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
