import React, { useCallback, useContext, useState } from "react";
import { Pressable, TouchableOpacity, View } from "react-native";

import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";


import { Text } from "../ui";
import { Image } from "expo-image";
import { colors } from "@/theme";
import { s } from "react-native-size-matters";
import { DataContext } from "@/store/GlobalState";

export const VerifyIdCard = () => {
  const {state} = useContext(DataContext)
  const {user} = state

  // 

  return (
    <View
      style={{
        paddingVertical:20 ,
        paddingHorizontal:15 ,
        backgroundColor: "#fff8f3",
        borderRadius: 16,
        gap: 12,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
      <Image source={require("@/assets/images/kyc-mobile.png")} alt="" style={{height:50, width:50}}/>
        {!user?.user?.isKycSubmitted ? 
        <TouchableOpacity
          onPress={() => router.push("/(rider)/kyc")}
          style={{
            borderWidth: 1,
            borderRadius: 100,
            borderColor: "gray",
            height: 28,
            width: 28,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <MaterialCommunityIcons name="arrow-right-thin" size={20} />
        </TouchableOpacity>
        :
          <AntDesign name="checkcircle" size={24} color="#4FB948" />
        }
      </View>

      <Text style={{ fontSize: s(14), fontFamily:'interBold', color:colors.primary }}>
        {user?.user?.isKycSubmitted ? "KYC Under Review": "Verify Your Identity"}
      </Text>

      {user?.user?.isKycSubmitted ? <Text style={{ fontSize: s(13) }}>
        Your documents are under review, You will be notified once verification is complete. 
      </Text>
      :
      <Text style={{ fontSize: s(13) }}>
        Complete your KYC now to verify your account and unlock full access.
      </Text>}
    </View>
  );
};
