import React, { useContext, useEffect } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

import { router, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { CustomButton } from "@/components";
import { images } from "@/constants";
import { DataContext } from "@/store/GlobalState";
import LocationEmitter from "@/helpers/LocationEmitter";

const Onboarding = () => {
  const router = useRouter()
  const {state} = useContext(DataContext)



  return (
    <SafeAreaView style={ styles.container }>
      <LocationEmitter/>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom:50,paddingHorizontal:10 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >

        <Image source={images.onboardingImage} style={styles.image} />

        <Text style={styles.titleText}>Welcome to YPMC Business</Text>
        <Text style={styles.descriptionText}>
          Earn money by partnering with us. Mange your riders, accept orders and
          lots more.
        </Text>

        <View style={styles.buttonContainer}>
          <CustomButton
            title="Login"
            bgVariant="primary"
            onPress={() => router.push("/(auth)/sign-in")}
          />
          <CustomButton
            title="Sign up"
            bgVariant="secondary"
            textVariant="secondary"
            onPress={() => router.push("/(auth)/sign-up")}
            // onPress={() => router.push("/(auth)/rider/rider-sign-up")}
          />
          <Text>Delivering goods the smart way...</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex:1,
  },
  image: {
    width: "100%",
    height: 250,
    borderRadius: 24,
    resizeMode: "cover",
  },
  titleText: {
    marginTop: 32,
    fontSize: 36,
    fontWeight: "500",
    color: "#000000",
    textAlign: "center",
  },
  descriptionText: {
    marginTop: 12,
    color: "#636363",
    fontSize: 16,
    lineHeight: 20,
    textAlign: "center",
    padding: 10,
  },
  buttonContainer: {
    padding: 8,
    marginTop: 32,
    gap: 16,
    display: "flex",
    width: "100%",
    alignItems: "center",
  },
});

export default Onboarding;
