import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { AntDesign, Feather } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { CustomButton } from "./CustomButton";
import { Input } from "./Input";

function validatePassword(password: string) {
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()-_+=<>?])[A-Za-z\d!@#$%^&*()-_+=<>?]{8,}$/;
  return regex.test(password);
}

const schema = z
  .object({
    password: z
      .string()
      .min(8, {
        message: "Password must be at least 8 characters long",
      })
      .refine(validatePassword, {
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      }),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

export const PasswordInfoForm = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
    router.replace("/(auth)/take-picture");
  };
  return (
    <View>
      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, value } }) => (
          <Input
            style={styles.inputField}
            label="Password"
            placeholder="Enter password"
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      {errors.password && (
        <Text style={styles.errorText}>{errors.password.message}</Text>
      )}
      <View
        style={{ display: "flex", flexDirection: "row", gap: 5, margin: 5 }}
      >
        <Feather name="info" size={12} color="#636363" />
        <Text style={{ color: "#636363", fontSize: 12 }}>
          Not less than 6 characters.
        </Text>
      </View>
      <Controller
        control={control}
        name="confirmPassword"
        render={({ field: { onChange, value } }) => (
          <Input
            style={styles.inputField}
            label=" Confirm Password"
            placeholder="Confirm password"
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      {errors.confirmPassword && (
        <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>
      )}
      <View
        style={{ display: "flex", flexDirection: "row", gap: 5, margin: 5 }}
      >
        <Feather name="info" size={12} color="#636363" />
        <Text style={{ color: "#636363", fontSize: 12 }}>
          Not less than 6 characters.
        </Text>
      </View>
      <CustomButton
        style={{ gap: 5, marginTop: 20 }}
        title="Submit"
        icon={<AntDesign name="arrowright" size={18} color="white" />}
        onPress={handleSubmit(onSubmit)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputField: {
    marginTop: 50,
    padding: 10,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
  },
});
