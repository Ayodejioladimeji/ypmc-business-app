import React, { useContext } from "react";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { DataContext } from "@/store/GlobalState";
import UseChat from "./_components/use-chat";
import PartnerChat from "./_components/partner-chat";
import CustomerChat from "./_components/customer-chat";

const Chat = () => {
  const { id } = useLocalSearchParams();
  const { state } = useContext(DataContext);

  console.log(state?.recipient?.role)

  // 

  return (
    <>
      <UseChat recipientId={id} />
      <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
        {state?.recipient?.role === "PARTNER" ? <PartnerChat /> : <CustomerChat />}
      </SafeAreaView>
    </>
  );
};

export default Chat;
