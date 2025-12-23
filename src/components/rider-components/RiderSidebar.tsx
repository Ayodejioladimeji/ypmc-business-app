
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Pressable,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  ScrollView,
  Dimensions, // Import Dimensions
  Platform,
  TouchableOpacity
} from "react-native";

import { AntDesign, FontAwesome5, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Href, router, useSegments } from "expo-router";
import { BellIcon, BoxIcon, CalendarIcon, RiderAccountIcon, RiderBellIcon, RiderBikeIcon, RiderLogoutIcon, RiderMessageIcon, RiderWalletIcon } from "@/assets/images/svgs";
import { DataContext } from "@/store/GlobalState";
import { Avatar } from "../Avatar";
import { s } from "react-native-size-matters";
import { removeToken } from "@/utils/helper";
import { getInitials } from "@/utils/utils";
import CustomModal from "../ui/modal";
import { Button, ButtonText } from "../ui/button";
import { ACTIONS } from "@/store/Actions";
import { GetRequest, PatchRequest, PostRequest } from "@/utils/requests";
import { Line } from "../ui/line";
import { Image } from "expo-image";
import { colors } from "@/theme";

const { width, height } = Dimensions.get('window'); // Get screen dimensions

export const RiderSidebar = () => {
  const { state, dispatch } = useContext(DataContext)
  const { user, messages, incoming } = state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarAnim = useRef(new Animated.Value(-width)).current;
  const [signOutModal, setSignOutModal] = useState(false)
  const segments = useSegments();
  const homeSegment = segments.find((seg) => seg === "home");
  const [logoutLoading, setLogoutLoading] = useState(false)
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (state?.token) {
      const getNotifications = async () => {
        const res = await GetRequest("/notifications?page=1&limit=30", state?.token)
        if (res?.status === 200 || res.status === 201) {
          dispatch({ type: ACTIONS.NOTIFICATIONS, payload: res?.data?.data?.data })
          const notificationCount = res?.data?.data?.data?.filter(item => item?.isRead === false)
          setCount(notificationCount?.length)
        }

      }
      getNotifications()
    }
  }, [state?.token, state?.message, state?.notificationCallback])


  const openSidebar = () => {
    setIsSidebarOpen(true);
    Animated.timing(sidebarAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const closeSidebar = () => {
    Animated.timing(sidebarAnim, {
      toValue: -width, // Animate back off-screen
      duration: 500,
      useNativeDriver: true,
    }).start(() => setIsSidebarOpen(false));
  };

  const links = [
    { label: "Incoming Orders", href: "/(rider)/rider-shippings", icon: "bike", badge: true },
    { label: "My Deliveries", href: "/(rider)/rider-deliveries", icon: "box", badge: false },
    { label: "Scheduled Orders", href: "/(rider)/scheduled-shipment", icon: "calendar", badge: false },
    { label: "Wallet", href: "/(rider)/wallet", icon: "wallet-outline", badge: false },
    {
      label: "Messages",
      href: "/(rider)/rider-messages",
      icon: "chat-outline", badge: false,
    },
    { label: "Account", href: "/account", icon: "account-outline", badge: false },
  ];

  const supportLinks = [
    { label: "Help & Support", href: "/(rider)/support" },
    { label: "FAQs", href: "/(rider)/faqs" },
  ];

  // logout
  const handleLogout = async () => {
    const payload = {
      deviceToken: state?.deviceInfo?.deviceToken
    }
    setLogoutLoading(true)

    // await PostRequest("/auth/logout", payload, state?.token)
    await removeToken("token")
    router.replace("/onboarding")
    dispatch({ type: ACTIONS.USER, payload: null })

    setLogoutLoading(false)
  }

  const handleRoute = (link: any) => {
    router.push(link.href as Href)

    if (link.label === "Incoming Orders" && incoming) {
      dispatch({ type: ACTIONS.INCOMING })
      console.log("distinct")
    }
    if (link.label === "Messages" && messages) {
      dispatch({ type: ACTIONS.MESSAGES })
    }
    setTimeout(() => {
      closeSidebar()
    }, 500)

  }


  const handleRead = async () => {
    router.push("/(rider)/rider-notifications")
    const res = await PatchRequest(`/notifications/read-all`, {}, state?.token)
    if (res?.status === 200 || res?.status === 201) {
      dispatch({ type: ACTIONS.NOTIFICATION_CALLBACK, payload: !state?.notificationCallback })
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity onPress={openSidebar} style={styles.menuButton}>
        <MaterialCommunityIcons name="menu" size={25} color="black" />
      </TouchableOpacity>



      {homeSegment === "home" ?
        <TouchableOpacity onPress={handleRead} style={styles.notificationButton}>
          <View style={{ position: "relative" }}>
            <Ionicons name="notifications-outline" size={22} />

            {count > 0 && <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>{count}</Text>
            </View>}
          </View>
        </TouchableOpacity>
        :
        <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
          <FontAwesome5 name="times" size={20} color="black" />
        </TouchableOpacity>}

      {isSidebarOpen && (
        <TouchableWithoutFeedback onPress={closeSidebar}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback>
              <Animated.View
                style={[
                  styles.sidebarContainer,
                  { transform: [{ translateX: sidebarAnim }] },
                ]}
              >
                <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between' }} showsVerticalScrollIndicator={false}>
                  <View>
                    <View style={styles.section}>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: 'center',
                          gap: 12,
                          marginTop: Platform.OS === "android" ? 20 : 50,
                          marginBottom: Platform.OS === "android" ? 20 : 30,
                        }}
                      >
                        {user?.metadata?.profileImageUrl ?
                          <Image
                            source={{ uri: user?.metadata?.profileImageUrl }}
                            style={{
                              width: 35,
                              height: 35,
                              borderRadius: 50

                            }}
                          />
                          :
                          <View style={{ alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: "50%", borderWidth: 1, borderColor: "#999" }}>
                            <Text>{user?.firstName.charAt(0).toUpperCase()}{user?.lastName.charAt(0).toUpperCase()}</Text>
                          </View>}

                        <Text
                          style={{
                            fontSize: s(14),
                            fontWeight: 600,

                          }}
                        >
                          {user?.firstName} {user?.lastName}
                        </Text>
                      </View>
                    </View>

                    {/* Mapping Links */}
                    <View style={styles.section}>
                      {links.map((link, index) => (
                        <TouchableOpacity
                          onPress={() => handleRoute(link)}
                          key={index}
                          style={styles.linkContainer}
                        >
                          {link.icon === "account-outline" ? <RiderAccountIcon /> :
                            link.icon === "chat-outline" ? <RiderMessageIcon /> :
                              link.icon === "bell-outline" ? <RiderBellIcon /> :
                                link.icon === "wallet-outline" ? <RiderWalletIcon /> :
                                  link.icon === "box" ? <BoxIcon /> :
                                    link.icon === "calendar" ? <CalendarIcon />
                                      : <RiderBikeIcon />}
                          <Text style={styles.link}>
                            {link.label}
                          </Text>
                          {link.label === "Incoming Orders" && incoming && <View style={{ marginTop: -5, height: 7, width: 7, borderRadius: 50, backgroundColor: 'red' }}></View>}
                          {link.label === "Messages" && messages && <View style={{ marginTop: -5, height: 7, width: 7, borderRadius: 50, backgroundColor: 'red' }}></View>}
                        </TouchableOpacity>
                      ))}
                    </View>

                    <Line />

                    {/* Support Section */}
                    <View style={styles.section}>
                      {supportLinks.map((link, index) => (
                        <Pressable
                          onPress={() => handleRoute(link)}
                          key={index}
                          style={styles.linkContainer}
                        >
                          <Text style={styles.link}>{link.label}</Text>
                        </Pressable>
                      ))}
                    </View>
                  </View>

                  {/* Sign Out Button */}
                  <Pressable
                    onPress={() => setSignOutModal(true)}
                    style={styles.signOutSection}
                  >
                    {logoutLoading ? <ActivityIndicator color="white" /> :
                      <RiderLogoutIcon />}
                    <Text style={styles.signOutButton}>Sign Out</Text>
                  </Pressable>
                </ScrollView>
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      )}

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
  menuButton: {
    position: "absolute",
    top: width * 0.1,
    left: 12,
    height: 40,
    width: 40,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 40,
    margin: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    borderWidth:0.5,
    borderColor:colors.border
    // elevation: 2
  },
  notificationButton: {
    position: "absolute",
    top: width * 0.1,
    right: 12,
    height: 40,
    width: 40,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 40,
    margin: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    // elevation: 2
  },
  notificationBadge: {
    position: "absolute",
    right: -5,
    top: -5,
    height: 18,
    width: 18,
    backgroundColor: "red",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  notificationBadgeText: {
    color: "white",
    fontSize: 10,
    fontFamily: "interSemiBold",
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 12,
    height: 40,
    width: 40,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 40,
    margin: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 80,
    flex: 1,
    height: height
  },
  sidebarContainer: {
    width: width * 0.7,
    height: height,
    backgroundColor: "white",
    padding: 16,
    paddingLeft: 18,
    flexDirection: 'column',
    zIndex: 90,
    flex: 1,
  },
  section: {
    marginTop: 24,
    marginBottom: 10,
    gap: 16,
  },
  linkContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: Platform.OS === "android" ? 6 : 10,
    gap: 8,
    position: 'relative'
  },
  icon: {
  },
  link: {
    fontSize: Platform.OS === "android" ? 14 : 16,
    color: "#020202",
  },
  signOutSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 20,
    marginBottom: Platform.OS === "ios" ? 20 : 0
  },
  signOutButton: {
    fontSize: 16,
    color: "red",
  },
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
});