import React from "react";
import { ScrollView, View } from "react-native";

import { AntDesign } from "@expo/vector-icons";
import { Controller } from "react-hook-form";

import {
  CustomButton,
  ErrorText,
  Input,
  PhoneNumberInput,
  Tooltip,
} from "@/components";
import { Text } from "@/components/ui";
import { ReactHookFormFunctionTypes } from "@/types/type";

export const CompanyInfo = ({
  nextStep,
  control,
  errors,
}: ReactHookFormFunctionTypes) => {
  return (
    <ScrollView keyboardShouldPersistTaps="handled">
      <View style={{ marginTop: 32, gap: 24 }}>
        <Text style={{ fontWeight: "bold", fontSize: 32 }}>
          Let's get you started
        </Text>
        <Text style={{ fontSize: 18, color: "gray" }}>
          Sign up to begin delivering and earning with us.
        </Text>
      </View>

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
          <PhoneNumberInput
            label="Phone Number"
            variant="filled"
            value={value}
            onChangeText={onChange}
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

      <Input label="Referral Code" variant="filled" placeholder="(Optional)" />

      <CustomButton
        style={{ gap: 5, marginTop: 20 }}
        title="Next"
        icon={<AntDesign name="arrowright" size={18} color="white" />}
        onPress={nextStep}
      />
    </ScrollView>
  );
};
