import React, { useState } from "react";
import {
  Animated,
  Image,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { icons } from "@/constants";
import { InputFieldProps } from "@/types/type";

interface CustomInputFieldProps extends InputFieldProps {
  variant?: "outlined" | "filled";
}

export const PhoneNumberInput = ({
  label = "Phone Number",
  variant = "outlined",
  ...props
}: CustomInputFieldProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(animation, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    Animated.timing(animation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const getRowStyle = () => {
    if (variant === "outlined") {
      return [styles.row, styles.outlinedRow];
    }
    return styles.row; // Default "filled" style
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text
          style={[
            styles.label,
            isFocused && styles.labelFocused && styles.focused,
          ]}
        >
          {label}
        </Text>
        <View style={getRowStyle()}>
          <View style={styles.countryCodeContainer}>
            <Text style={styles.countryCodeText}>+234</Text>
            <Image
              style={styles.flagIcon}
              source={icons.nigeriaIcon}
              resizeMode="contain"
            />
          </View>
          <Animated.View style={[styles.inputContainer]}>
            <TextInput
              style={styles.input}
              placeholder="813 848 6922"
              keyboardType="phone-pad"
              onFocus={handleFocus}
              onBlur={handleBlur}
              {...props}
              placeholderTextColor="#63636380"
            />
          </Animated.View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  label: {
    fontSize: 15,
    marginBottom: 10,
    marginTop: 10,
  },
  labelFocused: {},
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    padding: 8,
    backgroundColor: "#f3f3f3",
  },
  outlinedRow: {
    borderBottomWidth: 1,
    backgroundColor: "transparent",
    padding: 0,
  },
  countryCodeContainer: {
    marginTop: 5,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  flagIcon: {
    width: 16,
    height: 16,
  },
  countryCodeText: {
    fontSize: 16,
    color: "#636363",
  },
  inputContainer: {
    flex: 1,
    marginLeft: 10,
    padding: 10,
  },
  input: {
    fontSize: 16,
  },
  focused: {
    borderColor: "orange",
  },
});
