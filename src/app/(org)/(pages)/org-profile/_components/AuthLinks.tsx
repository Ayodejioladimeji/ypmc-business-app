import React, { useContext, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import {
  AntDesign,
  Feather,
  MaterialCommunityIcons,
  SimpleLineIcons,
} from "@expo/vector-icons";

import { Text } from "@/components/ui";
import CustomModal from "@/components/ui/modal";
import { Button, ButtonText } from "@/components/ui/button";
import { removeToken } from "@/utils/helper";
import { DataContext } from "@/store/GlobalState";
import { ACTIONS } from "@/store/Actions";
import { useRouter } from "expo-router";
import { s } from "react-native-size-matters";

const AuthLinks = () => {
  const [signOutModal, setSignOutModal] = useState(false)
  const [logoutLoading, setLogoutLoading] = useState(false)
  const {dispatch} = useContext(DataContext)
  const router = useRouter()

  // logout
  const handleLogout = async () => {

    setLogoutLoading(true)

    // await PostRequest("/auth/logout", payload, state?.token)
    await removeToken("token")
    router.replace("/onboarding")
    dispatch({ type: ACTIONS.USER, payload: null })

    setLogoutLoading(false)
  }

  // 

  return (
    <View
      style={{
        backgroundColor: "white",
        padding: 14,
        paddingTop:0,
        gap: 4,
      }}
    >
      <TouchableOpacity onPress={() => router.push("/change-password")}
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingVertical: 16,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 18 }}>
          <MaterialCommunityIcons name="lock-outline" size={20} />
          <Text style={{ fontSize: s(13), fontWeight: 500 }}>
            Change password
          </Text>
        </View>
        <SimpleLineIcons name="arrow-right" size={12} />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setSignOutModal(true)}
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingVertical: 16,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 18, marginBottom:30 }}>
          <Feather name="log-out" size={20} />
          <Text style={{ fontSize: s(13), fontWeight: 500 }}>
            Sign out
          </Text>
        </View>
        <SimpleLineIcons name="arrow-right" size={12} />
      </TouchableOpacity>

      <CustomModal
        visible={signOutModal}
        onClose={() => setSignOutModal(false)}
      >
        <View style={{ paddingHorizontal: 10 }}>
          <Text style={styles.modalTitle}>Sign Out</Text>
          <Text style={styles.modalDescription}>
            Are you sure you want to Sign Out?
          </Text>

          <View style={{ marginTop: 50 }}>
            <Button size="sm" onPress={handleLogout}>
              <ButtonText>Sign Out </ButtonText>
              <AntDesign name="logout" size={24} color="white" />
            </Button>

            <Button
              variant="outline"
              style={{ marginTop: 10 }}
              onPress={() => setSignOutModal(false)}
            >
              <ButtonText>Cancel </ButtonText>
            </Button>
          </View>
        </View>
      </CustomModal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalTitle: {
    fontSize: 16,
    fontFamily: "interSemiBold",
    textAlign: "center",
  },
  modalDescription: {
    marginTop: 20,
    color: "#636363",
    fontSize: 14,
    fontFamily: "interRegular",
    textAlign: "center",
  },
})

export default AuthLinks

