import React, { useContext, useState } from "react";
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Switch, View } from "react-native";

import {
  AntDesign,
  FontAwesome6,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
  SimpleLineIcons,
} from "@expo/vector-icons";
import { Href, router } from "expo-router";

import { Avatar } from "@/components";
import { Text } from "@/components/ui";
import { useGetRiderDetailsQuery } from "@/redux/actions/rider";
import { DataContext } from "@/store/GlobalState";
import SafeAreaViews from "@/components/safe-area-view";
import TopNavigation from "@/components/TopNavigation";
import AccountNavigation from "@/components/AccountNavigation";
import { colors, spacing } from "@/theme";
import { getInitials } from "@/utils/utils";
import { s } from "react-native-size-matters";
import { HandshakeIcon, ShakeIcon } from "@/assets/images/svgs";
import CustomModal from "@/components/ui/modal";
import { Button, ButtonText } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PostRequest } from "@/utils/requests";
import Input from "@/components/ui/input";

const schema = z.object({
  code: z.string().min(1, { message: "invite code is required" }),
});

const RiderAccount = () => {
  const { data: riderDetails } = useGetRiderDetailsQuery("");
  const { state } = useContext(DataContext)
  const { user } = state
  const [autoAcceptOrders, setAutoAcceptOrders] = useState(false)
  const [joinFleet, setJoinFleet] = useState(false)
  const [linkLoading, setLinkLoading] = useState(false)
  const [isFocused, setIsFocused] = useState(false);


  const accountLinks = [
    {
      icon: <MaterialCommunityIcons name="account-circle-outline" size={20} />,
      label: "Personal details",
      href: "/(rider)/rider-profile",
    },
    {
      icon: <HandshakeIcon />,
      label: "Partner info",
      href: "/(rider)/partner-info",
    },
    {
      icon: <Ionicons name="time-outline" size={20} />,
      label: "Business hours",
      href: user?.isUnderOrganization ? "/(rider)/partner-business-hours" : "/(rider)/business-hours",
    },
    {
      icon: <FontAwesome6 name="naira-sign" size={20} />,
      label: "Delivery rate",
      href: user?.isUnderOrganization ? "/(rider)/partner-delivery-rate" : "/(rider)/delivery-rate",
    },
    {
      icon: <ShakeIcon />,
      label: "Join a partner fleet",
      text: "Link your account to an organization and unlock more benefits",
      href: "",
    },
    {
      icon: <MaterialCommunityIcons name="lock-outline" size={20} />,
      label: "Change password",
      href: "/(rider)/change-password",
    },
  ];

  const filteredAccountLinks = accountLinks.filter((_, index) => {
    if (index === 1) {
      return user?.isUnderOrganization
    }
    else if (index === 4) {
      return !user?.isUnderOrganization
    }
    return true;
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      code: "",    },
    mode: "onSubmit",
  });

  const handleSubmit = async () => {
    setLinkLoading(true);

    const payload = {
      inviteCode: form.getValues("code"),
    };

    const res = await PostRequest(
      "/rider-management/apply-to-partner",
      payload,
      state?.token,
    );

    if (res?.status === 200 || res?.status === 201) {
      setJoinFleet(false);
      form.reset();
    }
    setLinkLoading(false);
  };


  return (
    <SafeAreaViews>
      <AccountNavigation title={`${user?.firstName} ${user?.lastName}`} />
      <ScrollView contentContainerStyle={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={{ backgroundColor: "white", flex: 1, padding: 16 }}>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              gap: 12,
            }}
          >
            {user?.metadata?.profileImageUrl ? <Image source={{ uri: user?.metadata?.profileImageUrl }} height={80} width={80} style={{ borderRadius: 50, borderWidth: 1, borderColor: colors.mutedForeground }} />
              : <View style={{ height: 80, width: 80, borderRadius: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.mutedForeground }}>
                <Text style={{ fontSize: s(18), fontWeight: "bold" }}>{getInitials(`${user?.firstName} ${user?.lastName}`)}</Text>
              </View>}

            <View style={{ flexDirection: "row", gap: 4 }}>
              <View
                style={{
                  height: 40,
                  width: 40,
                  backgroundColor: "white",
                  shadowColor: "black",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.2,
                  shadowRadius: 4,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 40,
                }}
              >
                <MaterialCommunityIcons name="star" size={25} color="#f97216" />
              </View>
              <View
                style={{ justifyContent: "center", alignItems: "center", gap: 2 }}
              >
                <Text style={{ fontSize: s(20), fontWeight: "bold" }}>
                  {user?.metadata?.averageRating}
                </Text>
                <Text>Rating</Text>
              </View>
            </View>
          </View>

          <View style={{ height: 2, backgroundColor: colors.muted, marginTop: 30, marginBottom: 10 }}></View>

          <View style={{ marginTop: 20, gap: 24 }}>
            {filteredAccountLinks.map((option, index) => (
              <Pressable
                onPress={() => option?.label === "Join a partner fleet" ? setJoinFleet(true) : router.push(option.href as Href)}
                key={index}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  height: 50,
                }}
              >
                <View
                  style={{ flexDirection: "row", alignItems: "flex-start", gap: 18 }}
                >
                  {option.icon}

                  <View>
                    <Text style={{ fontSize: 17, fontWeight: 500, }}>
                      {option.label}
                    </Text>
                    {option?.text &&
                      <Text style={{ fontSize: 12, fontWeight: 500, width: 270 }}>
                        {option.text}
                      </Text>}
                  </View>
                </View>

                <SimpleLineIcons name="arrow-right" size={12} />
              </Pressable>
            ))}
          </View>

          {/* <View
            style={{
              marginTop: 40,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View style={{ flexDirection: "row", gap: 12 }}>
              <MaterialCommunityIcons name="package-variant-closed" size={25} />
              <View style={{ maxWidth: 250, gap: 10 }}>
                <Text style={{ fontSize: 17, fontWeight: 500 }}>
                  Auto accept orders
                </Text>
                <Text style={{ fontSize: 15, lineHeight: 24 }}>
                  Automatically accept new orders without manual confirmation.
                </Text>
              </View>
            </View>

            <Switch
              value={autoAcceptOrders}
              onValueChange={() => setAutoAcceptOrders((prev) => !prev)}
              trackColor={{ false: "#D3D3D3", true: "#f97216" }}
              thumbColor="white"
            />
          </View> */}

          <CustomModal
            visible={joinFleet}
            onClose={() => setJoinFleet(false)}
          >
            <View>
              <Text style={styles.modalTitle}>Join a Partner Fleet</Text>
              <Text style={{ textAlign: 'center', marginBottom: 40 }}>Link your account to an organization and unlock more benefits</Text>

              <Form {...form}>
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company invite code</FormLabel>
                      <Input
                        style={{
                          backgroundColor: "#F3F3F3",
                          paddingHorizontal: spacing.sm,
                          borderColor: isFocused ? "#f97216" : "rgba(99, 99, 99, 0.5)",
                          borderWidth: 1
                        }}
                        autoCorrect={false}
                        placeholder="ZD938SGS3"
                        placeholderTextColor={"#63636380"}
                        onChangeText={field.onChange}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        {...field}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <View style={{ marginTop: 30 }}>
                  <Button
                    onPress={handleSubmit}
                    size="sm"
                    disabled={linkLoading || form.getValues("code") === ""}
                  >
                    <ButtonText>Link Account</ButtonText>
                    {linkLoading && (
                      <ActivityIndicator color="white" size="small" />
                    )}
                  </Button>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    backgroundColor: "#F972161A",
                    borderRadius: 25,
                    paddingVertical: 15,
                    paddingHorizontal: 15,
                    gap: 10,
                    justifyContent: "center",
                    alignItems: "center",
                    flexWrap: "wrap",
                    marginTop: 25,
                  }}
                >
                  <AntDesign name="exclamationcircleo" size={17} color="black" />
                  <Text style={{ color: "#636363", fontSize: s(11), flex: 1 }}>
                    Partners can manage your operations and earnings. This action cannot be undone.
                  </Text>
                </View>

              </Form>
            </View>
          </CustomModal>
        </View>
      </ScrollView>
    </SafeAreaViews>
  );
};

const styles = StyleSheet.create({
  modalTitle: {
    fontSize: 16,
    fontFamily: "interSemiBold",
    textAlign: "center",
    marginBottom: 10
  },
  modalMessage: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
  },
})

export default RiderAccount;
