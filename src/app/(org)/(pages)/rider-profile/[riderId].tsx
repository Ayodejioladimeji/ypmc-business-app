import React, { useContext, useEffect, useState } from "react";
import { ActivityIndicator, TextInput, TouchableOpacity, View } from "react-native";

import { router, useLocalSearchParams } from "expo-router";
import { ScrollView } from "react-native-gesture-handler";

import { CustomButton} from "@/components";
import Rider from "./_components/Rider";
import RiderInfo from "./_components/RiderInfo";
import RideHistoryList from "./_components/RideHistoryList";
import { GetRequest, PostRequest } from "@/utils/requests";
import { DataContext } from "@/store/GlobalState";
import { colors } from "@/theme";
import { Text } from "@/components/ui";
import { s } from "react-native-size-matters";
import CustomModal from "@/components/ui/modal";
import ActiveShipment from "./_components/ActiveShipment";
import { ACTIONS } from "@/store/Actions";
import UseChat from "../../chat/_components/use-chat";


const RiderProfile = () => {
  const { riderId } = useLocalSearchParams();
  const [rider, setRider] = useState<any>(null)
  const { state, dispatch } = useContext(DataContext)
  const [loading, setLoading] = useState(true)
  const [removeRider, setRemoveRider] = useState(false)
  const [isFocused, setIsFocused] = useState(false);
  const [removeLoading, setRemoveLoading] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const [callback, setCallback] = useState(false)
  const [riderStatus, setRiderStatus] = useState("")



  useEffect(() => {
    const getRider = async () => {
      const res = await GetRequest(`/rider-management/${riderId}/shippings`, state?.token)
      if (res?.status === 200 || res?.status === 201) {
        setRider(res?.data?.data)
        dispatch({type:ACTIONS.RIDER, payload:res?.data?.data})
        setRiderStatus(res?.data?.data?.partnerAssociations)
      }
      setLoading(false)
    }

    if (riderId && state?.token) {
      getRider()
    }
  }, [callback])


  const handleBlock = async() => {
    setRemoveLoading(true)

    const payload = {
      isBlocked: riderStatus === 'BLOCKED' ? false : true
    }

    const res = await PostRequest(`/rider-management/block-unblock/${riderId}`, payload, state?.token)
    if(res?.status === 200 || res?.status === 201){

      setCallback(!callback)
      setRemoveRider(false)
      setInputValue("")
    }
    setRemoveLoading(false)
  }

  // 

  return (
    <>
      <UseChat riderId={riderId}/>
      <ScrollView style={{ flex: 1, backgroundColor: 'white' }} showsVerticalScrollIndicator={false}>
        {loading ? <ActivityIndicator style={{ marginTop: 50 }} />
          :
          <>
            <View style={{ marginTop: 4, gap: 4 }}>
              <Rider riderDetails={rider} riderId={rider?.id} />
              <RiderInfo riderDetails={rider} />

              {rider?.activeShipments?.length > 0 &&
                <ActiveShipment
                  data={rider}
                />}

              {rider?.rideHistory?.length > 0 &&
                <RideHistoryList
                  backgroundColor="white"
                  padding={16}
                  rider={rider}
                />}
            </View>

            <View
              style={{ backgroundColor: "white", paddingHorizontal: 24, paddingTop: 20, paddingBottom: 50}}
            >
              <TouchableOpacity onPress={() => setRemoveRider(true)} style={{ padding: 20, borderRadius: 30, alignItems: 'center', marginTop: 16, backgroundColor: "white", borderWidth: 1, borderColor: colors.border }}>
                <Text style={{ color: 'red', fontFamily: 'interMedium', fontSize: s(13) }}>{riderStatus === "BLOCKED" ? "Unblock" : "Block"} rider</Text>
              </TouchableOpacity>
            </View>

            {/* modal */}
            <CustomModal
              visible={removeRider}
              onClose={() => setRemoveRider(false)}
            >

              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <Text style={{ fontWeight: "bold", fontSize: 18 }}>
                  Are you sure?
                </Text>
                <Text
                  style={{ color: "gray", fontSize: s(14), textAlign: "center" }}
                >
                  Are you sure you want to {riderStatus === 'BLOCKED' ? 'Unblock' : 'block'} this rider? This action cannot
                  be undone.
                </Text>

                <TextInput
                  style={{
                    backgroundColor: "#f3f3f3",
                    height: 70,
                    width: "100%",
                    margin: 12,
                    padding: 10,
                    borderRadius: 10,
                    borderColor: isFocused ? "#f97216" : "rgba(99, 99, 99, 0.5)",
                    borderWidth: isFocused ? 1 : 0
                  }}
                  multiline
                  placeholder="Add a reason for removal"
                  placeholderTextColor='gray'
                  autoFocus={true}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  value={inputValue}
                  onChangeText={(text) => setInputValue(text)}

                />

                <CustomButton
                  title={`Yes, ${riderStatus === 'BLOCKED' ? "Unblock" : "Block"}`}
                  onPress={handleBlock}
                  style={{ marginTop: 16, backgroundColor: "red", borderRadius: 40 }}
                  icon={removeLoading && <ActivityIndicator color="white"/>}
                  disabled={inputValue === ""}
                />
              </View>
            </CustomModal>

          </>
        }
      </ScrollView>

    </>
  );
};

export default RiderProfile;
