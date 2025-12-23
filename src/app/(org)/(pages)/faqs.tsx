import React, { useState } from "react";
import { SafeAreaView, StyleSheet, View, TouchableOpacity, Animated, Easing, Platform } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { colors } from "@/theme";
import TopNavigation from "@/components/TopNavigation";
import SafeAreaViews from "@/components/safe-area-view";
import { Text } from "@/components/ui";
import { s } from "react-native-size-matters";

interface AccordioProps {
  id: number,
  question: string,
  answer: string
}

const FAQs = () => {
  const [expandedIndex, setExpandedIndex] = useState<any>(null);

  // Accordion data
  const accordionData = [
    {
      id: 1,
      question: "How do I start receiving delivery orders?",
      answer:
        "To create a shipment, navigate to the shipments page and fill out the required details. After submission, you'll receive a tracking ID.",
    },
    {
      id: 2,
      question: "What happens if i encounter an issue with a delivery ?",
      answer:
        "Yes, tracking is available in real-time. Simply input your tracking ID into the tracking tool provided.",
    },
    {
      id: 3,
      question: "How can i view my earnings?",
      answer:
        "We provide a rating system to help you choose the best riders based on past user reviews and experience.",
    },
  ];

  // Toggle accordion item
  const toggleAccordion = (index: number) => {
    setExpandedIndex(index === expandedIndex ? null : index);
  };

  return (
    <SafeAreaView style={{flex:1, backgroundColor:'white', paddingTop: Platform.OS === "android" ? 40 : 10 }}>
      <TopNavigation title="FAQ" />

      <View style={styles.container}>
        {accordionData.map((item, index) => (
          <AccordionItem
            key={item.id}
            question={item.question}
            answer={item.answer}
            isExpanded={index === expandedIndex}
            onPress={() => toggleAccordion(index)}
          />
        ))}
      </View>
    </SafeAreaView>
  );
};

// Accordion Item Component
const AccordionItem = ({ question, answer, isExpanded, onPress }: any) => {
  const [rotationAnim] = useState(new Animated.Value(0));

  // Handle animation
  React.useEffect(() => {
    Animated.timing(rotationAnim, {
      toValue: isExpanded ? 1 : 0,
      duration: 200,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  }, [isExpanded]);

  // Interpolated rotation
  const rotateIcon = rotationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "90deg"],
  });

  return (
    <View style={styles.accordionItem}>
      {/* Trigger */}
      <TouchableOpacity style={styles.trigger} onPress={onPress}>
        <Text style={styles.questionText}>{question}</Text>
        <Animated.View style={{ transform: [{ rotate: rotateIcon }] }}>
          <MaterialIcons name="chevron-right" size={24} color={colors.mutedForeground} />
        </Animated.View>
      </TouchableOpacity>

      {/* Content */}
      {isExpanded && (
        <View style={styles.content}>
          <Text style={styles.answerText}>{answer}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  accordionItem: {
    borderBottomWidth: 1,
    borderBottomColor: colors.muted,
  },
  trigger: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
  },
  questionText: {
    fontSize: s(14),
    fontWeight: "600",
    color: colors.foreground,
    flex:1,
  },
  content: {
    paddingVertical: 8,
  },
  answerText: {
    fontSize: s(13),
    lineHeight: 20,
    color: colors.mutedForeground,
  },
});

export default FAQs;
