import React, { useContext } from "react";
import { ScrollView, View, Platform, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from "react-native";

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

interface Props {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
}

const schema = z
  .object({
    firstName: z.string().min(1, {
      message: "Required",
    }),
    lastName: z.string().min(1, {
      message: "Required",
    }),
    email: z.string().email({
      message:
        "Ensure the email follows a valid email format (e.g, abcd@gmail.com)",
    }),
    phoneNumber: z.string().min(1, {
      message: "Required",
    }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" }),
    confirmpassword: z.string().min(6, {
      message: "Password must be at least 6 characters long",
    }),
    inviteCode: z.string().optional(),
    homeAddress: z.string().min(1),
  })
  .refine((data) => data.password === data.confirmpassword, {
    message: "Passwords don't match",
    path: ["confirmpassword"],
  });


type FormData = z.infer<typeof schema>;

export const PersonalInfo = ({ step, setStep }: Props) => {
  const { state, dispatch } = useContext(DataContext);

  const {
    trigger,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: state?.signupData?.firstName || "",
      lastName: state?.signupData?.lastName || "",
      email: state?.signupData?.email || "",
      phoneNumber: state?.signupData?.phoneNumber || "",
      password: state?.signupData?.password || "",
      confirmpassword: state?.signupData?.confirmpassword || "",
      inviteCode: state?.signupData?.inviteCode || "",
      homeAddress: state?.signupData?.homeAddress || "",
    },
  });

  const nextStep = async (data: FormData) => {
    const isValid = await trigger();

    if (isValid) {
      dispatch({ type: ACTIONS.SIGNUP_DATA, payload: data });
      dispatch({ type: ACTIONS.VALIDATED, payload: true });
      setStep(step + 1);
    }
  };

  return (
    <View style={{ paddingHorizontal: 10}}>


      <Controller
        control={control}
        name="firstName"
        render={({ field: { onChange, value } }) => (
          <Input
            variant="filled"
            autoComplete="off"
            label="First name"
            placeholder="Enter first name"
            value={value}
            onChangeText={onChange}
            autoFocus
          />
        )}
      />
      {errors.firstName && <ErrorText message={errors.firstName.message} />}

      <Controller
        control={control}
        name="lastName"
        render={({ field: { onChange, value } }) => (
          <Input
            variant="filled"
            label="Last name"
            placeholder="Enter last name"
            value={value}
            onChangeText={onChange}
            style={{ margin: 0 }}
          />
        )}
      />
      {errors.lastName && <ErrorText message={errors.lastName.message} />}

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
      <Tooltip text="This number would be used for enquiry by users" />

      <Controller
        control={control}
        name="email"
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
      {errors.email && <ErrorText message={errors.email.message} />}

      <Controller
        control={control}
        name="homeAddress"
        render={({ field: { onChange, value } }) => (
          <Input
            variant="filled"
            label="House address"
            placeholder="Enter your home address"
            value={value}
            onChangeText={onChange}
          />
        )}
      />

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
            secureTextEntry={true}
          />
        )}
      />
      {errors.confirmpassword && <ErrorText message={errors.confirmpassword.message} />}
      <Tooltip text="Not less than 6 characters" />

      
      <Controller
        control={control}
        name="inviteCode"
        render={({ field: { onChange, value } }) => (
          <Input
            variant="filled"
            label="Invite code"
            placeholder="Company invite code"
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      <Tooltip text="Leave blank if you are not associated with an organization" />

      <CustomButton
        style={{ gap: 5, marginTop: 20, marginBottom: 50 }}
        title="Next"
        icon={<AntDesign name="arrowright" size={18} color="white" />}
        onPress={handleSubmit(nextStep)}
      />
    </View>
  );
};
