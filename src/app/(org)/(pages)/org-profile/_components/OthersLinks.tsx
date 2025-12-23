import React from "react";
import { Switch, TouchableOpacity, View } from "react-native";

import {
  FontAwesome6,
  Ionicons,
  MaterialCommunityIcons,
  SimpleLineIcons,
} from "@expo/vector-icons";

import { Text } from "@/components/ui";
import { s } from "react-native-size-matters";
import { useRouter } from "expo-router";

 const OthersLinks = () => {
  const router = useRouter()

  const accountLinks = [
    // {
    //   icon: <MaterialCommunityIcons name="account-circle-outline" size={20} />,
    //   label: "About YPMC Business",
    //   link:""
    // },
    {
      icon: <Ionicons name="time-outline" size={20} />,
      label: "Help and Support",
      link:"/support"
    },
  ];

  return (
    <View
      style={{
        backgroundColor: "white",
        padding: 14,
        paddingBottom:0,
        gap: 4,
      }}
    >
      {accountLinks.map((option, index) => (
        <TouchableOpacity onPress={() => router.push(option.link)}
          key={index}
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingVertical: 16,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 18 }}>
            {option.icon}
            <Text style={{ fontSize: s(13), fontWeight: 500 }}>
              {option.label}
            </Text>
          </View>
          <SimpleLineIcons name="arrow-right" size={12} />
        </TouchableOpacity>
      ))}

      {/* <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flexDirection: "row", gap: 12, marginTop: 16 }}>
          <Ionicons name="scan-circle-outline" size={22} />
          <View style={{ maxWidth: 250, gap: 10 }}>
            <Text style={{ fontSize: s(13), fontWeight: 500 }}>Biometrics</Text>
            <Text style={{ fontSize: s(12), lineHeight: 24 }}>
              Use Face ID for payments authentication
            </Text>
          </View>
        </View>
        <Switch
          trackColor={{ false: "black", true: "#f97216" }}
          //   thumbColor={isEnabled ? "white" : "white"}
          //   ios_backgroundColor="#3e3e3e"
          //   onValueChange={toggleSwitch}
          //   value={isEnabled}
        />
      </View> */}
    </View>
  );
};

export default OthersLinks