import React, { useEffect, useRef } from "react";
import {
    Animated,
    StyleSheet,
    Text,
    View,
    Easing
} from "react-native";
import { colors } from "@/theme";


export default function ProgressBar() {
    const progressAnimation = useRef(new Animated.Value(0)).current;


    useEffect(() => {
        const startAnimation = () => {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(progressAnimation, {
                        toValue: 1,
                        duration: 5000,
                        easing: Easing.linear,
                        useNativeDriver: false,
                    }),
                    Animated.timing(progressAnimation, {
                        toValue: 0,
                        duration: 0,
                        useNativeDriver: false,
                    }),
                ])
            ).start();
        };

        startAnimation();
    }, [progressAnimation]);

    // Interpolated width for progress bar
    const progressWidth = progressAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: ["0%", "100%"],
    });

    return (
        <View style={styles.progressBarContainer}>
            <Animated.View
                style={[styles.progressBar, { width: progressWidth }]}
            />
        </View>

    );

}

const styles = StyleSheet.create({
    progressBarContainer: {
        flex:1,
        width: "100%",
        height: 5,
        backgroundColor: "#3a3a3a",
        borderRadius: 5,
        overflow: "hidden",
    },
    progressBar: {
        height: "100%",
        backgroundColor: colors.primary,
        borderRadius: 5,
    },
});
