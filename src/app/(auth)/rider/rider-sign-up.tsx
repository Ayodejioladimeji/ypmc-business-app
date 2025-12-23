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
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const RiderSignUp = () => {
  const [step, setStep] = useState<number>(1);

  const stepTitles = ["Personal info", "Vehicle info"];

  const formSections = [
    {
      id: "header",
      render: () => (
        <View style={{ paddingHorizontal: 10, gap: 10 }} key={step}>
          <Text style={{ fontWeight: "500", fontSize: s(22) }}>
            {step === 1 ? "Let's get you started" : "Provide additional details"}
          </Text>
          <Text style={{ fontSize: 18, color: "gray" }}>
            {step === 1
              ? "Sign up to begin delivering and earning with us."
              : "Help us complete your profile with a few more details."}
          </Text>
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
      render: () => (step === 1 ? <PersonalInfo step={step} setStep={setStep} /> : <VehicleInfo step={step} setStep={setStep} />),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <TopNavigation title="" />

      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1, backgroundColor: "#fff" }}
        enableOnAndroid={true}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {formSections?.map((item) => (
          <React.Fragment key={item.id}>
            {item.render()}
          </React.Fragment>
        ))}
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default RiderSignUp;
