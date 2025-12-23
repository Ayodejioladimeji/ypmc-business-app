import React from "react";
import { Pressable } from "react-native";

import { Avatar as RNAvatar } from "react-native-paper";

import { images } from "@/constants";
import { UserAvatarProps } from "@/types/type";

export const Avatar = ({ onPress, size, source }: UserAvatarProps) => {
  const imageSource = source?.uri ? { uri: source.uri } : null;

  return (
    <Pressable onPress={onPress}>
      <RNAvatar.Image size={size} source={imageSource} />
    </Pressable>
  );
};
