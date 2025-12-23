import React, { useContext, useState } from "react";
import { ScrollView, View, Platform, ActivityIndicator } from "react-native";

import { AntDesign } from "@expo/vector-icons";
import { Controller, useForm } from "react-hook-form";

import {
  CustomButton,
  ErrorText,
  Input,
  PhoneNumberInput,
  Tooltip,
} from "@/components";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { DataContext } from "@/store/GlobalState";
import { ACTIONS } from "@/store/Actions";
import { PostRequest } from "@/utils/requests";
import { useRouter } from "expo-router";
import { toast } from "sonner-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

interface Props {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
}

const schema = z.object({
  companyName: z.string().min(1, { message: "Required" }),
  companyAddress: z.string().optional(),
  phoneNumber: z.string().min(1, { message: "Required" }),
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
  confirmpassword: z
    .string()
    .min(8, {
      message: "Password must be at least 8 characters long",
    })
    .optional(),

  numberOfVehiclesOwned: z.string().min(1, { message: "Required" }),
})
  .refine((data) => data.password === data.confirmpassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })


type FormData = z.infer<typeof schema>;

export const PersonalInfo = () => {
  const { state, dispatch } = useContext(DataContext);
  const [loading, setLoading] = useState(false)
  const router = useRouter();

  const {
    trigger,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onSubmit",
  });

  const onSubmit = async (data: FormData) => {

    const isValid = await trigger();

    if (isValid) {
      setLoading(true)

      const res = await PostRequest("/auth/register/partner", data)

      if (res?.status === 200 || res?.status === 201) {
        toast.success(res?.data?.message)
        router.replace({
          pathname: "/(auth)/otp",
          params: { email: data?.email },
        });

      }

      setLoading(false)
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

    <View style={{ paddingHorizontal: 10 }}>
      <Controller
        control={control}
        name="companyName"
        render={({ field: { onChange, value } }) => (
          <Input
            variant="filled"
            label="Company name"
            placeholder="Enter first name"
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      {errors.companyName && <ErrorText message={errors.companyName.message} />}

      <Controller
        control={control}
        name="companyAddress"
        render={({ field: { onChange, value } }) => (
          <Input
            variant="filled"
            label="Company address (optional)"
            placeholder="Provide your company's address"
            value={value}
            onChangeText={onChange}
          />
        )}
      />

      <Controller
        control={control}
        name="phoneNumber"
        render={({ field: { onChange, value } }) => (
          <Input
            label="Phone Number"
            variant="filled"
            value={value}
            onChangeText={onChange}
            placeholder="08012345678"
            keyboardType="phone-pad"
          />
        )}
      />
      {errors.phoneNumber && <ErrorText message={errors.phoneNumber.message} />}

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <Input
            variant="filled"
            label="Email Address"
            placeholder="Provide your company's email address"
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
            variant="filled"
            label="Password"
            placeholder="Enter password"
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      {errors.password && <ErrorText message={errors.password.message} />}
      <Tooltip text="Not less than 6 characters" />

      <Controller
        control={control}
        name="confirmpassword"
        render={({ field: { onChange, value } }) => (
          <Input
            variant="filled"
            label="Confirm Password"
            placeholder="Enter password"
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      {errors.confirmpassword && <ErrorText message={errors?.confirmpassword.message} />}
      <Tooltip text="Not less than 6 characters" />

      <Controller
        control={control}
        name="numberOfVehiclesOwned"
        render={({ field: { onChange, value } }) => (
          <Input
            value={value}
            onChangeText={onChange}
            variant="filled"
            label="Number of vehicles owned"
            placeholder="How many vehicles do you own?"
            keyboardType="numeric"
          />
        )}
      />
      {errors.numberOfVehiclesOwned && (
        <ErrorText message={errors.numberOfVehiclesOwned.message} />
      )}

      <CustomButton
        style={{ gap: 5, marginVertical: 20, fontWeight: 600 }}
        title="Submit"
        icon={
          loading ? <ActivityIndicator size="small" color="#fff" /> : <AntDesign name="arrowright" size={18} color="white" />
        }
        onPress={handleSubmit(onSubmit)}
      />
    </View>
        </KeyboardAwareScrollView>
  );
};
