import React, {
  forwardRef,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import {
  ActivityIndicator,
  Image,
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
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";
import moment from "moment";
import { SharedValue } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { s } from "react-native-size-matters";
import { toast } from "sonner-native";

import { ACTIONS } from "@/store/Actions";
import { DataContext } from "@/store/GlobalState";
import { colors, spacing } from "@/theme";
import { PostRequest } from "@/utils/requests";
import { formatMoney } from "@/utils/utils";

import { CustomButton } from "../CustomButton";
import { Text } from "../ui";

const SNAP_POINTS = ["40%"];

const ConfirmPickup = forwardRef<BottomSheetModal>(({}, ref) => {
  const { bottom: bottomSafeArea } = useSafeAreaInsets();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { state, dispatch } = useContext(DataContext);
  const { order } = state;

  const scrollViewContentContainer = useMemo(
    () => [
      styles.scrollViewContentContainer,
      { paddingBottom: bottomSafeArea },
    ],
    [bottomSafeArea]
  );

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        enableTouchThrough={true}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    []
  );

  const closeSheet = () => {
    if (ref && "current" in ref && ref.current) ref.current.dismiss();
  };

  // handle confirm
  const confirmOrder = async () => {
    setLoading(true);

    const payload = {
      data: "",
    };

    const res = await PostRequest(
      `/shipping/${order?.id}/mark-picked-up`,
      payload,
      state?.token
    );
    if (res?.status === 200 || res?.status === 201) {
      toast.success(res?.data?.message);
      dispatch({ type: ACTIONS.ORDER_STARTED, payload: true });
      dispatch({ type: ACTIONS.CALLBACK, payload: !state?.callback })
      router.replace("/(rider)/deliver-order")
    }
    setLoading(false);
  };

  //

  return (
    <BottomSheetModal
      enableDynamicSizing={false}
      enablePanDownToClose={true}
      index={0}
      keyboardBehavior="extend"
      key="FindRider"
      ref={ref}
      snapPoints={SNAP_POINTS}
      style={styles.shadow}
      backdropComponent={renderBackdrop}
    >
      <BottomSheetScrollView
        contentContainerStyle={scrollViewContentContainer}
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="handled"
        style={styles.scrollView}
      >
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#fff",
            position: "relative",
            padding: 16,
            paddingHorizontal: 10,
          }}
        >
          <TouchableOpacity
            onPress={closeSheet}
            style={{ position: "absolute", right: 10, top: 0 }}
          >
            <Feather name="x" size={24} />
          </TouchableOpacity>

          <Image
            source={require("@/assets/images/confirm-pickup.png")}
            style={{
              height: 80,
              width: 80,
              borderRadius: 50,
              marginBottom: 30,
            }}
          />

          <Text
            style={{
              fontFamily: "interSemiBold",
              fontSize: s(14),
              marginBottom: 20,
            }}
          >
            Confirm Pickup?
          </Text>
          <Text style={{ fontSize: s(13), textAlign: "center" }}>
            Confirm you’ve picked up the package to start the delivery.
          </Text>

          <CustomButton
            title="Confirm"
            onPress={confirmOrder}
            style={{
              flex: 1,
              paddingVertical: 20,
              borderRadius: 50,
              marginTop: 50,
            }}
            icon={loading && <ActivityIndicator color="#fff" size="small" />}
          />
        </View>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
});

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

export default ConfirmPickup;
