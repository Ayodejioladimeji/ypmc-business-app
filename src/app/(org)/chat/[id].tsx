import React, { useContext, useEffect, useRef, useState, useCallback } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Avatar } from "@/components/Avatar";
import { colors } from "@/theme";
import { DataContext } from "@/store/GlobalState";
import images from "@/assets/images";
import { Text } from "@/components/ui";
import { handleDial } from "@/helpers/dialNumber";
import { Line } from "@/components/ui/line";
import { ACTIONS } from "@/store/Actions";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import UseChat from "./_components/use-chat";
import { groupMessagesByDate } from "@/utils/group-message";

const PartnerChat = () => {
  const { id, rider } = useLocalSearchParams();
  const riderDetails = JSON.parse(rider as string);
  const [message, setMessage] = useState("");
  const router = useRouter();
  const { state, dispatch } = useContext(DataContext);
  const { user, riderDetail, recipient } = state;
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<any[]>([]);
  const flatListRef = useRef<FlatList>(null);
  const groupedMessages = groupMessagesByDate(messages);


  const handleNewMessage = useCallback((newMessage: any) => {
    if (!newMessage || typeof newMessage !== "object") return;
    setMessages((prevMessages) => [newMessage, ...prevMessages]);
  }, []);

  const handleMessageHistory = useCallback((history: any) => {
    if (!history || typeof history !== "object" || !Array.isArray(history.messages)) {
      console.error("Invalid history format:", history);
      return;
    }
    setMessages(history.messages);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!state?.socket) return;
    state.socket.on("newPartnerRiderMessage", handleNewMessage);
    state.socket.on("partnerRiderMessageHistory", handleMessageHistory);

    return () => {
      state.socket.off("newPartnerRiderMessage", handleNewMessage);
      state.socket.off("partnerRiderMessageHistory", handleMessageHistory);
    };
  }, [state?.socket, handleNewMessage, handleMessageHistory]);

  const handleSendMessage = useCallback(() => {
    if (message.trim() && state?.socket) {
      const messageData = {
        partnerId: state?.user?.id,
        riderId: id,
        message: message.trim(),
      };
      state?.socket.emit("sendPartnerRiderMessage", messageData);
      setMessage("");
    }
  }, [message, recipient, state?.socket]);

  const formatTime = (date: Date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${ampm}`;
  };

  const handleBack = useCallback(() => {
    dispatch({ type: ACTIONS.CHATS, payload: null });
    dispatch({ type: ACTIONS.PARTNER_CALLBACK, payload: !state?.partnerCallback });
    router.back();
  }, [dispatch, router, state?.partnerCallback]);


  const renderableMessages = Object.entries(groupedMessages).flatMap(([date, msgs]) => [
    ...((msgs as any[]).map((msg) => ({ ...msg, type: "message" }))),
    { type: "header", date },
  ]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <UseChat riderId={id} />
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          backgroundColor: "white",
          paddingHorizontal: 12,
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Pressable
          onPress={handleBack}
          style={{
            backgroundColor: "white",
            padding: 12,
            borderRadius: 20,
          }}
        >
          <MaterialCommunityIcons name="close" size={20} />
        </Pressable>

        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Image
            source={riderDetails?.metadata?.profileImageUrl || riderDetails?.profileImageUrl || images?.user}
            style={{
              width: 48,
              height: 48,
              borderRadius: 50,
              borderWidth: 0.5,
              borderColor: colors.mutedForeground
            }}
            contentFit="contain"
          />
          <Text style={{ marginTop: 12, fontSize: 17, fontWeight: "600" }}>
            {riderDetails?.firstName} {riderDetails?.lastName}
          </Text>
        </View>

        <Pressable
          style={{
            backgroundColor: "white",
            padding: 12,
            borderRadius: 20,
            shadowColor: "black",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
          }}
          onPress={() => handleDial(riderDetails?.user?.phoneNumber)}
        >
          <MaterialCommunityIcons name="phone-outline" color={colors.primary} size={20} />
        </Pressable>
      </View>

      <Line />

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={renderableMessages}
        keyExtractor={(item, index) =>
          item.type === "header" ? `header-${item.date}-${index}` : item.id || index.toString()
        }
        renderItem={({ item }) => {
          if (item.type === "header") {
            return (
              <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 16 }}>
                <View style={{ flex: 1, height: 1, backgroundColor: "#ccc" }} />

                <View
                  style={{
                    marginHorizontal: 2,
                    borderWidth: 0.5,
                    borderColor: "#ccc",
                    borderRadius: 20,
                    paddingHorizontal: 12,
                    paddingVertical: 4,
                    backgroundColor: "white",
                  }}
                >
                  <Text style={{ fontSize: 13, color: "#444" }}>{item.date}</Text>
                </View>

                <View style={{ flex: 1, height: 1, backgroundColor: "#ccc" }} />
              </View>

            )
          }

          const isSender = item.senderId === user?.id;

          return (
            <View style={{ marginBottom: 12, alignItems: isSender ? "flex-end" : "flex-start" }}>
              {!isSender && (
                <View style={{ marginBottom: 5 }}>
                  <Avatar size={20} source={{ uri: item?.profileImage }} />
                </View>
              )}

              <View
                style={{
                  alignSelf: isSender ? "flex-end" : "flex-start",
                  backgroundColor: isSender ? "#FFECE0" : "#EAEAEA",
                  padding: 10,
                  borderTopRightRadius: 10,
                  borderTopLeftRadius: 10,
                  borderBottomLeftRadius: isSender ? 10 : 0,
                  borderBottomRightRadius: isSender ? 0 : 10,
                  maxWidth: "85%",
                  borderWidth: 0.3,
                  borderColor: colors.mutedForeground,
                }}
              >
                <Text style={{ fontSize: 16, lineHeight: 25 }}>{item.message}</Text>
              </View>
              <Text
                style={{
                  fontSize: 12,
                  color: "gray",
                  marginTop: 5,
                }}
              >
                {formatTime(new Date(item.createdAt))}
              </Text>
            </View>
          );
        }}
        contentContainerStyle={{ padding: 16 }}
        style={{ flex: 1 }}
        inverted
      />

      {loading && (
        <View style={{ marginBottom: 20 }}>
          <ActivityIndicator />
        </View>
      )}

      {riderDetails && (
        <View style={{ paddingVertical: 8, paddingHorizontal: 12 }}>
          <FlatList
            data={[
              "Where are you currently located?",
              "Have you picked up the package?",
              "Confirm once the pickup is completed",
              "How long until delivery is done?",
              "Please call the client before arrival",
              "Ensure the package is delivered safely",
              "Was the delivery successful?",
              "Kindly update the delivery status",
              "Don't forget to collect payment",
              "Is the client at the location?",
              "Let us know if there are any issues",
              "Please be polite with the customer",
              "Keep us informed of any delays",
              "Share proof of delivery when done",
              "Have you encountered any traffic issues?",
              "Please double-check the address",
              "Use the app to update your status",
              "Start heading to the next delivery",
              "Thanks for your hard work today"
            ]}

            horizontal
            keyExtractor={(item, index) => index.toString()}
            showsHorizontalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={{ width: 8 }} />}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => setMessage(item)}
                style={{
                  backgroundColor: "#f1f1f1",
                  borderRadius: 20,
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                  borderBottomRightRadius: 0,
                  borderWidth: 0.3
                }}
              >
                <Text style={{ fontSize: 14 }}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {/* Text Input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ paddingHorizontal: 12, backgroundColor: "white" }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 20,
            paddingHorizontal: 10,
            backgroundColor: "#f3f3f3",
          }}
        >
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Type a message"
            placeholderTextColor="gray"
            style={{ flex: 1, padding: 18, fontSize: 16 }}
            multiline
          />
          <Pressable
            onPress={handleSendMessage}
            style={{
              backgroundColor: "black",
              padding: 10,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 40,
            }}
          >
            <MaterialCommunityIcons name="send" size={20} color="white" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default PartnerChat;
