import React, { useContext, useState } from "react";
import { ActivityIndicator, FlatList, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SvgXml } from "react-native-svg";

import { emptyMessage } from "@/assets/svgs";
import { SearchBar } from "@/components";
import { Text } from "@/components/ui";
import TopNavigation from "@/components/TopNavigation";
import { s } from "react-native-size-matters";
import { colors } from "@/theme";
import { DataContext } from "@/store/GlobalState";
import { searchFilter } from "@/utils/filter";
import UseChat from "./chat/_components/use-chat";
import { RiderPartnerMessages } from "@/components/org-components/messages/RiderPartnerMessages";


const Messages = () => {
  const { state } = useContext(DataContext)
  const [search, setSearch] = useState('')

  const partnerFitered = searchFilter(state?.activeChats, search)


  // 

  return (
    <>
      <UseChat />
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
          <SearchBar placeholder={"Search"} value={search} onChangeText={(value) => setSearch(value)} />

          <>
            {state?.partnerChatLoading ? <ActivityIndicator />
              :
              <>
                {partnerFitered?.length === 0 ?
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

                  :

                  <FlatList
                    data={partnerFitered}
                    renderItem={({ item }) => (
                      <RiderPartnerMessages
                        data={item}
                      />
                    )}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item) => item.id}
                    keyboardShouldPersistTaps="handled"
                  />
                }
              </>
            }
          </>
        </View>
      </SafeAreaView>
    </>
  );
};

export default Messages;
