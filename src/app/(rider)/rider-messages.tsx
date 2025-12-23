import React, { useContext, useState } from "react";
import { ActivityIndicator, FlatList, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SvgXml } from "react-native-svg";

import { emptyMessage } from "@/assets/svgs";
import { SearchBar } from "@/components";
import {
  RiderCustomerMessages,
} from "@/components/rider-components/messages";
import { Text } from "@/components/ui";
import TopNavigation from "@/components/TopNavigation";
import { s } from "react-native-size-matters";
import { colors } from "@/theme";
import UseChat from "../(chat)/_components/use-chat";
import { DataContext } from "@/store/GlobalState";
import { searchFilter } from "@/utils/filter";
import { SocketClient } from "@/components/rider-components/socket-client";


const Messages = () => {
  const { state } = useContext(DataContext)
  const [tab, setTab] = useState(state?.user?.isUnderOrganization ? "partner" : "customer")
  const [search, setSearch] = useState('')

  const partnerFitered = searchFilter(state?.activeChats, search)
  const customerFitered = searchFilter(state?.activeCustomerChats, search)


  // 

  return (
    <>
      <UseChat />
      <SocketClient />
      <SafeAreaView
        style={{
          height: "100%",
          paddingBottom: 24,
          backgroundColor: "white",
        }}
      >
        <TopNavigation title="" />
        <View style={{ flex: 1, gap: 24, paddingHorizontal: 16, marginTop: 10 }}>
          <Text style={{ fontSize: s(24), fontWeight: 600 }}>Messages</Text>
          <SearchBar placeholder={"Search"} value={search} onChangeText={(value) => setSearch(value)}/>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20, borderBottomWidth: 1, borderColor: colors.border }}>
            {state?.user?.isUnderOrganization && <TouchableOpacity onPress={() => setTab("partner")} activeOpacity={0.7} style={{ paddingVertical: 20, borderBottomWidth: tab === "partner" ? 1 : 0, borderColor: colors.primary }}>
              <Text style={{ fontSize: s(14), color: tab === "partner" ? colors.primary : colors.mutedForeground, fontWeight: "semibold" }}>My Partner</Text>
            </TouchableOpacity>}

            <TouchableOpacity onPress={() => setTab("customer")} activeOpacity={0.7} style={{ paddingVertical: 20, borderBottomWidth: tab === "customer" ? 1 : 0, borderColor: colors.primary }}>
              <Text style={{ fontSize: s(14), color: tab === "customer" ? colors.primary : colors.mutedForeground, fontWeight: "semibold" }}>Customers</Text>
            </TouchableOpacity>

          </View>


          {tab === "partner" ?
            <>
              {state?.partnerChatLoading ? <ActivityIndicator />
                :
                <FlatList
                  data={partnerFitered}
                  renderItem={({ item }) => (
                    <RiderCustomerMessages
                      data={item}
                    />
                  )}
                  showsVerticalScrollIndicator={false}
                  keyExtractor={(item) => item.id}
                  keyboardShouldPersistTaps="handled"
                  ListEmptyComponent={
                    <View
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        gap: 12,
                      }}
                    >
                      <SvgXml xml={emptyMessage} />
                      <Text style={{ fontSize: 17, color: "gray" }}>
                        You have no messages at the moment
                      </Text>
                    </View>
                  }
                />
              }
            </>
            :

            <>
              {state?.customerChatLoading ? <ActivityIndicator />
                :
                <FlatList
                  data={customerFitered}
                  renderItem={({ item }) => (
                    <RiderCustomerMessages
                      data={item}
                    />
                  )}
                  showsVerticalScrollIndicator={false}
                  keyExtractor={(item) => item.lastMessage?.id}
                  keyboardShouldPersistTaps="handled"
                  ListEmptyComponent={
                    <View
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        gap: 12,
                      }}
                    >
                      <SvgXml xml={emptyMessage} />
                      <Text style={{ fontSize: 17, color: "gray" }}>
                        You have no messages at the moment
                      </Text>
                    </View>
                  }
                />
              }
            </>

          }
        </View>
      </SafeAreaView>
    </>
  );
};

export default Messages;
