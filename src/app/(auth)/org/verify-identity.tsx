import React, { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";

import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useForm } from "react-hook-form";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";

import { Loader, ProgressBar } from "@/components";
import { Text } from "@/components/ui";
import { useOrgSignUpMutation } from "@/redux/actions/org";

const schema = z.object({
  companyName: z.string(),
  address: z.string().optional(),
  phoneNumber: z.string(),
  email: z
    .string()
    .email({
      message:
        "Ensure the email follows a valid email format (e.g, abcd@gmail.com)",
    })
    .optional(),
  password: z
    .string()
    .min(8, {
      message: "Password must be at least 8 characters long",
    })
    .optional(),
  numberOfVehiclesOwned: z.string(),
  referral: z.number().optional(),
});

type FormData = z.infer<typeof schema>;

const VerifyIdentity = () => {
  const {
    trigger,
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const [step, setStep] = useState(1);

  const stepTitles = ["KYB Documents", "Emergency Contact"];

  const [orgSignUp, { isLoading, error }] = useOrgSignUpMutation();

  const nextStep = async () => {
    const isValid = await trigger();

    if (isValid) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const onSubmit = async (data: FormData) => {
    try {
      await orgSignUp(data).unwrap();
      router.push({
        pathname: "/(auth)/otp/[email]",
        params: { email: data.email as string },
      });
    } catch (error) {
      console.log(error);
      Alert.alert("Error", error?.data?.message, [
        {
          text: "Close",
          style: "cancel",
        },
      ]);
    }
  };

  if (isLoading) return <Loader />;

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ gap: 24 }}>
        <Text style={{ fontWeight: "bold", fontSize: 32 }}>
          Verify your identity
        </Text>
        <Text style={{ fontSize: 18, color: "gray" }}>
          Kindly provide the required information to verify your business with
          us.
        </Text>
      </View>

      <View style={{ marginTop: 32 }}>
        <ProgressBar step={step} stepTitles={stepTitles} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 12,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 96,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default VerifyIdentity;
