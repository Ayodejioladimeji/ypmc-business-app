import React, { useContext, useEffect, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { BoxInput, CustomButton } from "@/components";
import { Text } from "@/components/ui";
import { images } from "@/constants";
import TopNavigation from "@/components/TopNavigation";
import { OneSignal } from "react-native-onesignal";
import * as Device from "expo-device";
import * as Network from "expo-network";
import { DataContext } from "@/store/GlobalState";
import { ACTIONS } from "@/store/Actions";


const SignIn = () => {
  const boxInputValues = [
    {
      header: "Organization",
      text: "Sign in as an organization",
      icon: "office-building-outline",
      route: "org/org-sign-in",
    },
    {
      header: "Rider",
      text: "Sign in as a rider",
      icon: "bike-fast",
      route: "rider/rider-sign-in",
    },
  ];
  const {dispatch} = useContext(DataContext)
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

  return (
    <SafeAreaView style={styles.container}>
      <TopNavigation title=""/>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image source={images.onboardingImage} style={styles.image} />

        <View style={styles.textContainer}>
          <Text style={styles.headerText}>Sign in</Text>
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
              Don't have an account?
            </Text>
            <Pressable onPress={() => router.push("/(auth)/sign-up")}>
              <Text style={{ fontWeight: "bold" }}>Sign up</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
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
    paddingBottom:50
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

export default SignIn;
