import React, { useContext, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, View } from "react-native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { Text } from "@/components/ui";
import { GetRequest } from "@/utils/requests";
import { router, useLocalSearchParams } from "expo-router";
import { DataContext } from "@/store/GlobalState";
import { TransitBadge } from "@/components";
import moment from "moment";
import DropDownPicker from "react-native-dropdown-picker";
import { colors } from "@/theme";
import { Image } from "expo-image";
import { s } from "react-native-size-matters";

const RiderHistory = () => {
  const [shippings, setShippings] = useState<any>([])
  const { id } = useLocalSearchParams();
  const { state } = useContext(DataContext)
  const [loading, setLoading] = useState(true)
  const [showDate, setShowDate] = useState(false)
  const [status, setStatus] = useState("")
  const [transactionDate, setTransactionDate] = useState("")



  useEffect(() => {
    const getRider = async () => {
      const res = await GetRequest(`/rider-management/${id}/shippings`, state?.token)
      if (res?.status === 200 || res?.status === 201) {
        setShippings(res?.data?.data)
      }
      
      setLoading(false)
     
    }

    if (state?.token && id) {
      getRider()
    }
  }, [])

  const handleRoute = (item:any) => {
    router.push({
      pathname: "/(org)/delivery-details",
      params: {
        id: item?.id,
        riderId: id
      }
    });
  }
   

  // 

  return (
    <View style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: 16 }}>
      <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderColor: colors.border, paddingVertical: 20 }}>

        <View>
          <DropDownPicker
            open={showDate}
            value={transactionDate}
            items={[
              { label: "All", value: "all" },
              { label: "Last month", value: "last month" },
              { label: "6 months", value: "6 months" },
              { label: "1 year", value: "1 year" },
            ]}
            setOpen={setShowDate}
            setValue={(value) => setTransactionDate(value)}
            placeholder="Date : All"
            style={{
              borderWidth: 0.8,
              borderColor: "#ccc",
              borderRadius: 25,
              paddingHorizontal: 15,
              justifyContent: "center",
              // height: 55,
              width: 150,
            }}
            dropDownContainerStyle={{
              // backgroundColor: "#f3f3f3",
              borderWidth: 1,
              elevation: 0,
              borderColor: "#ccc",
              borderTopWidth: 0,
            }}
          />
        </View>
      </View>

      {loading ? 
      <ActivityIndicator style={{ marginTop: 50 }} />
        :
        <>
          {shippings?.rideHistory?.length === 0 ?
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Image source={require("@/assets/images/empty-history.png")} alt="" style={{ height: 200, width: 200 }} />
              <Text>No past rides to show</Text>
            </View>
            :

            <FlatList
              data={shippings?.rideHistory}
              keyExtractor={(_item, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={{ marginBottom: 12 }}>
                  <Pressable
                    style={{
                      borderRadius: 12,
                      marginTop: 12,
                      marginBottom: 12,
                    }}
                    onPress={() =>handleRoute(item)}
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
                        <View
                          style={{
                            padding: 2,
                            backgroundColor: item?.status === "In transit" ? "#e8f3f9" : "#edf8ed",
                            width: 35,
                            borderRadius: 40,
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <MaterialCommunityIcons
                            name="package-variant-closed"
                            color={item?.status === "In transit" ? "#3a92cc" : "#67c261"}
                            size={29}
                          />
                        </View>
                        <View>
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              gap: 12,
                            }}
                          >
                            <Text
                              style={{
                                fontSize: s(14),
                                fontFamily:"interMedium",
                              }}
                            >
                              {item?.packageDetails?.name}
                            </Text>
                            {item?.status === "In transit" && <TransitBadge />}
                          </View>

                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              gap: 4,
                              marginTop: 5,
                            }}
                          >
                            <Text
                              style={{
                                color: "gray",
                                fontSize: 14,
                              }}
                            >
                              {moment(item?.actualDeliveryTime).format("lll")}
                            </Text>
                          </View>
                        </View>
                      </View>

                      {/* <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Text
              style={{
                fontSize: 15,
              }}
            >
              {number}
            </Text> */}
                      <MaterialIcons name="keyboard-arrow-right" size={20} />
                      {/* </View> */}
                    </View>
                  </Pressable>
                </View>
              )}
              contentContainerStyle={{
                backgroundColor: "white",
                marginTop: 20,
              }}
              showsVerticalScrollIndicator={false}
              ListFooterComponent={<View style={{ marginBottom: 50 }}></View>}
            />
          }

        </>
      }
    </View>
  );
};

export default RiderHistory;
