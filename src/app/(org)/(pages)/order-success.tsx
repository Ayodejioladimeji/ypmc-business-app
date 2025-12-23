import React from "react";
import { Pressable, View } from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { CustomButton, Layout } from "@/components";
import { Text } from "@/components/ui";

const OrderSuccess = () => {
  return (
    <SafeAreaView
      style={{
        height: "100%",
        padding: 12,
        backgroundColor: "black",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View
        style={{
          minHeight: 200,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "black",
        }}
      >
        <View
          style={{
            backgroundColor: "white",
            padding: 24,
            borderRadius: 20,
          }}
        >
          <Pressable
            style={{ alignItems: "flex-end" }}
            onPress={() => router.back()}
          >
            <MaterialCommunityIcons name="close" size={25} />
          </Pressable>

          <View
            style={{ justifyContent: "center", alignItems: "center", gap: 12 }}
          >
            <View
              style={{
                backgroundColor: "#edf8ed",
                height: 120,
                width: 120,
                borderRadius: 100,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <MaterialCommunityIcons name="check" size={50} color="green" />
            </View>
            <Text style={{ fontWeight: "bold", fontSize: 20 }}>
              Order accepted!
            </Text>
            <Text style={{ color: "gray", fontSize: 16, textAlign: "center" }}>
              Shipment #3455 has been successfully assigned to Rider Mike Colman
            </Text>
            <CustomButton
              title="Track shipment"
              onPress={() => router.back()}
              style={{ marginTop: 16 }}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default OrderSuccess;
