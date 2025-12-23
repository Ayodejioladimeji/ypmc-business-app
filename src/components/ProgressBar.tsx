import { DataContext } from "@/store/GlobalState";
import { colors } from "@/theme";
import React, { useContext } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { s } from "react-native-size-matters";

export const ProgressBar = ({
  step,
  stepTitles,
  setStep,
}: {
  step: number;
  stepTitles: Array<string>;
  setStep: React.Dispatch<React.SetStateAction<number>>;
}) => {

  const {state} = useContext(DataContext)
  // 

  return (
    <View style={styles.segmentedContainer}>
      {stepTitles?.map((title: string, index: number) => (
        <Pressable key={index} style={styles.segment} onPress={() => state?.validated ? setStep(index + 1) : setStep(1)}>
          <Text
            style={[
              styles.stepTitle,
              step === index + 1 && styles.activeStepTitle,
              step > index && styles.completedStepTitle,
            ]}
          >
            {title}
          </Text>
          <View
            style={[
              styles.underline,
              step === index + 1 && styles.activeUnderline,
              step > index && styles.completedUnderline,
            ]}
          />
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  segmentedContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    columnGap:20
  },
  segment: {
    flex: 1,
  },
  stepTitle: {
    fontSize: s(13),
    color: colors.mutedForeground,
    textTransform:'capitalize',
  },
  activeStepTitle: {
    // color: "#F97216",
    fontWeight: "bold",
  },
  completedStepTitle: {
    // color: "#F7A96B",
    fontWeight: "bold",
  },
  underline: {
    height: 4,
    backgroundColor: "transparent",
    width: '100%',
    marginTop: 8,
    borderRadius: 999,
  },
  activeUnderline: {
    backgroundColor: "#F97216",
  },
  completedUnderline: {
    backgroundColor: "#F7A96B",
  },
});
