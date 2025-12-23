import React from "react";
import { FlatList, Pressable, Text, View } from "react-native";

interface Props {
  tabs: string[];
  activeTab: string;
  setActiveTab: (tab: any) => void;
}

interface TabButtonProps {
  name: string;
  activeTab: any;
  onHandleSearchType: (name: any) => void;
}

const TabButton = ({ name, activeTab, onHandleSearchType }: TabButtonProps) => {
  const isActive = name === activeTab;
  return (
    <Pressable
      onPress={() => onHandleSearchType(name)}
      style={{
        width: "45%",
        padding: 10,
        borderRadius: 20,
        backgroundColor: isActive ? "#ffffff" : "transparent",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text
        style={{
          color: isActive ? "#f97216" : "black",
          fontWeight: isActive ? "bold" : "normal",
          fontSize: 15,
        }}
      >
        {name}
      </Text>
    </Pressable>
  );
};

export const Tabs = ({ tabs, activeTab, setActiveTab }: Props) => {
  return (
    <View
      style={{
        backgroundColor: "#f3f3f3",
        height: 50,
        padding: 4,
        borderRadius: 20,
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      {tabs.map((item) => (
        <TabButton
          key={item}
          name={item}
          activeTab={activeTab}
          onHandleSearchType={setActiveTab}
        />
      ))}
    </View>
  );
};
