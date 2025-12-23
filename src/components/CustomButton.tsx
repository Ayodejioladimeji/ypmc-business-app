import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { ButtonProps } from "@/types/type";

const getBgVariantStyle = (variant: ButtonProps["bgVariant"]) => {
  switch (variant) {
    case "primary":
      return { backgroundColor: "black" };
    case "secondary":
      return {
        backgroundColor: "transparent",
        color: "black",
        borderColor: "#63636380",
        borderWidth: 1,
      };
    case "danger":
      return { backgroundColor: "#e74c3c" };
    case "success":
      return { backgroundColor: "#27ae60" };
    case "outline":
      return {
        backgroundColor: "black",
        borderColor: "#63636380",
        borderWidth: 1,
      };
    case "disabled":
      return { backgroundColor: "#F9721680" };
    default:
      return { backgroundColor: "#F97216" };
  }
};

const getTextVariantStyle = (variant: ButtonProps["textVariant"]) => {
  switch (variant) {
    case "primary":
      return { color: "white" };
    case "secondary":
      return { color: "black" };
    case "danger":
      return { backgroundColor: "#e74c3c" };
    case "success":
      return { backgroundColor: "#27ae60" };
    case "disabled":
      return { color: "white" };
    default:
      return { color: "white" };
  }
};

export const CustomButton = ({
  onPress,
  title,
  bgVariant = "primary",
  textVariant = "default",
  style,
  icon,
  disabled = false,
  ...props
}: ButtonProps) => {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.style,
        getBgVariantStyle(bgVariant),
        style,
        disabled && styles.disabled,
      ]}
      disabled={disabled}
      {...props}
    >
      <Text
        style={[
          styles.textStyle,
          getTextVariantStyle(disabled ? "disabled" : textVariant),
        ]}
      >
        {title}
      </Text>
      {icon &&  (
        <View style={styles.icon}>
          {React.cloneElement(icon, {
            color: disabled ? "#666" : icon.props.color,
          })}
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  style: {
    width: "100%",
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  textStyle: {
    fontWeight: "500",
  },
  icon: {
    marginRight: 10,
  },
  disabled: {
    opacity: 0.7,
  },
});
