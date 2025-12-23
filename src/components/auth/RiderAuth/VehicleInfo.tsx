import React, { useContext, useState } from "react";
import { ActivityIndicator, Platform, ScrollView, Text, View } from "react-native";

import { AntDesign } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import DropDownPicker from "react-native-dropdown-picker";
import { z } from "zod";

import { CustomButton, ErrorText, Input, Select } from "@/components";
import { ACTIONS } from "@/store/Actions";
import { DataContext } from "@/store/GlobalState";
import { PostRequest } from "@/utils/requests";
import { toast } from "sonner-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

interface Props {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
}

const schema = z.object({
  vehicleType: z.string(),
  vehiclePlateNumber: z.string(),
});

type FormData = z.infer<typeof schema>;

export const VehicleInfo = ({ step, setStep }: Props) => {
  const { state, dispatch } = useContext(DataContext);
  const router = useRouter();
  const [dropdown, setDropdown] = useState(false);
  const [loading, setLoading] = useState(false)

  const {
    trigger,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      vehicleType: state?.signupData?.vehicleType || "",
      vehiclePlateNumber: state?.signupData?.vehiclePlateNumber || "",
    },
  });


  const nextStep = async (data: FormData) => {
    const isValid = await trigger();

    if (isValid) {
      dispatch({ type: ACTIONS.SIGNUP_DATA, payload: data })
      setLoading(true)

      const payload = {
        ...state?.signupData,
        vehicleType: data?.vehicleType,
        vehiclePlateNumber: data?.vehiclePlateNumber
      }

      const res = await PostRequest("/auth/register/rider", payload)

      if (res?.status === 200 || res?.status === 201) {
        toast.success(res?.data?.message)
        router.replace({
          pathname: "/(auth)/otp",
          params: { email: state?.signupData?.email },
        });

        // dispatch({ type: ACTIONS.SIGNUP_DATA, payload: null })
      }

      setLoading(false)
    }
  };


  //

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 30 }}
      enableOnAndroid={true}
      extraScrollHeight={Platform.OS === "android" ? 100 : 50}
      keyboardShouldPersistTaps="handled"
      keyboardOpeningTime={300}
    >

      <View style={{ paddingHorizontal: 16 }}>
        <Controller
          control={control}
          name="vehicleType"
          defaultValue="BIKE"
          render={({ field: { onChange, value } }) => (
            <>

              <Text style={{ marginBottom: 10, fontSize: 16, marginTop: 30 }}>
                Select Vehicle Type
              </Text>
              <DropDownPicker
                open={dropdown}
                value={value}
                items={[
                  { label: "Bike", value: "BIKE" },
                  { label: "Car", value: "CAR" },
                  { label: "Truck", value: "TRUCK" },
                  { label: "Van", value: "VAN" },
                ]}
                setOpen={setDropdown}
                setValue={(callback) => {
                  const newValue = callback(value);
                  onChange(newValue);
                }}
                style={{
                  backgroundColor: "#f3f3f3",
                  borderWidth: 0.8,
                  borderColor: "#ccc",
                  borderRadius: 10,
                  padding: 15,
                  justifyContent: "center",
                  height: 55,
                  width: "100%",
                }}
                dropDownContainerStyle={{
                  backgroundColor: "#f3f3f3",
                  borderWidth: 0,
                  elevation: 0,
                }}
              />
            </>
          )}
        />

        <Controller
          control={control}
          name="vehiclePlateNumber"
          render={({ field: { onChange, value } }) => (
            <Input
              variant="filled"
              label="Vehicle license plate number"
              placeholder="Enter your vehicle license plate number"
              value={value.toUpperCase()}
              onChangeText={onChange}
            />
          )}
        />
        {errors.vehiclePlateNumber && (
          <ErrorText message={errors.vehiclePlateNumber.message} />
        )}

        <CustomButton
          style={{ gap: 5, marginTop: 20 }}
          title="Create account"
          icon={
            loading ? <ActivityIndicator size="small" color="#fff" /> : <AntDesign name="arrowright" size={18} color="white" />
          }
          onPress={handleSubmit(nextStep)}
        />
      </View>
    </KeyboardAwareScrollView>
  );
};
