import React, { useContext, useEffect, useState } from "react";
import { ActivityIndicator, RefreshControl, ScrollView, TextInput, View } from "react-native";

import { Button } from "react-native-paper";

import { Avatar, CustomButton, Loader } from "@/components";
import { EmptyRiderList } from "@/components/rider-components";
import { Text } from "@/components/ui";
import { useApproveRiderApplicationMutation } from "@/redux/actions/org";
import { RiderProps } from "@/app/(org)/(tabs)/riders";
import { GetRequest, PostRequest } from "@/utils/requests";
import { DataContext } from "@/store/GlobalState";
import { toast } from "sonner-native";
import { s } from "react-native-size-matters";
import images from "@/assets/images";
import { Image } from "expo-image";
import { colors } from "@/theme";
import { router } from "expo-router";
import CustomModal from "@/components/ui/modal";
import { ACTIONS } from "@/store/Actions";

export const OrgPendingRequest = ({ allRiders, getRiders }: any) => {
  // const [allRiders, setAllRiders] = useState<any>([])
  const { state, dispatch } = useContext(DataContext)
  const [isLoading, setIsLoading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [declineLoading, setDeclineLoading] = useState(false)
  const [approveLoading, setApproveLoading] = useState(false)
  const [decline, setDecline] = useState(false)
  const [isFocused, setIsFocused] = useState(false);
  const [id, setId] = useState("")


  // approve rider
  const approveRider = async (riderId: string) => {
    setApproveLoading(true)

    const res = await PostRequest(`/rider-management/approve-application/${riderId}`, {}, state?.token)
    if (res?.status === 200 || res?.status === 201) {
      dispatch({type:ACTIONS.CALLBACK, payload: !state?.callback})
      toast.success(res?.data?.message)
    }
    setApproveLoading(false)
  }

  const declineRider = async () => {
    setDeclineLoading(true)

    const payload = {
      associationStatus: "REJECTED"
    }

    const res = await PostRequest(`/rider-management/update-association/${id}`, payload, state?.token)
    if (res?.status === 200 || res?.status === 201) {
      dispatch({type:ACTIONS.CALLBACK, payload: !state?.callback})
      toast.success(res?.data?.message)
    }
    setDecline(false)
    setDeclineLoading(false)
  }

  // 

  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={isLoading}
          onRefresh={getRiders}
        />
      }
    >
      {allRiders?.length > 0 && (
        <Text style={{ fontFamily: 'interSemiBold', fontSize: s(15), marginVertical: 24 }}>
          Pending requests
        </Text>
      )}

      <View>
        {allRiders?.length === 0 ? (
          <EmptyRiderList message="You have no pending requests" />
        ) : (
          // Render the list of pending requests
          allRiders?.map(
            (item: any, index: number) => (
              <View
                key={index}
                style={{
                  borderRadius: 12,
                  marginBottom: 32,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "flex-start", // allow wrapping
                    flexWrap: "wrap",
                  }}
                >
                  {/* Info Section */}
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 6,
                      flex: 1,
                      flexShrink: 1,
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
                    <View style={{ flexShrink: 1 }}>
                      <Text
                        style={{
                          fontSize: s(13),
                          fontFamily: "interSemiBold",
                          flexWrap: "wrap",
                        }}
                      >
                        {item?.fullName}
                      </Text>

                      <Text
                        style={{
                          color: "gray",
                          fontSize: 12,
                          flexWrap: "wrap",
                        }}
                      >
                        {item?.email}
                      </Text>
                    </View>
                  </View>

                  {/* Buttons Section */}
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                      marginTop: 8,
                      marginLeft: 'auto',
                    }}
                  >
                    <Button
                      style={{ backgroundColor: "#f97216" }}
                      onPress={() => {
                        approveRider(item?.riderId);
                      }}
                    >
                      {approveLoading ? <ActivityIndicator color="white" />
                        :
                        <Text style={{ fontSize: 12, color: "white" }}>Approve</Text>}
                    </Button>

                    <Button
                      style={{
                        backgroundColor: "transparent",
                        borderWidth: 1,
                        borderColor: "gray",
                      }}
                      onPress={() => {
                        setId(item?.riderId)
                        setDecline(true)
                      }}
                    >
                      <Text style={{ fontSize: 12, color: "#f97216" }}>Decline</Text>
                    </Button>
                  </View>
                </View>
              </View>

            )
          )
        )}
      </View>

      <CustomModal
        visible={decline}
        onClose={() => setDecline(false)}
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
            Are you sure you want to decline this rider? This action cannot
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
            placeholder="Add a reason for declining"
            placeholderTextColor='gray'
            autoFocus={true}

          />

          <CustomButton
            title="Yes, Decline"
            onPress={declineRider}
            style={{ marginTop: 16, backgroundColor: "red", borderRadius: 40 }}
            icon={declineLoading ? <ActivityIndicator color="white" />
              : ""}
          />
        </View>
      </CustomModal>
    </ScrollView>
  );
};

