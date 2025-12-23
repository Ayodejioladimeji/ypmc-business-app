import React from "react";
import { FlatList, View } from "react-native";

import { Divider } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { SvgXml } from "react-native-svg";

import { emptyMessage } from "@/assets/svgs";
import { GoBackButton, SearchBar } from "@/components";
import { OrgRiderMessages } from "@/components/org-components/messages";
import { Text } from "@/components/ui";


const riderMessages = [];

const OrgMessages = () => {
  return (
      <SafeAreaView
        style={{
          height: "100%",
          padding: 12,
          paddingBottom: 24,
          backgroundColor: "white",
        }}
      >
        <View style={{ gap: 24 }}>
          <GoBackButton />
          <Text style={{ fontSize: 30, fontWeight: 600 }}>Messagese</Text>
          {/* <SearchBar placeholder={"Search"} /> */}

          <Divider />
          <FlatList
            data={riderMessages}
            renderItem={({ item }) => (
              <OrgRiderMessages
                riderName={item.riderName}
                message={item.message}
                time={item.time}
              />
            )}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.riderName}
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
            ListHeaderComponent={
              <Text
                style={{
                  fontSize: 16,
                  color: "gray",
                }}
              >
                Riders
              </Text>
            }
          />
        </View>
      </SafeAreaView>
  );
};

export default OrgMessages;
