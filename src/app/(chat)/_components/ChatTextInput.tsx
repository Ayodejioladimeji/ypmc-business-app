import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  TextInput,
  View,
} from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";

const ChatTextInput = ({ message, setMessage, handleSendMessage }:any) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: "white",
      }}
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
  );
};

export default ChatTextInput
