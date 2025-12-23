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
import { Link, useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Input from "@/components/ui/input";
import {Text} from "@/components/ui";
import { colors, spacing } from "@/theme";
import SafeAreaViews from "@/components/safe-area-view";
import TopNavigation from "@/components/TopNavigation";
import { s } from "react-native-size-matters";
import SupportForm from "@/components/rider-components/support-form";

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

export default function CaseRequest() {
  const router = useRouter();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      currentPassword: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onSubmit",
  });

  function handleSumbit(data: z.infer<typeof schema>) { }

  return (
    <SafeAreaView style={{flex:1, backgroundColor:'white', paddingTop: Platform.OS === "android" ? 40 : 10 }}>
      <TopNavigation title="" />

      <ScrollView showsVerticalScrollIndicator={false}>
        <KeyboardAvoidingView
          style={[styles.container]}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <Text style={styles.heading}>Submit a Case Request</Text>
          <Text style={styles.description}>
            Submit your report to initiate our support process
          </Text>

          <View style={{ height: 2, backgroundColor: colors.muted, marginVertical: 30 }} />

          <SupportForm />
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
    marginBottom: 25
  },
  heading: {
    fontFamily: "interMedium",
    fontSize: s(16),
    marginBottom: 10
  },
  description: {
    color: "rgba(99, 99, 99, 1)",
    fontFamily: "interRegular",
    fontSize: s(14),
  },

});
