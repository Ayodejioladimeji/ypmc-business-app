import React from "react";
import { Searchbar as RNSearchbar } from "react-native-paper";

interface SearchBarProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ placeholder, value, onChangeText }) => {
  return (
    <RNSearchbar
      placeholder={placeholder}
      value={value} 
      onChangeText={onChangeText}
      style={{ backgroundColor: "#f3f3f3" }}
      placeholderTextColor="gray"
    />
  );
};
