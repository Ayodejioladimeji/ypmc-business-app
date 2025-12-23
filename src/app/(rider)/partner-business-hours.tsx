import React, { useContext, useEffect, useState } from "react";
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GetRequest } from "@/utils/requests";
import { DataContext } from "@/store/GlobalState";
import { colors } from "@/theme";
import TopNavigation from "@/components/TopNavigation";
import { s } from "react-native-size-matters";

type Day = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

const days: Day[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const dayMapping: Record<string, Day> = {
    MONDAY: "Mon",
    TUESDAY: "Tue",
    WEDNESDAY: "Wed",
    THURSDAY: "Thu",
    FRIDAY: "Fri",
    SATURDAY: "Sat",
    SUNDAY: "Sun",
};

const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    const suffix = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12; // Convert 0 or 12 to 12, otherwise mod 12
    return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${suffix}`;
};

const BusinessHour = () => {
    const [selectedDays, setSelectedDays] = useState<Record<Day, { active: boolean; from: string; to: string }>>(
        days.reduce((acc, day) => {
            acc[day] = { active: false, from: "09:00", to: "18:00" };
            return acc;
        }, {} as Record<Day, { active: boolean; from: string; to: string }>)
    );

    const [loading, setLoading] = useState(true);
    const { state } = useContext(DataContext);

    useEffect(() => {
        if (state?.token) {
            const getOperatingHours = async () => {
                const res = await GetRequest("/operating-hours/rider", state?.token);
                if (res?.status === 200 || res?.status === 201) {
                    setSelectedDays((prev) => {
                        const newSelectedDays = { ...prev };

                        res?.data?.data.forEach((day: any) => {
                            const mappedDay = dayMapping[day.dayOfWeek];
                            if (mappedDay) {
                                newSelectedDays[mappedDay] = {
                                    active: day.isActive,
                                    from: day.startTime.slice(0, 5),
                                    to: day.endTime.slice(0, 5),
                                };
                            }
                        });

                        return newSelectedDays;
                    });
                }
                setLoading(false);
            };

            getOperatingHours();
        }
    }, [state?.token]);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white', paddingTop: 40 }}>
            <TopNavigation title="" />
            
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
                <View style={{ flex: 1 }}>
                    <View style={{ gap: 12, marginBottom: 40 }}>
                        <View style={styles.headerContainer}>
                            <Ionicons name="time-outline" size={25} />
                            <Text style={{ fontWeight: "500", fontSize: s(22) }}>Business Hours</Text>
                        </View>
                        <Text style={[styles.label, {fontSize:s(14)}]}>These are the work hours set by your partner for your deliveries.</Text>
                    </View>

                    {loading ? (
                        <ActivityIndicator size="large" />
                    ) : (
                        <>
                            {days.map((day) => (
                                <View key={day} style={styles.row}>
                                    <Text style={styles.dayText}>{day}</Text>
                                    
                                    {selectedDays[day].active ? (
                                        <View style={styles.timeContainer}>
                                            <View>
                                                <Text style={styles.label}>From:</Text>
                                                <Text style={styles.timeText}>{formatTime(selectedDays[day].from)}</Text>
                                            </View>

                                            <View>
                                                <Text style={styles.label}>To:</Text>
                                                <Text style={styles.timeText}>{formatTime(selectedDays[day].to)}</Text>
                                            </View>
                                        </View>
                                    ) : (
                                        <Text style={styles.closedText}>Closed</Text>
                                    )}
                                </View>
                            ))}
                        </>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginTop: 12,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        columnGap: 60,
        height: 80,
        borderBottomWidth:0.3,
        borderColor:colors.border,
        paddingLeft:10
    },
    timeContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 80,
       
    },
    label: {
        fontSize: s(12),
        color: "gray",
        marginBottom:10
    },
    timeText: {
        fontSize: s(12),
        fontWeight: "bold",
        color: "#333",
    },
    closedText: {
        fontWeight: "bold",
        color: "gray",
    },
    dayText: {
        fontSize: s(14),
        fontWeight: "semibold",
        color: "#333",
        width: 60,
    },
});

export default BusinessHour;
