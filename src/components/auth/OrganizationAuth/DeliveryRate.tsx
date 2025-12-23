import React, { useContext, useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";

import { FontAwesome6 } from "@expo/vector-icons";
import { Controller, useForm } from "react-hook-form";

import { CustomButton, ErrorText, Input, Tooltip } from "@/components";
import { Text } from "@/components/ui";
import { ReactHookFormFunctionTypes } from "@/types/type";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { s } from "react-native-size-matters";
import { useRouter } from "expo-router";
import { DataContext } from "@/store/GlobalState";
import { GetRequest, PostRequest } from "@/utils/requests";
import { toast } from "sonner-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const schema = z.object({
  kilometerRate: z.string(),
  hourlyRate: z.string(),
  otherCosts: z.string(),
});

type FormData = z.infer<typeof schema>;

export const DeliveryRate = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [buttonLoading, setButtonLoading] = useState(false)
  const { state } = useContext(DataContext)
  const [rates, setRates] = useState<any>(null)

  const {
    trigger,
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      kilometerRate: "",
      hourlyRate: "",
      otherCosts: "",
    },
    mode: "onSubmit"
  });

  useEffect(() => {
    if (state?.token) {
      const getkilometerRate = async () => {
        const res = await GetRequest("/pricing-model/partner", state?.token)
        if (res?.status === 200 || res?.status === 201) {
          const payload = {
            kilometerRate: Number(res?.data?.data?.ratePerKilometer).toString(),
            hourlyRate: Number(res?.data?.data?.ratePerHour).toString(),
            otherCosts: Number(res?.data?.data?.otherOperationalCosts).toString(),
          }
          setRates(payload)
          reset(payload);
        }
        setLoading(false)
      }
      getkilometerRate()
    }
  }, [state?.token])

  const handleContinue = async (data: FormData) => {

    setButtonLoading(true)

    const payload = {
      ratePerKilometer: Number(data?.kilometerRate),
      ratePerHour: Number(data?.hourlyRate),
      otherOperationalCost: Number(data?.otherCosts)
    }

    const res = await PostRequest("/pricing-model/partner", payload, state?.token)
    if (res?.status === 200 || res?.status === 201) {
      toast.success(res?.data?.message)
      router.replace("/(auth)/org/additional-details")
    }

    setButtonLoading(false)

    // router.replace("/(auth)/rider/additional-details")
  }

  // 

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid={true}
      extraScrollHeight={0}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.container}>
        <View style={{ gap: 12, marginBottom: 40 }}>
          <View style={styles.headerContainer}>
            <FontAwesome6 name="naira-sign" size={25} />
            <Text style={{ fontWeight: "500", fontSize: s(22) }}>
              Delivery Rate
            </Text>
          </View>
          <Text style={{ fontSize: 18, color: "gray" }}>
            Set your preferred delivery rates.
          </Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" />
        ) : (
          <>
            <Controller
              control={control}
              name="kilometerRate"
              render={({ field: { onChange, value } }) => (
                <Input
                  variant="filled"
                  label="Rate per kilometer (NGN)"
                  placeholder="Enter rate per km"
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
            {errors.kilometerRate && <ErrorText message={errors.kilometerRate.message} />}
            <Tooltip text="Set your price for each kilometer traveled." />

            <Controller
              control={control}
              name="hourlyRate"
              render={({ field: { onChange, value } }) => (
                <Input
                  variant="filled"
                  label="Hourly rate"
                  placeholder="Enter hourly rate"
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
            {errors.hourlyRate && <ErrorText message={errors.hourlyRate.message} />}
            <Tooltip text="Set the cost per hour for delivery services." />

            <Controller
              control={control}
              name="otherCosts"
              render={({ field: { onChange, value } }) => (
                <Input
                  variant="filled"
                  label="Other Operational Costs"
                  placeholder="Enter additional costs"
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
            {errors.otherCosts && <ErrorText message={errors.otherCosts.message} />}
            <Tooltip text="Include any extra fee" />

            <View style={styles.orangeBox}>
              <Text style={{ color: "#f97216", fontSize: s(15), fontWeight: "bold", marginBottom: 10 }}>
                NGN 0.00
              </Text>
              <Text>
                Your earning for a distance of 0km and time of 0hr
              </Text>
            </View>

            <CustomButton
              onPress={handleSubmit(handleContinue)}
              style={{ gap: 5, marginVertical: 40 }}
              title="Save and Continue"
              icon={buttonLoading && <ActivityIndicator color="white" />}
            />
          </>
        )}
      </View>
    </KeyboardAwareScrollView>
  );


};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 12,
  },
  orangeBox: {
    marginTop: 12,
    backgroundColor: "#fff8f3",
    paddingHorizontal: 12,
    paddingVertical: 20,
    borderRadius: 20,
  },
});

