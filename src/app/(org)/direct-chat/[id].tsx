import React, { useContext, useEffect, useRef, useState, useCallback } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  TextInput,
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

const DirectChat = () => {
  const { id, rider } = useLocalSearchParams();
  const [message, setMessage] = useState("");
  const router = useRouter();
  const { state, dispatch } = useContext(DataContext);
  const { user, riderDetail, recipient} = state;
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<any[]>([]);


  const flatListRef = useRef<FlatList>(null);

  // Memoized function to prevent unnecessary re-renders
  const handleNewMessage = useCallback(
    (newMessage: any) => {
      if (!newMessage || typeof newMessage !== "object") return;
      setMessages((prevMessages) => [newMessage, ...prevMessages]);
      console.log(newMessage, user?.id)
    },
    []
  );

  // Memoized function for handling chat history
  const handleMessageHistory = useCallback(
    (history: any) => {
      if (!history || typeof history !== "object" || !Array.isArray(history.messages)) {
        console.error("Invalid history format:", history);
        return;
      }
      console.log("history messages", history?.messages, user?.id)
      setMessages(history.messages);
      setLoading(false);
    },
    []
  );

  useEffect(() => {
    if (!state?.socket) return;

    state.socket.on("newPartnerRiderMessage", handleNewMessage);
    state.socket.on("partnerRiderMessageHistory", handleMessageHistory);

    return () => {
      state.socket.off("newPartnerRiderMessage", handleNewMessage);
      state.socket.off("partnerRiderMessageHistory", handleMessageHistory);
    };

  }, [state?.socket, handleNewMessage, handleMessageHistory]);


  // Handles sending messages
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

  return (
    <SafeAreaView style={{flex:1, backgroundColor:'white'}}>
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
                  source={recipient?.profileImage || images?.user}
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
            {recipient?.name}
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
          onPress={() => handleDial(riderDetail?.phoneNumber)}
        >
          <MaterialCommunityIcons name="phone-outline" color={colors.primary} size={20} />
        </Pressable>
      </View>

      <Line />

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item, index) => item.id || index.toString()} 
        renderItem={({ item }) => {
          const isSender = item.senderId === user?.id;

          return (
            <View style={{ marginBottom: 12 }}>
              {!isSender &&
                <View style={{ marginBottom: 5 }}>
                  <Avatar size={20} source={{ uri: item?.profileImage }} />
                </View>
              }
              <View
                style={{
                  alignSelf: isSender ? "flex-end" : "flex-start",
                  backgroundColor: isSender ? "#fff" : "#EAEAEA",
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
                  alignSelf: isSender ? "flex-end" : "flex-start",
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

export default DirectChat;
