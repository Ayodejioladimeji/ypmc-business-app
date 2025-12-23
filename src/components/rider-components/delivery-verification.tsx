import React, {
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  ActivityIndicator,
  Image,
  Keyboard,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import { Feather } from "@expo/vector-icons";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { s } from "react-native-size-matters";
import { DataContext } from "@/store/GlobalState";
import { spacing } from "@/theme";
import { Text } from "../ui";
import DeliveryOtp from "./delivery-otp";


const DeliveryVerification = () => {
  //

  return (
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#fff",
            position: "relative",
            padding: 16,
            paddingHorizontal: 16,
        borderRadius: 20,
          }}
        >

          <Text
            style={{
              fontFamily: "interSemiBold",
              fontSize: s(14),
              marginBottom: 20,
            }}
          >
            Delivery Verification
          </Text>
          <Text style={{ fontSize: s(13), textAlign: "center" }}>
            Enter the verification PIN sent to the recipient’s number to confirm delivery.
          </Text>

          <DeliveryOtp />
        </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  wrapper: {
    gap: 20,
    marginTop: spacing.xxl,
  },
  scrollView: {
    flex: 1,
  },
  shadow: {
    shadowColor: "#636363",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.9,
    shadowRadius: 25,
    elevation: 15,
  },
  scrollViewContentContainer: {
    paddingHorizontal: 16,
  },

  footerContainer: {
    marginHorizontal: 12,
    backgroundColor: "#fff",
  },

  bottomSheetContainer: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  bottomSheetContent: {
    padding: spacing.base,
  },
});

export default DeliveryVerification;
