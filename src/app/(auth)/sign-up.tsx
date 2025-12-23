import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { BoxInput, CustomButton, KeyboardDismissWrapper } from "@/components";
import { Text } from "@/components/ui";
import { images } from "@/constants";
import TopNavigation from "@/components/TopNavigation";

const SignUp = () => {
  const boxInputValues = [
    {
      header: "Organization",
      text: "Sign up as an organization",
      icon: "office-building-outline",
      route: "org/org-sign-up",
    },
    {
      header: "Rider",
      text: "Sign up as a rider",
      icon: "bike-fast",
      route: "rider/rider-sign-up",
    },
  ];

  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);

  const handleChange = (route: string) => {
    setSelectedRoute(route);
  };

  const handleContinue = () => {
    if (selectedRoute) {
      router.push(selectedRoute as any);
    } else {
      console.warn("Please select a role to continue.");
    }
  };

  // 

  return (
    <SafeAreaView style={styles.container}>
      <TopNavigation title="" />

      <View style={styles.scrollContainer}>
        <Image source={images.onboardingImage} style={styles.image} />

        <View style={styles.textContainer}>
          <Text style={styles.headerText}>Sign up</Text>
          <Text style={styles.descriptionText}>
            Select your role to proceed
          </Text>
          <View style={styles.box}>
            {boxInputValues.map((box) => (
              <BoxInput
                key={box.route}
                icon={box.icon}
                header={box.header}
                text={box.text}
                isSelected={selectedRoute === box.route}
                onPress={() => handleChange(box.route)}
              />
            ))}
          </View>

          <CustomButton
            style={styles.button}
            title="Continue"
            icon={<AntDesign name="arrowright" size={16} color="white" />}
            onPress={handleContinue}
          />

          <View style={styles.signUpLink}>
            <Text style={styles.forgotPasswordText}>
              Already have an account?
            </Text>
            <Pressable onPress={() => router.push("/(auth)/sign-in")}>
              <Text style={{ fontWeight: "bold" }}>Sign in</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  box: {
    display: "flex",
    gap: 16,
    marginTop: 16,
  },
  texts: {
    display: "flex",
    gap: 8,
  },
  scrollContainer: {
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  image: {
    width: "100%",
    height: 250,
    borderRadius: 24,
    resizeMode: "cover",
  },
  textContainer: {
    marginTop: 20,
  },
  headerText: {
    fontWeight: "500",
    fontSize: 24,
  },
  descriptionText: {
    color: "#636363",
    marginTop: 10,
    fontSize: 16,
  },
  inputField: {
    marginTop: 30,
    paddingHorizontal: 10,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
  },
  forgotPassword: {
    marginTop: 1,
    alignSelf: "flex-end",
    fontWeight: 800,
  },
  forgotPasswordText: {
    fontWeight: "500",
    fontSize: 14,
  },
  privacyText: {
    color: "#636363",
    marginTop: 20,
    marginBottom: 50,
    textAlign: "center",
  },
  highlightedText: {
    color: "#F97216",
  },
  button: {
    marginTop: 20,
    gap: 5,
  },
  signUpLink: {
    display: "flex",
    width: "100%",
    justifyContent: "center",
    flexDirection: "row",
    marginTop: 20,
  },
});

export default SignUp;
