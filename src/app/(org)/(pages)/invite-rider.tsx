import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";

import { Entypo, Feather, FontAwesome6, MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";

import { Button, ButtonText } from "@/components/ui/button";
import { colors, spacing } from "@/theme";
import { useContext } from "react";
import { DataContext } from "@/store/GlobalState";
import SafeAreaViews from "@/components/safe-area-view";
import TopNavigation from "@/components/TopNavigation";
import { Text } from "@/components/ui";
import ShareAndCopy from "@/components/org-components/share-and-copy";
import { s } from "react-native-size-matters";
import { ScoutIcon } from "@/assets/images/svgs";

const InviteRider = () => {
  const {state} = useContext(DataContext)

  return (
    <SafeAreaViews>

    <ScrollView style={styles.container}>
      <View style={{ alignItems: "center", marginTop: 20 }}>
        <View style={styles.imageContainer}>
          <Image
            source={require("@/assets/images/invite-bike.png")}
            style={{
              width: 82,
              height: 85,
              alignSelf: "center",
            }}
          />
        </View>

       <ShareAndCopy/>
      </View>

      <View
        style={{
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: "#6363631A",
        }}
      />

      <View style={{ marginTop: spacing.xl }}>
        

        <View style={styles.statContainer}>
          <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
            <ScoutIcon/>
              <View
                style={{
                  borderWidth: 1,
                  borderRadius: 100,
                  borderColor: "gray",
                  height: 32,
                  width: 32,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <MaterialCommunityIcons name="arrow-right-thin" size={20} />
              </View>
          </View>

            <Text style={{ fontSize: s(15), fontFamily: "interMedium" }}>
              Scout Rider
            </Text>
            <Text style={styles.statTitle}>Post vacancies and attract the highest rated riders to your company.</Text>

        </View>

        <View style={styles.banner}>
          <Feather name="info" size={24} color={colors.primary} />
          <Text style={{ color: "rgba(99, 99, 99, 1)", fontSize: 12, flex: 1 }}>
              Above is your unique invite Code to add Riders. Riders should enter the code on YPMC business app to join your company.
          </Text>
        </View>
      </View>
    </ScrollView>
    </SafeAreaViews>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: 204,
    width: 204,
    borderRadius: 102,
    backgroundColor: "#F972161A",
    // marginTop: spacing.huge,
  },
  buttonContainer: {
    marginTop: spacing.md,
    marginBottom: spacing.md,
    gap: 10,
    display: "flex",
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
  },
  statContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#6363631A",
    borderRadius: 20,
    marginTop: spacing.sm,
    paddingHorizontal: 15,
    paddingVertical: spacing.md,
    gap: 5,
  },
  statTitle: {
    color: "#636363",
    fontSize: 12,
    fontFamily: "interMedium",
  },
  banner: {
    marginTop: spacing.xl,
    marginBottom: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "rgba(249, 114, 22, 0.1)",
    flexDirection: "row",
    gap: 10,
  },
});

export default InviteRider
