import React, { useContext, useEffect, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import { AntDesign } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";

import {
  CustomButton,
  ErrorText,
  Input,
  KeyboardDismissWrapper,
  Loader,
} from "@/components";
import { Text } from "@/components/ui";
import { useOrgLoginMutation } from "@/redux/actions/org";
import TopNavigation from "@/components/TopNavigation";
import { images } from "@/constants";
import { ACTIONS } from "@/store/Actions";
import { DataContext } from "@/store/GlobalState";
import { OneSignal } from "react-native-onesignal";
import * as Device from "expo-device";
import * as Network from "expo-network";
import { toast } from "sonner-native";
import { storeData, storeToken } from "@/utils/helper";
import { PostRequest } from "@/utils/requests";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { ActivityIndicator } from "react-native";

const schema = z.object({
  email: z.string().email({
    message: "Ensure the email follows a valid format (e.g, abcd@gmail.com)",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters long",
  }),
});

type FormData = z.infer<typeof schema>;

const OrgSignIn = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const [orgLogin, { isLoading }] = useOrgLoginMutation();
  const [loading, setLoading] = useState(false)
  const { state, dispatch } = useContext(DataContext)
  const { deviceInfo } = state


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

  const onSubmit = async (data: FormData) => {
    setLoading(true)

    const payload = {
      ...data,
      deviceToken: deviceInfo?.deviceToken,
      platform: Platform.OS,
      deviceInfo: {
        model: deviceInfo?.model,
        osVersion: deviceInfo?.osVersion,
        appVersion: deviceInfo?.appVersion
      },
      ipAddress: deviceInfo?.ipAddress
    }


    const res = await PostRequest("/auth/login/partner", payload)
    if (res?.status === 200 || res?.status === 201) {
      await storeToken('token', res?.data?.data?.accessToken)
      await storeData('role', res?.data?.data?.userRole)

      dispatch({ type: ACTIONS.TOKEN, payload: res?.data?.data?.accessToken })
      toast.success(res?.data?.message, {
        duration: 1000,
      });
      router.replace("/(org)/(tabs)/home");
    }

    if (res === "Please verify your account to continue") {
      const payload = {
        email: data?.email
      }

      const result = await PostRequest('/auth/send-otp', payload)
      if (result?.status === 200 || result?.status === 201) {
        router.replace({
          pathname: "/(auth)/otp",
          params: { email: data.email }
        });
      }
    }
    setLoading(false)

  };

  // 

  return (
    <SafeAreaView style={styles.container}>
      <TopNavigation title="" />

      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        enableOnAndroid={true}
        extraScrollHeight={100}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.secondaryContainer}>
          <Image source={images.onboardingImage} style={styles.image} />

          <View style={styles.textContainer}>
            <Text style={styles.headerText}>Login</Text>
            <Text style={styles.descriptionText}>
              Enter login information to continue
            </Text>
          </View>

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <Input
                style={styles.inputField}
                icon="mail-outline"
                label="Email Address"
                placeholder="Enter email or phone number"
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          {errors.email && <ErrorText message={errors.email.message} />}

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <Input
                style={styles.inputField}
                icon="lock-closed-outline"
                label="Password"
                placeholder="Enter password"
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          {errors.password && <ErrorText message={errors.password.message} />}

          <TouchableOpacity
            activeOpacity={0.75}
            style={styles.forgotPasswordContainer}
            onPress={() => {
              router.push("/(auth)/forgot-password");
            }}
          >
            <Text style={styles.forgotPasswordText}>Forgot password?</Text>
          </TouchableOpacity>

          <CustomButton
            onPress={handleSubmit(onSubmit)}
            style={styles.button}
            title="Sign in"
            icon={loading ? <ActivityIndicator color="white" size="small" />
              :
              <AntDesign name="arrowright" size={18} color="white" />
            }
            disabled={isLoading}
          />

          <View style={styles.signUpLink}>
            <Text>Don't have an account yet? </Text>
            <Pressable onPress={() => router.push("/(auth)/sign-up")}>
              <Text style={{ fontWeight: "bold" }}>Sign up</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  secondaryContainer: {
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  image: {
    width: "100%",
    height: 250,
    borderRadius: 24,
    resizeMode: "cover",
  },
  textContainer: {
    marginVertical: 20,
  },
  headerText: {
    fontWeight: "500",
    fontSize: 24,
  },
  descriptionText: {
    color: "#636363",
    marginTop: 10,
    fontSize: 16,
  },
  inputField: {
    marginTop: 30,
    paddingHorizontal: 10,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
  },
  forgotPasswordContainer: {
    marginTop: 1,
    alignSelf: "flex-end",
    fontWeight: "800",
  },
  forgotPasswordText: {
    fontWeight: "bold",
    fontSize: 14,
  },
  button: {
    marginTop: 20,
    gap: 5,
  },
  signUpLink: {
    display: "flex",
    width: "100%",
    justifyContent: "center",
    flexDirection: "row",
    marginVertical: 20,
  },
});

export default OrgSignIn;
