import React, { useState } from "react";
import { ActivityIndicator, Alert, SafeAreaView, StyleSheet, Text, View } from "react-native";

import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import {
  CustomButton,
  ErrorText,
  Input,
} from "@/components";
import TopNavigation from "@/components/TopNavigation";
import { PostRequest } from "@/utils/requests";
import { toast } from "sonner-native";
import { s } from "react-native-size-matters";

const schema = z.object({
  email: z.string().email({
    message: "Ensure the email follows a valid format (e.g, abcd@gmail.com)",
  }),
});
type FormData = z.infer<typeof schema>;

const ForgotPassword = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const [buttonLoading, setButtonLoading] = useState(false)

  const onSubmit = async (data: FormData) => {
    setButtonLoading(true)
    const res = await PostRequest("/auth/forgot-password", {email: data?.email})
    if(res?.status === 200 || res?.status === 201){
      toast.success(res?.data?.message)
      router.push({
        pathname: "/(auth)/forgot-password/[email]",
        params: { email: data.email as string },
      });
    }

    setButtonLoading(false)
  };


  return (
    <SafeAreaView>
      <TopNavigation title=""/>
      <View style={styles.container}>
        
        <Text style={styles.fogotPassword}>Forgot Password?</Text>
        <Text
          style={{
            marginTop: 10,
            fontSize: 16,
            maxWidth: 353,
            color: "#636363",
          }}
        >
          Enter the email address associated with your account and we’ll send a
          reset verification code.
        </Text>

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <Input
              icon="mail-outline"
              label="Email address"
              placeholder="Enter email"
              placeholderTextColor="#636363"
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        {errors.email && <ErrorText message={errors.email.message} />}
        <CustomButton
          onPress={handleSubmit(onSubmit)}
          style={{ marginTop: 20 }}
          title={"Get Code"}
          icon={buttonLoading && <ActivityIndicator color="white"/>}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 12,
  },
  fogotPassword: {
    fontSize: s(20),
    fontWeight: "bold",
    // marginTop: 20,
  },
});

export default ForgotPassword;
