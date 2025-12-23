import React, { useContext, useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  Text,
  ActivityIndicator
} from "react-native";

import { AntDesign } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { router, useLocalSearchParams } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";

import {
  CustomButton,
  ErrorText,
  Input,
} from "@/components";
import {
  useResendOtpMutation,
  useResetPasswordMutation,
} from "@/redux/actions/org";
import TopNavigation from "@/components/TopNavigation";
import { s } from "react-native-size-matters";
import { PostRequest } from "@/utils/requests";
import { toast } from "sonner-native";
import { DataContext } from "@/store/GlobalState";

const schema = z
  .object({
    otp: z.string().min(6, { message: "OTP must be 6 characters" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string().min(8, { message: "Password must be at least 8 characters" }),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match",
        path: ["confirmPassword"], // Assign error to confirmPassword
      });
    }
  });

type FormData = z.infer<typeof schema>;

const CreateNewPassword = () => {
  const { email } = useLocalSearchParams();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onSubmit",
  });

  const [buttonLoading, setButtonLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const { state } = useContext(DataContext)


  async function onSubmit(data: z.infer<typeof schema>) {
    setButtonLoading(true)

    const payload = {
      newPassword: data?.password,
      otp: data.otp,
    }

    console.log(payload)

    const res = await PostRequest("/auth/reset-password", payload)
    if (res?.status === 200 || res?.status === 201) {
      toast.success(res?.data?.message)
      router.replace("/(auth)/sign-in")
    }

    setButtonLoading(false)

  }

  // resend OTP
  const handleResend = async () => {
    setResendLoading(true)

    const payload = {
      email
    }

    const res = await PostRequest("/auth/send-otp", payload, state?.token)
    if (res?.status === 200 || res?.status === 201) {
      toast.success(res?.data?.message)
    }
    setResendLoading(false)
  }



  return (
    <SafeAreaView style={styles.container}>
      <TopNavigation title="" />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >

        <View>
          <Text style={styles.headerText}>Update your password</Text>

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <Input
                label="New password"
                placeholder="Enter password"
                value={value}
                onChangeText={onChange}
                secureTextEntry={true}
              />
            )}
          />
          {errors.password && (
            <ErrorText message={errors.password.message} />
          )}

          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Confirm password"
                placeholder="Enter password"
                value={value}
                onChangeText={onChange}
                secureTextEntry={true}
              />
            )}
          />
          {errors.confirmPassword && (
            <ErrorText message={errors.confirmPassword.message} />
          )}

          <Controller
            control={control}
            name="otp"
            render={({ field: { onChange, value } }) => (
              <Input
                inputMode="numeric"
                label="OTP"
                placeholder="Enter OTP"
                value={value}
                onChangeText={onChange}
                maxLength={6}
              />
            )}
          />
          {errors.otp && (
            <ErrorText message={errors.otp.message} />
          )}


          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              marginVertical: 30,
            }}
          >
            <Text
              style={{
                fontSize: 15,
              }}
            >
              Didnt receive any OTP?{" "}
            </Text>
            {resendLoading ? <ActivityIndicator color="#666" size="small" /> :
              <Pressable onPress={handleResend}>
                <Text
                  style={{
                    fontSize: 15,
                    color: "#F97216",
                    textDecorationLine: "underline",
                  }}
                >
                  Resend OTP
                </Text>
              </Pressable>
            }
          </View>

          {/* <Text style={styles.privacyText}>
                This app is protected by the reCAPTCHA and the{" "}
                <Text style={styles.highlightedText}>Privacy Policy</Text> and{" "}
                <Text style={styles.highlightedText}>Terms of service</Text>{" "}
                apply
              </Text> */}

          <CustomButton
            style={styles.button}
            title="Update password"
            icon={buttonLoading ? <ActivityIndicator color="#fff" size="small" /> : <AntDesign name="arrowright" size={18} color="white" />}
            onPress={() => {
              console.log("Button Pressed");
              handleSubmit(onSubmit)(); 
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  imageStyle: {
    marginVertical: 20,
    alignSelf: "center",
  },

  headerText: {
    fontSize: s(20),
    fontWeight: "bold",
  },
  privacyText: {
    color: "#636363",
    marginTop: 40,
    marginBottom: 50,
    textAlign: "center",
  },
  highlightedText: {
    color: "#F97216",
  },
  button: {
    marginTop: 10,
    gap: 5,
  },
});

export default CreateNewPassword;
