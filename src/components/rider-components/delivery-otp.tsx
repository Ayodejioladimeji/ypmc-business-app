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
import { PostRequest } from "@/utils/requests";
import { toast } from "sonner-native";
import { DataContext } from "@/store/GlobalState";
import { s } from "react-native-size-matters";
import { colors, spacing } from "@/theme";
import { storeToken } from "@/utils/helper";
import { ACTIONS } from "@/store/Actions";

const schema = z.object({
  otp: z.string().min(4, {
    message: "Provide input code",
  }),
});

type FormData = z.infer<typeof schema>;

const DeliveryOtp = () => {
  const { email } = useLocalSearchParams();
  const [loading, setLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const { state, dispatch } = useContext(DataContext)
  const { order } = state
  const [otpValues, setOtpValues] = useState(["", "", "", ""]);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null)
  const inputRefs = useRef<Array<TextInput | null>>([null, null, null, null]);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      otp: "",
    },
    mode: "onSubmit",
  });



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
      deliveryCode: data?.otp
    }

    const res = await PostRequest(`/shipping/${order?.id}/mark-delivered`, payload, state?.token)
    if (res?.status === 200 || res?.status === 201) {
       dispatch({ type: ACTIONS.CALLBACK, payload: !state?.callback })
      dispatch({type:ACTIONS.DELIVERED, payload:true})
      dispatch({type:ACTIONS.EARNINGS, payload:res?.data?.data?.actualPriceInKobo})
      

      router.replace("/(rider)/home");
    }
    setLoading(false)


  };


  return (

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
                    returnKeyType={index === 4 ? "done" : "next"}
                    onFocus={() => setFocusedIndex(index)}
                    onBlur={() => setFocusedIndex(null)}
                  />
                ))}
              </View>

              <FormMessage style={{ textAlign: 'center' }} />
            </FormItem>
          )}
        />
      </View>


      <CustomButton
        style={{ width: "100%", marginTop: 40, }}
        icon={
          loading && <ActivityIndicator color="#fff" />

        }
        title="Verify"
        onPress={form.handleSubmit(onSubmit)}
        disabled={loading || resendLoading}
      />
    </Form>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 18,
    padding: 15,
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
    justifyContent: "center",
    gap: 10
  },
  otp: {
    marginTop: 50,
    marginBottom: 50,
  },
  otpInput: {
    width: 60,
    height: 60,
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

export default DeliveryOtp;
