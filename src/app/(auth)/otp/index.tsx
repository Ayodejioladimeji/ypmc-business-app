import React, { useContext, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { AntDesign } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Href, router, useLocalSearchParams } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { CustomButton, OtpInput } from "@/components";
import TopNavigation from "@/components/TopNavigation";
import { GetRequest, PostRequest } from "@/utils/requests";
import { toast } from "sonner-native";
import { DataContext } from "@/store/GlobalState";
import { s } from "react-native-size-matters";
import { colors, spacing } from "@/theme";
import { storeData, storeToken } from "@/utils/helper";
import { ACTIONS } from "@/store/Actions";
import { OneSignal } from "react-native-onesignal";
import * as Device from "expo-device";
import * as Network from "expo-network";

const schema = z.object({
  otp: z.string(),
});

type FormData = z.infer<typeof schema>;

const OtpScreen = () => {
  const { email } = useLocalSearchParams();
  const [loading, setLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const { state, dispatch } = useContext(DataContext)
  const { deviceInfo } = state
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null)
  const inputRefs = useRef<Array<TextInput | null>>([
    null,
    null,
    null,
    null,
    null,
    null,
  ]);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      otp: "",
    },
    mode: "onSubmit",
  });

  useEffect(() => {
    // AsyncStorage.clear()

    const getData = async () => {
      OneSignal.initialize(process.env.EXPO_PUBLIC_ONESIGNAL_APP_ID);

      OneSignal.Notifications.requestPermission(true);

      // const id = await OneSignal.User.getOnesignalId();

      const deviceToken = await OneSignal.User.pushSubscription.getIdAsync();
      // const deviceToken = await OneSignal.User.pushSubscription.getTokenAsync();
      const ipAddress = await Network.getIpAddressAsync()
      const model = Device?.deviceName;
      const osVersion = Device?.osVersion;
      const appVersion = "1.0.0"

      const data = {
        deviceToken,
        ipAddress,
        model,
        osVersion,
        appVersion
      }

      dispatch({ type: ACTIONS.DEVICE_INFO, payload: data })

    }

    getData()
  }, [])


  const handleOtpChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;

    const newOtpValues = [...otpValues];
    newOtpValues[index] = value;
    setOtpValues(newOtpValues);

    // Update form value
    form.setValue("otp", newOtpValues.join(""));

    // Auto focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // If all filled, dismiss keyboard
    if (newOtpValues.every((v) => v) && value) {
      Keyboard.dismiss();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !otpValues[index] && index > 0) {
      const newOtpValues = [...otpValues];
      newOtpValues[index - 1] = "";
      setOtpValues(newOtpValues);
      form.setValue("otp", newOtpValues.join(""));
      inputRefs.current[index - 1]?.focus();
    }
  };


  const onSubmit = async (data: FormData) => {

    setLoading(true)

    const payload = {
      email: email,
      otp: data?.otp,
      deviceToken: deviceInfo?.deviceToken,
      platform: Platform.OS,
      deviceInfo: {
        model: deviceInfo?.model,
        osVersion: deviceInfo?.osVersion,
        appVersion: deviceInfo?.appVersion
      },
      ipAddress: deviceInfo?.ipAddress
    }

    const res = await PostRequest('/auth/verify-otp', payload)
    if (res?.status === 200 || res?.status === 201) {
      await storeToken('token', res?.data?.data?.accessToken)
      dispatch({ type: ACTIONS.TOKEN, payload: res?.data?.data?.accessToken })
      await storeData('role', res?.data?.data?.userRole)

      toast.success(res?.data?.message, {
        duration: 2000,
      });

      if (res?.data?.data?.userRole === "PARTNER") {
        // router.replace("/(org)/(tabs)/home");
        router.replace("/(auth)/org/additional-details");
      } else {
        const response = await GetRequest("/rider/profile", res?.data?.data?.accessToken)
        if (response?.status === 200 || response?.status === 201) {

          const user = response?.data?.data
          if (user?.partnerAssociations && user?.partnerAssociations?.length > 0) {
            router.replace('/(rider)/home')
          }
          else {
            router.replace("/(auth)/rider/additional-details");
          }
        }
      }
    }
    setLoading(false)


  };

  const resendOtp = async () => {
    setResendLoading(true)

    const payload = {
      email
    }

    const res = await PostRequest('/auth/send-otp', payload)
    if (res?.status === 200 || res?.status === 201) {
      toast.success(res?.data?.message);
    }

    setResendLoading(false)
    dispatch({ type: ACTIONS.SIGNUP_DATA, payload: null })
  }



  return (
    <SafeAreaView style={styles.container}>
      <TopNavigation title="" />

      <View>
        <View>
          <Text
            style={{ fontSize: 24, textAlign: "center", fontWeight: "500" }}
          >
            OTP Verification
          </Text>
          <Text
            style={{
              color: "#636363",
              textAlign: "center",
              fontSize: 12,
              marginTop: 10,
            }}
          >
            Enter the verification pin sent to{" "}
            <Text style={{ color: "#000000", fontWeight: 500 }}>
              ({email})
            </Text>
          </Text>
        </View>

        <Form {...form}>
          <View style={styles.wrapper}>
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <View style={styles.otpContainer}>
                    {otpValues.map((digit, index) => (
                      <TextInput
                        key={index}
                        ref={(ref) => (inputRefs.current[index] = ref)}
                        style={[
                          styles.otpInput,
                          form.formState.errors.otp && styles.otpInputError,
                          focusedIndex === index && { borderColor: colors.primary }
                        ]}
                        maxLength={1}
                        keyboardType="number-pad"
                        value={digit}
                        onChangeText={(value) => handleOtpChange(value, index)}
                        onKeyPress={(e) => handleKeyPress(e, index)}
                        selectTextOnFocus
                        autoComplete="one-time-code"
                        textContentType="oneTimeCode"
                        returnKeyType={index === 5 ? "done" : "next"}
                        onFocus={() => setFocusedIndex(index)}
                        onBlur={() => setFocusedIndex(null)}
                      />
                    ))}
                  </View>
                  <FormMessage />
                </FormItem>
              )}
            />
          </View>


          <CustomButton
            style={{ width: "100%", marginTop: 50 }}
            icon={
              loading ? <ActivityIndicator /> :
                <AntDesign name="arrowright" size={18} color="white" />
            }
            title="Verify & Proceed"
            onPress={form.handleSubmit(onSubmit)}
            disabled={loading || resendLoading}
          />

          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 20,
            }}
          >
            <Text
              style={{
                fontSize: s(12),
              }}
            >
              Didnt receive any OTP?{" "}
            </Text>
            <Pressable style={{ flexDirection: 'row', columnGap: 5 }}
              onPress={resendOtp}>
              <Text
                style={{
                  fontSize: s(13),
                  color: "#F97216",
                  textDecorationLine: "underline",
                }}
              >
                Resend OTP
              </Text>
              {resendLoading && <ActivityIndicator color={colors.primary} />}
            </Pressable>
          </View>
        </Form>

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 18,
    paddingVertical: 10,
  },
  headerText: {
    textAlign: "center",
    color: "#000000",
  },
  wrapper: {
    width: "100%",
    marginTop: 40,
    gap: 10,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: spacing.sm,
  },
  otp: {
    marginTop: 50,
    marginBottom: 50,
  },
  otpInput: {
    width: 50,
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    textAlign: 'center',
    fontSize: 20,
    backgroundColor: '#fff',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.15,
        shadowRadius: 2,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  otpInputError: {
    borderColor: "red",
  },
});

export default OtpScreen;
