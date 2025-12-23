import React from "react";
import { Pressable, View } from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { CustomButton, Layout } from "@/components";
import { Text } from "@/components/ui";

const OrderReject = () => {
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
            <Text style={{ fontWeight: "bold", fontSize: 18 }}>
              Are you sure?
            </Text>
            <Text style={{ color: "gray", fontSize: 16, textAlign: "center" }}>
              Are you sure you want to cancel this order? This action cannot be
              undone.
            </Text>
            <CustomButton
              title="Yes, Reject"
              onPress={() => router.back()}
              style={{ marginTop: 16, backgroundColor: "red" }}
            />
            <CustomButton
              title="No, Continue"
              bgVariant="secondary"
              textVariant="secondary"
              onPress={() => router.back()}
              style={{ marginTop: 2 }}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default OrderReject;
