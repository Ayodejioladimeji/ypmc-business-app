import React, { useContext } from "react";
import { TouchableOpacity, View } from "react-native";

import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { s } from "react-native-size-matters";
import { SvgXml } from "react-native-svg";
// import { SvgXml } from "react-native-svg";
import Swiper from "react-native-swiper";

import {
  ActionOneIcon,
  ActionThreeIcon,
  ActionTwoIcon,
} from "@/assets/images/svgs";
import { heatmap, location, phoneVerify } from "@/assets/svgs";
import { DataContext } from "@/store/GlobalState";
import { GenericData } from "@/types/type";

import { Text } from "../../ui";

const OrgQuickActionsTabs = ({
  backgroundColor,
  header,
  subtitle,
  icon,
  route,
  user
}: any) => {
  return (
    <View
      style={{
        maxWidth: 350,
        padding: 24,
        backgroundColor: backgroundColor,
        borderRadius: 16,
        height: 185,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {icon}

        {route === "/kyc" && user?.isKycSubmitted ?  <AntDesign name="checkcircle" size={24} color="#4FB948" />:
        <TouchableOpacity
          style={{
            borderWidth: 1,
            borderRadius: 100,
            borderColor: "gray",
            height: 32,
            width: 32,
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => router.push(route)}
        >  
          <MaterialCommunityIcons name="arrow-right-thin" size={20} />
        </TouchableOpacity>}
      </View>

      <Text style={{ fontSize: s(14), fontWeight: "bold", marginTop: 10 }}>
        {header}
      </Text>

      <Text style={{ fontSize: s(12), marginTop: 10 }}>{subtitle}</Text>
    </View>
  );
};

export const OrgQuickActions = () => {
  const { state } = useContext(DataContext);
  const { user } = state;

  console.log(user?.metadata?.verificationStatus)

  //

  return (
    <View
      style={{
        padding: 16,
        backgroundColor: "white",
        borderRadius: 16,
        gap: 24,
        height: 290,
        marginBottom: 15,
      }}
    >
      <Text style={{ fontSize: s(15), fontWeight: "bold" }}>Quick actions</Text>

      <View style={{ flex: 1 }}>
        <Swiper
          autoplay={true}
          autoplayTimeout={10}
          dot={
            <View
              style={{
                backgroundColor: "#D8D8D8",
                width: 8,
                height: 8,
                borderRadius: 4,
                marginHorizontal: 3,
                marginTop: 10,
              }}
            />
          }
          activeDot={
            <View
              style={{
                backgroundColor: "#636363",
                width: 8,
                height: 8,
                borderRadius: 4,
                marginHorizontal: 3,
                marginTop: 10,
              }}
            />
          }
          paginationStyle={{
            bottom: 0,
          }}
        >
          {/* {QuickActionData?.filter(item => item?.show === true)?.map((item, idx) => ( */}
          
        {user?.metadata?.verificationStatus !== "VERIFIED" &&  <OrgQuickActionsTabs
            backgroundColor="#fff8f3"
            header={user?.isKycSubmitted ? "KYC Under Review" : "Verify Your Identity"}
            subtitle={user?.isKycSubmitted ? "Your documents are under review, You will be notified once verification is complete." : "Complete your KYB now to verify your account and unlock full access."}
            icon={<ActionOneIcon />}
            loading={false}
            route="/kyc"
            user={user}
          />}

          {/* <OrgQuickActionsTabs
            backgroundColor="#fff8f3"
            header="Delivery Hotspot Heatmap"
            subtitle="Visualize high-demand areas to optimize rider assignments."
            icon={<ActionTwoIcon />}
            loading={false}
            route=""
            user={user}
          /> */}

          {/* <OrgQuickActionsTabs
            backgroundColor="#f4f9fc"
            header="Manual Stationing"
            subtitle="Track your riders in real-time and station them in areas with high delivery requests."
            icon={<ActionThreeIcon />}
            loading={false}
            route=""
            user={user}
          /> */}
          {/* ))} */}
        </Swiper>
      </View>
    </View>
  );
};
