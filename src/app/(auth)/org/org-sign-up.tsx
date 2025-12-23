import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import TopNavigation from "@/components/TopNavigation";
import { Text } from "@/components/ui";
import { s } from "react-native-size-matters";
import { PersonalInfo } from "@/components/auth/OrganizationAuth/PersonalInfo";


const OrgSignUp = () => {

  //

  return (
      <SafeAreaView style={styles.container}>
        <TopNavigation title="" />

        <ScrollView>
              <View style={{ paddingHorizontal: 10, gap: 10, marginBottom:10 }}>
                <Text style={{ fontWeight: 600, fontSize: s(18) }}>
                  Let's get you started
                </Text>

                <Text style={{ fontSize: s(14), color: "gray" }}>
                  Sign up to begin delivering and earning with us.
                </Text>
              </View>

              <PersonalInfo/>

        </ScrollView>

      </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default OrgSignUp;
