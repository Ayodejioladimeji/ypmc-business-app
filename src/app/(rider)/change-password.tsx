import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner-native";
import * as z from "zod";
import { Button, ButtonText } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Input from "@/components/ui/input";
import { colors, spacing } from "@/theme";
import SafeAreaViews from "@/components/safe-area-view";
import TopNavigation from "@/components/TopNavigation";
import { s } from "react-native-size-matters";
import { PostRequest } from "@/utils/requests";
import { useContext, useEffect, useRef, useState } from "react";
import { DataContext } from "@/store/GlobalState";
import { Text } from "@/components/ui";

const schema = z
  .object({
    currentPassword: z
      .string()
      .min(1, { message: "Current Password is required" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
  });

export default function ChangePasswords() {
  const [loading, setLoading] = useState(false)
  const { state } = useContext(DataContext)
  const [focusedField, setFocusedField] = useState<null | string>(null);
  const inputRef = useRef<any>(null);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      currentPassword: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onSubmit",
  });


  async function handleSumbit(data: z.infer<typeof schema>) {

    setLoading(true)

    const payload = {
      currentPassword: data?.currentPassword,
      newPassword: data?.password,
      confirmNewPassword: data?.confirmPassword
    }

    const res = await PostRequest("/auth/change-password", payload, state?.token)
    if (res?.status === 200 || res?.status === 201) {
      toast.success(res?.data?.message)
      form.reset()
    }
    setLoading(false)
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white', paddingTop: 40 }}>
      <TopNavigation title="" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <KeyboardAvoidingView
          style={[styles.container]}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <Text style={styles.heading}>Change password</Text>
          <Text style={styles.description}>
            Make sure your password is unique and memorable.
          </Text>

          <Form {...form}>
            <View style={styles.wrapper}>
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: spacing.xs,
                      }}
                    >
                      <Ionicons
                        name="lock-closed-outline"
                        size={20}
                        color="#000000"
                      />
                      <FormLabel style={styles.label}>Current Password</FormLabel>
                    </View>

                    <Input
                      autoCapitalize="none"
                      autoCorrect={false}
                      placeholder="Enter your current password"
                      secureTextEntry={true}
                      returnKeyType="next"
                      placeholderTextColor={"#63636380"}
                      onChangeText={field.onChange}
                      autoFocus
                      style={[
                        styles.input,
                        focusedField === "currentpassword" && { borderColor: "#f97216" },
                      ]}
                      onFocus={() => setFocusedField("currentpassword")}
                      onBlur={() => setFocusedField(null)}
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: spacing.xs,
                      }}
                    >
                      <Ionicons
                        name="lock-closed-outline"
                        size={20}
                        color="#000000"
                      />
                      <FormLabel style={styles.label}>Password</FormLabel>
                    </View>

                    <Input
                      autoCapitalize="none"
                      autoCorrect={false}
                      placeholder="Enter new password"
                      secureTextEntry={true}
                      returnKeyType="next"
                      placeholderTextColor={"#63636380"}
                      onChangeText={field.onChange}
                      style={[
                        styles.input,
                        focusedField === "password" && { borderColor: "#f97216" },
                      ]}
                      onFocus={() => setFocusedField("password")}
                      onBlur={() => setFocusedField(null)}
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: spacing.xs,
                      }}
                    >
                      <Ionicons
                        name="lock-closed-outline"
                        size={20}
                        color="#000000"
                      />
                      <FormLabel style={styles.label}>
                        Confirm New Password
                      </FormLabel>
                    </View>

                    <Input
                      autoCapitalize="none"
                      autoCorrect={false}
                      placeholder="Enter new password"
                      secureTextEntry={true}
                      returnKeyType="next"
                      placeholderTextColor={"#63636380"}
                      onChangeText={field.onChange}
                      style={[
                        styles.input,
                        focusedField === "confirmpassword" && { borderColor: "#f97216" },
                      ]}
                      onFocus={() => setFocusedField("confirmpassword")}
                      onBlur={() => setFocusedField(null)}
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </View>

            <Button
              style={{ marginVertical: 80 }}
              disabled={loading}
              onPress={form.handleSubmit(handleSumbit)}
            >
              <ButtonText>Reset Password</ButtonText>
              {loading && <ActivityIndicator size="small" color="#fff" />}
            </Button>
          </Form>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.md,
    justifyContent: "flex-start",
    marginTop: 25
  },
  heading: {
    fontFamily: "interMedium",
    fontSize: s(18),
    marginBottom: 10
  },
  description: {
    color: "rgba(99, 99, 99, 1)",
    fontFamily: "interRegular",
    fontSize: 16,
  },
  wrapper: {
    marginTop: spacing.huge,
    gap: spacing.md,
  },
  label: {
    fontSize: 16,
    color: "black",
  },
  input: {
    paddingHorizontal: 0,
    borderBottomWidth: 1,
    borderColor: "rgba(99, 99, 99, 0.5)",
    borderRadius: 0,
  },
});
