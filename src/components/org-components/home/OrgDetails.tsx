import React, { useContext } from "react";
import { ActivityIndicator, Pressable, View } from "react-native";

import { router } from "expo-router";

import { VerifiedCheckMark } from "@/components";
import { Text } from "@/components/ui";
import { OrgMessages } from "./OrgMessages";
import { OrgNotifications } from "./OrgNotifications";
import { DataContext } from "@/store/GlobalState";
import { getInitials } from "@/utils/utils";
import { s } from "react-native-size-matters";
import { Image } from "expo-image";
import images from "@/assets/images";
import { colors } from "@/theme";


export const OrgDetails = () => {
  const { state } = useContext(DataContext)
  const { user } = state

  // 

  return (
    <View
      style={{
        marginTop: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: 'white',
        paddingBottom: 15,
        paddingHorizontal: 15
      }}
    >
     {state?.profileLoading ? <ActivityIndicator/>
     : 
      <Pressable
        onPress={() => router.push("/(org)/(pages)/org-profile")}
        style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
      >

          <Image
            source={user?.metadata?.companyLogoImageUrl || images?.user}
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
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Text style={{ fontWeight: "bold", fontSize: s(14) }}>
              {user?.user?.companyName}
            </Text>
            {user?.user?.isVerified && <VerifiedCheckMark />}
          </View>

          <Text style={{ color: "gray", fontSize: s(12) }}>{user?.user?.email}</Text>
        </View>
      </Pressable>}

      <View style={{ flexDirection: "row", gap: 20 }}>
        <OrgMessages />
        <OrgNotifications />
      </View>
    </View>
  );
};
