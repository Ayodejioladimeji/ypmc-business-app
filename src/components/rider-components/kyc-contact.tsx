import React, { useContext, useState } from "react";
import { ScrollView, View, Platform, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, ActivityIndicator } from "react-native";

import { AntDesign } from "@expo/vector-icons";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";


import {
  CustomButton,
  ErrorText,
  Input,
  Tooltip,
} from "@/components";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { DataContext } from "@/store/GlobalState";
import { ACTIONS } from "@/store/Actions";
import { PostRequest } from "@/utils/requests";
import { toast } from "sonner-native";
import { useRouter } from "expo-router";

interface Props {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
}


const schema = z
  .object({
    fullName: z.string().min(1, {
      message: "Fullname is required",
    }),
    contactAddress: z.string().min(1, {
      message: "Address is required",
    }),
    // contactEmail: z.string().email({
    //   message:
    //     "Ensure the email follows a valid email format (e.g, abcd@gmail.com)",
    // }),
    phoneNumber: z.string().min(1, {
      message: "Phone number is required",
    }),
    isPrimaryContact: z.string().optional(),
  })


type FormData = z.infer<typeof schema>;

export const KycContact = ({ step, setStep }: Props) => {
  const { state, dispatch } = useContext(DataContext);
  const router = useRouter()
  const [buttonLoading, setButtonLoading] = useState(false)

  const {
    trigger,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema)
  });

  const nextStep = async (data: FormData) => {
    const isValid = await trigger();

    const payload = {
      ...data,
      isPrimaryContact: true
    }

    if (isValid) {
      setButtonLoading(true)
      const res = await PostRequest("/kyc/rider/emergency-contact", payload, state?.token)

      if (res?.status === 200 || res?.status === 201) {
        dispatch({type:ACTIONS.CALLBACK, payload: !state?.callback})
        // toast.success(res?.data?.message)
        router.replace('/(rider)/kyc-success');

        dispatch({
          type: ACTIONS.UPLOADED_IMAGES,
          payload: {
            votersCard: null,
            driversLicense: null,
            electricityBill: null,
          },
        });
      }
      setButtonLoading(false)
    }
  };

  // 

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid={true}
      extraScrollHeight={100}
      keyboardShouldPersistTaps="handled"
    >

      <ScrollView style={{ paddingHorizontal: 16 }}>

        <Controller
          control={control}
          name="fullName"
          render={({ field: { onChange, value } }) => (
            <Input
              variant="filled"
              autoComplete="off"
              label="Full name"
              placeholder="Enter full name"
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        {errors.fullName && <ErrorText message={errors.fullName.message} />}

        <Controller
          control={control}
          name="phoneNumber"
          render={({ field: { onChange, value } }) => (
            <Input
              variant="filled"
              label="Phone Number"
              placeholder="08012345678"
              value={value}
              onChangeText={onChange}
              keyboardType="phone-pad"
            />
          )}
        />

        {errors.phoneNumber && <ErrorText message={errors.phoneNumber.message} />}

        {/* <Controller
          control={control}
          name="contactEmail"
          render={({ field: { onChange, value } }) => (
            <Input
              variant="filled"
              label="Email Address"
              placeholder="Enter email address"
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        {errors.contactEmail && <ErrorText message={errors.contactEmail.message} />} */}

        <Controller
          control={control}
          name="contactAddress"
          render={({ field: { onChange, value } }) => (
            <Input
              variant="filled"
              label="Address"
              placeholder="Enter address"
              value={value}
              onChangeText={onChange}
              style={{ margin: 0 }}
            />
          )}
        />
        {errors.contactAddress && <ErrorText message={errors.contactAddress.message} />}

        <CustomButton
          style={{ gap: 5, marginTop: 20, marginBottom: 50 }}
          title="Next"
          icon={buttonLoading ? <ActivityIndicator color="white"/> : <AntDesign name="arrowright" size={18} color="white" />}
          onPress={handleSubmit(nextStep)}
        />
      </ScrollView>
    </KeyboardAwareScrollView>
  );
};
