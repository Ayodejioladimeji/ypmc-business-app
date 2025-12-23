import React from "react";
import { StyleSheet, View } from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";
import RNPickerSelect from "react-native-picker-select";

import { SelectComponentProps } from "@/types/type";

import { Text } from "./ui";

export const Select: React.FC<SelectComponentProps> = ({
  onValueChange,
  value,
  items,
  placeholder,
  labelText,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{labelText}</Text>
      <RNPickerSelect
        onValueChange={onValueChange}
        value={value}
        items={items}
        placeholder={placeholder}
        style={{
          viewContainer: {
            backgroundColor: "#f3f3f3",
            borderWidth: 0.8,
            borderColor: "#ccc",
            borderRadius: 10,
            padding: 15,
            justifyContent: "center",
            height: 55,
          },
        }}
        touchableWrapperProps={{ style: { height: 55 } }}
      >
        <View style={styles.selectContainer}>
          <View style={styles.semiContainer}>
            <Text style={styles.value}>{value}</Text>
          </View>
          <Ionicons name="chevron-down-outline" color="black" />
        </View>
      </RNPickerSelect>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 25,
    padding: 5,
  },
  selectContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 18,
  },
  semiContainer: {
    marginTop: 1,
    gap: 2,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: "#000000",
  },
  value: {
    fontSize: 16,
  },
});
