import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  TextInput,
  View,
} from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { CustomButton, KeyboardDismissWrapper } from "@/components";
import { Text } from "@/components/ui";

const DeleteRider = () => {
  return (
    <KeyboardDismissWrapper>
      <SafeAreaView
        style={{
          height: "100%",
          padding: 12,
          backgroundColor: "black",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
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
                  style={{ color: "gray", fontSize: 16, textAlign: "center" }}
                >
                  Are you sure you want to remove this rider? This action cannot
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
                  }}
                  multiline
                  placeholder="Add a reason for removal"
                  placeholderTextColor='gray'
                />

                <CustomButton
                  title="Yes, Remove"
                  onPress={() => router.back()}
                  style={{ marginTop: 16, backgroundColor: "red" }}
                />
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </KeyboardDismissWrapper>
  );
};

export default DeleteRider;
