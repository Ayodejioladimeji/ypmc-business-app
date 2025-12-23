import React from "react";
import { Pressable, ScrollView, View } from "react-native";

import { AntDesign } from "@expo/vector-icons";
import { Controller } from "react-hook-form";

import {
  CustomButton,
  ErrorText,
  Input,
  LinkWithLabel,
  Tooltip,
} from "@/components";
import { Text } from "@/components/ui";
import { s } from "react-native-size-matters";
import { useRouter } from "expo-router";
import { storeData } from "@/utils/helper";

export const AdditionalDetails = () => {

const router = useRouter()

  const handleRoute = async () => {
    await storeData("kyc", "false")
    router.push("/(auth)/rider/upload-profile-photo")
  }
 
// 

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={{ paddingHorizontal: 16, paddingVertical: 20 }}>
        <Pressable 
          onPress={handleRoute}
        style={{ flexDirection: 'row', alignSelf: 'flex-end', marginRight: 10, marginTop:20 }}>
          <Text style={{fontWeight:'bold'}}>Skip</Text>
          <AntDesign name="arrowright" size={18} color="#000" />
        </Pressable>

        <View style={{ marginTop: 32, gap: 10, marginBottom: 40 }}>
          <Text style={{ fontWeight: 500, fontSize: s(22) }}>
            Provide additional details
          </Text>
          <Text style={{ fontSize: 18, color: "gray" }}>
            Help us complete your profile with a few more details.
          </Text>
        </View>

        <LinkWithLabel
          onPress={() => router.push("/(auth)/rider/business-hours")}
          label="When do you operate? (optional)"
          icon="clock"
          text="Set business hours"
        />

        <LinkWithLabel
          onPress={() => router.push("/(auth)/rider/delivery-rate")}
          label="Delivery rate (optional)"
          icon="naira-sign"
          text="Set delivery rate"
        />

        <CustomButton
          style={{ gap: 5, marginTop: 30 }}
          title="Next"
          icon={<AntDesign name="arrowright" size={18} color="white" />}
          onPress={handleRoute}
        />
      </View>
    </ScrollView>
  );
};
