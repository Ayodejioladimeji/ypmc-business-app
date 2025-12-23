import React, { forwardRef, useCallback, useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { AntDesign, Feather } from "@expo/vector-icons";
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { zodResolver } from "@hookform/resolvers/zod";
import { useHeaderHeight } from "@react-navigation/elements";
import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import DropDownPicker from "react-native-dropdown-picker";
import { SharedValue } from "react-native-reanimated";
import { z } from "zod";
import { BankIcon, LockIcon } from "@/assets/images/svgs";
import { ErrorText } from "@/components/ErrorText";
import { Input } from "@/components/Input";
import { ACTIONS } from "@/store/Actions";
import { DataContext } from "@/store/GlobalState";
import { colors, spacing } from "@/theme";
import { PostRequest } from "@/utils/requests";
import { banks } from "@/constants/banks";
import { toast } from "sonner-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type CardProps = {
  index: SharedValue<number>;
  position: SharedValue<number>;
  payload: any
};

const schema = z.object({
  password: z.string().min(8, {
    message: "Password must be at least 8 characters long",
  }),
})

type FormData = z.infer<typeof schema>;

const VerifyBank = forwardRef<BottomSheetModal, CardProps>(
  ({ index, position, payload }, ref) => {
    const { state, dispatch } = useContext(DataContext);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const headerHeight = useHeaderHeight();
    const [snapPoints, setSnapPoints] = useState(["50%", "70%"]);
    const { bottom: bottomSafeArea } = useSafeAreaInsets();

    const {
      reset,
      control,
      handleSubmit,
      formState: { errors },
    } = useForm<FormData>({
      resolver: zodResolver(schema),
    });

    useEffect(() => {
      const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
        setSnapPoints(["70%"]);
        if (ref && "current" in ref && ref.current) {
          ref.current.expand();
        }
      });

      const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
        setSnapPoints(["50%", "70%"]);
        if (ref && "current" in ref && ref.current) {
          ref.current.snapToIndex(0); // Moves it back to 50%
        }
      });

      return () => {
        showSubscription.remove();
        hideSubscription.remove();
      };
    }, [ref]);

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

    // handle submit
    const onSubmit = async (data: FormData) => {
      setLoading(true);

      const datapayload = {
        password: data?.password,
        ...payload
      }

      const res = await PostRequest("/bank-accounts/partner", datapayload, state?.token);
      if (res?.status === 200 || res?.status === 201) {
        dispatch({ type: ACTIONS.CALLBACK, payload: !state?.callback });

        if (ref && "current" in ref && ref.current) ref.current.dismiss();
        toast.success(res?.data?.message)
        reset()
      }
      setLoading(false);
    };

    //
    const closeSheet = () => {
      if (ref && "current" in ref && ref.current) ref.current.dismiss();
    };

    return (
      <BottomSheetModal
        animatedIndex={index}
        animatedPosition={position}
        enableDismissOnClose={true}
        enablePanDownToClose={true}
        key="TimelineSheet"
        ref={ref}
        snapPoints={snapPoints}
        style={styles.shadow}
        topInset={headerHeight}
        backdropComponent={renderBackdrop}
      // index={1}
      >
        <BottomSheetScrollView
          contentContainerStyle={{ paddingBottom: bottomSafeArea + 44 }}
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="never"
          style={{ flex: 1 }}
        >
          <View style={styles.textStyle}>
            <Text style={{ fontSize: 16, fontWeight: 500 }}>Verification</Text>
            <TouchableOpacity onPress={closeSheet}>
              <Feather name="x" size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.container}>

            <View style={styles.cardBox}>
              <LockIcon />
              <Text
                style={{ fontSize: 16 }}
              >
                Password
              </Text>
            </View>

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  placeholder="Enter your password"
                  value={value}
                  secureTextEntry
                  onChangeText={onChange}
                  style={{ borderBottomWidth: 1, borderColor: colors.mutedForeground, paddingVertical: 20 }}
                />
              )}
            />
            {errors.password && (
              <ErrorText message={errors.password.message} />
            )}

            <View
              style={{
                flexDirection: "row",
                gap: 10,
                alignItems: "center",
                marginTop: 5,
              }}
            >
              <AntDesign name="exclamationcircleo" size={13} color="black" />
              <Text style={{ color: colors.mutedForeground }}>
                Not less than 6 characters.
              </Text>
            </View>

            {/* Add Bank Button */}
            <TouchableOpacity
              activeOpacity={0.7}
              disabled={loading}
              style={styles.button}
              onPress={handleSubmit(onSubmit)}
            >
              <Text style={styles.buttonText}>Confirm</Text>
              {loading && <ActivityIndicator color="white" size="small" />}
            </TouchableOpacity>
          </View>
        </BottomSheetScrollView>


      </BottomSheetModal>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    justifyContent: "center",
  },
  cardBox: {
    alignItems: "center",
    flexDirection: "row",
    columnGap: 5,
    marginBottom: 10,
  },
  cardLabel: {
    fontSize: 16,
    color: colors.mutedForeground,
  },
  label: {
    fontSize: 16,
    color: colors.mutedForeground,
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#f5f5f5",
    height: 48,
    paddingHorizontal: 16,
    borderRadius: 8,
    fontSize: 16,
    color: "#333",
    marginBottom: 16,
  },
  inputError: {
    borderColor: "red",
    borderWidth: 1,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rowItem: {
    flex: 1,
    marginRight: 8,
  },
  cardLogosContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    marginBottom: 20,
  },
  cardLogo: {
    height: 30,
    resizeMode: "contain",
  },
  button: {
    marginTop: 24,
    backgroundColor: "#000",
    borderRadius: 20,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  error: {
    color: "red",
    fontSize: 12,
    marginTop: -10,
    marginBottom: 8,
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
  textStyle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
  },
});

export default VerifyBank;
