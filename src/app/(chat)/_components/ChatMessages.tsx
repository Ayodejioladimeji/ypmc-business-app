import React from "react";
import { FlatList, View } from "react-native";

import { Avatar } from "@/components";

import { Text } from "@/components/ui";

 const ChatMessages = ({ messages, setMessage }:any) => {
  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  return (
    <FlatList
      data={messages}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <>
          <View
            style={{
              alignSelf: item.sender === "sender" ? "flex-end" : "flex-start",
            }}
          >
            <Avatar
              size={16}
              source={{
                uri: "",
              }}
            />
          </View>
          <View
            style={{
              marginVertical: 8,
              alignSelf: item.sender === "sender" ? "flex-end" : "flex-start",
              backgroundColor: item.sender === "sender" ? "#DCF8C5" : "#EAEAEA",
              padding: 10,
              borderRadius: 10,
              maxWidth: "85%",
            }}
          >
            <Text style={{ fontSize: 16, lineHeight: 25 }}>{item.text}</Text>
            <Text style={{ fontSize: 12, color: "gray", marginTop: 4 }}>
              {formatTime(new Date(item.timestamp))}
            </Text>
          </View>
        </>
      )}
      ListEmptyComponent={
        <Text
          style={{
            fontSize: 15,
            fontWeight: 400,
            color: "gray",
            marginTop: "auto",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          Start a conversation
        </Text>
      }
      contentContainerStyle={{ padding: 16, flexGrow: 1 }}
      style={{ flex: 1 }}
    />
  );
};

export default ChatMessages
