import React, { forwardRef, useCallback, useContext, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { AntDesign, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetScrollView,
  SCREEN_HEIGHT,
} from "@gorhom/bottom-sheet";
import { zodResolver } from "@hookform/resolvers/zod";
import { useHeaderHeight } from "@react-navigation/elements";
import { useRouter } from "expo-router";
import { Controller, useForm, useWatch } from "react-hook-form";
import DropDownPicker from "react-native-dropdown-picker";
import { SharedValue, useSharedValue } from "react-native-reanimated";
import { z } from "zod";
import { BankIcon } from "@/assets/images/svgs";
import { ErrorText } from "@/components/ErrorText";
import { Input } from "@/components/Input";
import { ACTIONS } from "@/store/Actions";
import { DataContext } from "@/store/GlobalState";
import { colors, spacing } from "@/theme";
import { PostRequest } from "@/utils/requests";
import { banks } from "@/constants/banks";
import { verifyAccountNumber } from "@/lib/verify-account";
import { toast } from "sonner-native";
import VerifyBank from "./verify-bank";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type CardProps = {
  index: SharedValue<number>;
  position: SharedValue<number>;
};

const schema = z
  .object({
    bankName: z
      .string()
      .min(1, "Select your bank") // Ensures it's not empty
      .refine((value) => value !== "Select bank", {
        message: "Select your bank",
        path: ["bankName"],
      }),

    accountNumber: z
      .string()
      .min(10, "Account number must be 10 digits")
      .max(10, "Account number must be 10 digits")
      .regex(/^\d{10}$/, "Account number must contain only numbers"),
  });

type FormData = z.infer<typeof schema>;

const AddBank = forwardRef<BottomSheetModal, CardProps>(
  ({ index, position }, ref) => {
    const { state, dispatch } = useContext(DataContext);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const headerHeight = useHeaderHeight();
    const [dropdown, setDropdown] = useState(false);
    const [payload, setPayload] = useState<any>(null)
    const [code, setCode] = useState("")
    const { bottom: bottomSafeArea } = useSafeAreaInsets();
    const verifySheetRef = useRef<BottomSheetModal>(null);
    const verifySheetIndex = useSharedValue<number>(0);
    const verifySheetPosition = useSharedValue<number>(SCREEN_HEIGHT);
    const [snapPoints, setSnapPoints] = useState(["70%"]);

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
        setSnapPoints(["70%"]);
        if (ref && "current" in ref && ref.current) {
          ref.current.snapToIndex(0);
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

      if (ref && "current" in ref && ref.current) ref.current.dismiss();
      verifySheetRef.current?.present()

    };

    //
    const closeSheet = () => {
      setPayload(null)
      reset()
      if (ref && "current" in ref && ref.current) ref.current.dismiss();
    };

    // verify account
    const handleVerify = async (data: FormData) => {
      if (data.accountNumber.length !== 10 || !code) return;

      setLoading(true)
      const res = await verifyAccountNumber(data?.accountNumber, code)

      if (res?.success) {
        const datapayload = {
          accountName: res?.accountName,
          accountNumber: data?.accountNumber,
          bankName: data?.bankName,
          bankCode: code
        }

        setPayload(datapayload)
        toast.success("Account verified successfully")
        
      }
      else {
        toast.error(res?.message)
        setPayload(null)
      }
      setLoading(false)

    }

    const accountNumber = useWatch({ control, name: "accountNumber" });
    const bankName = useWatch({ control, name: "bankName" });

    useEffect(() => {
      if (accountNumber?.length === 10) {
        handleVerify({ accountNumber, bankName });
      } else {
        setPayload(null);
      }
    }, [accountNumber]);

    useEffect(() => {
      if (bankName && accountNumber?.length === 10) {
        handleVerify({ accountNumber, bankName });
      }
    }, [bankName]);

    return (
      <>
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
          enableContentPanningGesture={false}
          // enableHandlePanningGesture={false}
        // index={1}
        >
          <BottomSheetScrollView
            contentContainerStyle={{ paddingBottom: bottomSafeArea + 44 }}
            keyboardDismissMode="interactive"
            keyboardShouldPersistTaps="handled"
            style={styles.scrollView}
          >
            <View style={styles.textStyle}>
              <Text style={{ fontSize: 16, fontWeight: 500 }}>New Withdrawal Method</Text>
              <TouchableOpacity onPress={closeSheet}>
                <Feather name="x" size={24} color={colors.primary} />
              </TouchableOpacity>
            </View>

            <View style={styles.container}>

              <Controller
                control={control}
                name="bankName"
                render={({ field: { onChange, value } }) => (
                  <>
                    <View style={styles.cardBox}>
                      <MaterialCommunityIcons name="bank-outline" size={20} color="black" />
                      <Text
                        style={{ fontSize: 16 }}
                      >
                        Bank Name
                      </Text>
                    </View>

                    <DropDownPicker
                      open={dropdown}
                      value={value}
                      items={banks}
                      setOpen={setDropdown}
                      setValue={(callback) => {
                        const newValue = callback(value);
                        onChange(newValue);
                        const selectedBank = banks.find((bank) => bank.value === newValue);

                        if (selectedBank) {
                          setCode(selectedBank.code);
                        }
                      }}
                      // disabled={payload !== null}
                      placeholder="Select bank"
                      style={{
                        borderWidth: 0.8,
                        borderColor: "#ccc",
                        borderRadius: 10,
                        padding: 15,
                        justifyContent: "center",
                        height: 55,
                        width: "100%",
                      }}
                      dropDownContainerStyle={{
                        borderWidth: 1,
                        elevation: 0,
                        borderColor: colors.muted,
                      }}
                    />
                  </>
                )}
              />
              {errors.bankName && <ErrorText message={errors.bankName.message} />}

              <Controller
                control={control}
                name="accountNumber"
                render={({ field: { onChange, value } }) => (
                  <Input
                    variant="filled"
                    label="Account Number"
                    keyboardType="phone-pad"
                    placeholder="Enter 10 digits account number"
                    value={value}
                    onChangeText={onChange}
                  // editable={payload === null}

                  />
                )}
              />
              {errors.accountNumber && (
                <ErrorText message={errors.accountNumber.message} />
              )}

              {
                loading ?
                  <TouchableOpacity activeOpacity={0.7} style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-end' }}>
                    <ActivityIndicator size="small" />
                    <Text>Verifying Account</Text>
                  </TouchableOpacity>

                  : payload ? <Text style={{ alignSelf: 'flex-end', textDecorationLine: 'underline' }}>{payload?.accountName}</Text> : ""
              }


              {/* Add Bank Button */}
              <TouchableOpacity
                disabled={loading || !payload}
                style={[styles.button, { backgroundColor: !payload ? "gray" : "black" }]}
                onPress={handleSubmit(onSubmit)}

              >
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>

              <View
                style={{
                  flexDirection: "row",
                  backgroundColor: "#FEE4E2",
                  borderRadius: 25,
                  paddingVertical: 15,
                  gap: 10,
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 25,
                }}
              >
                <AntDesign name="exclamationcircleo" size={17} color="black" />
                <Text style={{ color: "#FEE4E2 " }}>
                  Please enter valid bank account details
                </Text>
              </View>
            </View>
          </BottomSheetScrollView>

        </BottomSheetModal>

        <VerifyBank
          ref={verifySheetRef}
          index={verifySheetIndex}
          position={verifySheetPosition}
          payload={payload}
        />
      </>
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

  scrollView: {
    flex: 1
  },
  cardBox: {
    alignItems: "center",
    flexDirection: "row",
    columnGap: 5,
    marginBottom: 8,
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

export default AddBank;
