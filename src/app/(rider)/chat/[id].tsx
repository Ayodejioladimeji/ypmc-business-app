import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
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
import { SafeAreaView } from "react-native-safe-area-context";
import { Avatar } from "@/components/Avatar";
import { colors } from "@/theme";
import { DataContext } from "@/store/GlobalState";
import images from "@/assets/images";
import { getInitials } from "@/utils/utils";
import { Text } from "@/components/ui";
import { handleDial } from "@/helpers/dialNumber";
import UseChat from "./_components/use-chat";

const Chat = () => {
  const { id: shippingId } = useLocalSearchParams();
  const [message, setMessage] = useState("");
  const router = useRouter();
  const { state } = useContext(DataContext);
  const { user, order } = state;
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const flatListRef = useRef<FlatList>(null);

  // Memoized function to prevent unnecessary re-renders
  const handleNewMessage = useCallback(
    (newMessage: any) => {
      if (!newMessage || typeof newMessage !== "object") return;
      setMessages((prevMessages) => [newMessage, ...prevMessages]);
      // console.log(newMessage)
    },
    []
  );

  // Memoized function for handling chat history
  const handleMessageHistory = useCallback(
    (history: any) => {
      // console.log("This is hisotry", history)
      if (!history || typeof history !== "object" || !Array.isArray(history.messages)) {
        console.log("Invalid history format:", history);
        return;
      }
      setMessages(history.messages);
      setLoading(false);
    },
    []
  );

  useEffect(() => {
    if (!state?.socket) return;

    state.socket.on("newMessage", handleNewMessage);
    state.socket.on("messageHistory", handleMessageHistory);

    return () => {
      state.socket.off("newMessage", handleNewMessage);
      state.socket.off("messageHistory", handleMessageHistory);
    };
  }, [state?.socket, handleNewMessage, handleMessageHistory]);

  // Handles sending messages
  const handleSendMessage = useCallback(() => {
    if (message.trim() && state?.socket) {
      const messageData = {
        shippingId: shippingId,
        message: message.trim(),
      };
      state?.socket.emit("sendMessage", messageData);
      setMessage(""); // Reset input field
    }
  }, [message, state?.socket]);


  const formatTime = (date: Date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${ampm}`;
  };


  // 

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      {/* Header */}
      <UseChat shippingId={shippingId} />
      <View
        style={{
          flexDirection: "row",
          backgroundColor: "white",
          paddingHorizontal: 12,
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            backgroundColor: "white",
            padding: 12,
            borderRadius: 20,
          }}
        >
          <MaterialCommunityIcons name="close" size={20} />
        </TouchableOpacity>

        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <View style={{ alignItems: 'center', justifyContent: 'center', width: 48, height: 48, borderRadius: "50%", borderWidth: 1, borderColor: "#999" }}>
            <Text>{getInitials(order?.senderInfo?.name)}</Text>
          </View>

          <Text style={{ marginTop: 12, fontSize: 17, fontWeight: "600" }}>
            {order?.senderInfo?.name}
          </Text>
        </View>

        <TouchableOpacity
          style={{
            backgroundColor: "white",
            padding: 12,
            borderRadius: 20,
            shadowColor: "black",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
          }}
          onPress={() => handleDial(order?.senderInfo?.contactInfo?.phoneNumber)}
        >
          <MaterialCommunityIcons name="phone-outline" color={colors.primary} size={20} />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item?.id || Math.random().toString()}
        renderItem={({ item }) => {
          const isSender = item?.sender?.id === user?.id;


          return (
            <View style={{ marginBottom: 12 }}>
              {/* {!isSender &&
                <View style={{ marginBottom: 5 }}>
                  <Avatar size={20} source={{ uri: item?.profileImage }} />
                </View>
              } */}
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
                  alignSelf: isSender ? "flex-end" : "flex-start",
                  fontSize: 12,
                  color: "gray",
                  marginTop: 5
                }}
              >
                {formatTime(new Date(item.createdAt))}
              </Text>
            </View>
          );
        }}
        contentContainerStyle={{ padding: 16 }}
        style={{ flex: 1 }}
        // onContentSizeChange={goToBottom}
        inverted
      />

      {loading && (
        <View style={{ marginBottom: 20 }}>
          <ActivityIndicator />
        </View>
      )}

      {order && (
        <View style={{ paddingVertical: 8, paddingHorizontal: 12 }}>
          <FlatList
            data={[
              "I'm on my way",
              "I'm nearby",
              "I'll arrive shortly",
              "Can you come outside?",
              "I'm at the gate",
              "Please call me",
              "Running a few minutes late",
              "Kindly pick up your call",
              "Please confirm your address",
              "I'm stuck in traffic",
              "Kindly be patient",
              "Thank you for waiting",
              "Package delivered",
              "Please check your package",
              "Delivery completed",
              "Do you have change?",
              "Please rate the delivery",
              "Call me when you're ready",
              "Let me know if there's an issue",
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
            marginBottom: 10
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

export default Chat;
