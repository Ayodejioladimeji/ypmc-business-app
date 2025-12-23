import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  FlatList,
  StyleSheet,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { s } from "react-native-size-matters";

import { KeyboardDismissWrapper, ProgressBar } from "@/components";
import { PersonalInfo, VehicleInfo } from "@/components/auth/RiderAuth";
import TopNavigation from "@/components/TopNavigation";
import { Text } from "@/components/ui";
import { KycDocument } from "@/components/org-components/kyc-document";
import { KycContact } from "@/components/org-components/kyc-contact";

const RiderKYC = () => {
  const [step, setStep] = useState<number>(1);

  const stepTitles = ["Kyc Document", "Emergency Contact"];

  const formSections = [
    {
      id: "header",
      render: () => (
        <View style={{ paddingHorizontal: 10, gap: 10 }}>
          <Text style={{ fontFamily:"interSemiBold", fontSize: s(20) }}>
            Verify your identity
          </Text>
          <Text style={{ fontSize: s(16), color: "gray" }}>
            Kindly provide the required information to verify your identity with us...</Text>
        </View>
      ),
    },
    {
      id: "progressBar",
      render: () => (
        <View style={{ paddingHorizontal: 16, marginTop: 40 }}>
          <ProgressBar step={step} stepTitles={stepTitles} setStep={setStep} />
        </View>
      ),
    },
    {
      id: "form",
      render: () => (step === 1 ? <KycDocument step={step} setStep={setStep} /> : <KycContact step={step} setStep={setStep} />),
    },
  ];

  return (
      <SafeAreaView style={styles.container}>
        <TopNavigation title="" />

        <FlatList
          data={formSections}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => item.render()} 
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default RiderKYC;
