import React, { useContext } from "react";
import { View } from "react-native";

import { ScrollView } from "react-native-gesture-handler";

import { Avatar, VerifiedCheckMark } from "@/components";
import { Text } from "@/components/ui";
import { useGetOrgDetailsQuery } from "@/redux/actions/org";
import ProfileLinks from "./_components/ProfileLinks";
import RiderManagementLinks from "./_components/RiderManagementLinks";
import PaymentLinks from "./_components/PaymentLinks";
import OthersLinks from "./_components/OthersLinks";
import AuthLinks from "./_components/AuthLinks";
import { s } from "react-native-size-matters";
import { DataContext } from "@/store/GlobalState";
import { getInitials } from "@/utils/utils";
import { Image } from "expo-image";
import images from "@/assets/images";
import { colors } from "@/theme";



const OrgProfile = () => {
  const { data } = useGetOrgDetailsQuery("");
  const { state } = useContext(DataContext)
  const { user } = state


  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          backgroundColor: "white",
          justifyContent: "center",
          alignItems: "center",
          gap: 10,
          paddingBottom: 16,
        }}
      >
        <Image
          source={user?.metadata?.companyLogoImageUrl || images?.user}
          style={{
            width: 80,
            height: 80,
            borderRadius: 50,
            borderWidth: 0.5,
            borderColor: colors.mutedForeground
          }}
          contentFit="contain"
        />


        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Text style={{ fontWeight: "bold", fontSize: 16 }}>
            {user?.user?.companyName}
          </Text>
          {data?.data?.user?.isVerified && <VerifiedCheckMark />}
        </View>
        <Text style={{ fontSize: 15 }}>{user?.user?.email}</Text>
      </View>

      <ScrollView style={{ flex: 1, gap: 12 }} showsVerticalScrollIndicator={false}>
        <View style={{ gap: 2 }}>
          <Text style={{ fontSize: s(13), padding: 12 }}>Personal</Text>
          <ProfileLinks />
        </View>

        <View style={{ gap: 2 }}>
          <Text style={{ fontSize: s(13), padding: 12 }}>Rider management</Text>
          <RiderManagementLinks />
        </View>

        {/* <View style={{ gap: 2 }}>
          <Text style={{ fontSize: s(13), padding: 12 }}>Payment</Text>
          <PaymentLinks />
        </View> */}

        <View style={{ gap: 2 }}>
          <Text style={{ fontSize: s(13), padding: 12 }}>Others</Text>
          <OthersLinks />
        </View>

        <View style={{ gap: 2 }}>
          <AuthLinks />
        </View>
      </ScrollView>
    </View>
  );
};

export default OrgProfile;
