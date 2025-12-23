
import React, { useContext, useEffect, useState } from "react";
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

import CheckBox from "react-native-check-box";
import { Ionicons } from "@expo/vector-icons";
import DropDownPicker from "react-native-dropdown-picker";
import { CustomButton } from "@/components/CustomButton";
import { s } from "react-native-size-matters";
import { GetRequest, PatchRequest, PostRequest } from "@/utils/requests";
import { DataContext } from "@/store/GlobalState";
import { toast } from "sonner-native";
import { useRouter } from "expo-router";
import { colors } from "@/theme";
import TopNavigation from "@/components/TopNavigation";
import { Dimensions } from 'react-native';


type Day = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

const days: Day[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const times = [
    { label: "09:00 AM", value: "09:00" },
    { label: "10:00 AM", value: "10:00" },
    { label: "11:00 AM", value: "11:00" },
    { label: "12:00 PM", value: "12:00" },
    { label: "01:00 PM", value: "13:00" },
    { label: "02:00 PM", value: "14:00" },
    { label: "03:00 PM", value: "15:00" },
    { label: "04:00 PM", value: "16:00" },
    { label: "05:00 PM", value: "17:00" },
    { label: "06:00 PM", value: "18:00" },
];

const dayMapping: Record<string, Day> = {
    MONDAY: "Mon",
    TUESDAY: "Tue",
    WEDNESDAY: "Wed",
    THURSDAY: "Thu",
    FRIDAY: "Fri",
    SATURDAY: "Sat",
    SUNDAY: "Sun",
};


 const BusinessHour = () => {
    const [selectedDays, setSelectedDays] = useState<
        Record<Day, { active: boolean; from: string; to: string }>
    >(
        days.reduce((acc, day) => {
            acc[day] = { active: false, from: "09:00", to: "18:00" };
            return acc;
        }, {} as Record<Day, { active: boolean; from: string; to: string }>)
    );

    const toggleDay = (day: Day) => {
        setSelectedDays((prev) => ({
            ...prev,
            [day]: { ...prev[day], active: !prev[day].active },
        }));
    };

    const handleTimeChange = (day: Day, type: "from" | "to", value: string) => {
        setSelectedDays((prev) => ({
            ...prev,
            [day]: { ...prev[day], [type]: value },
        }));
    };

    // Individual dropdown open state for each day to prevent overlap
    const [openDropdown, setOpenDropdown] = useState<any>(
        days?.reduce((acc, day) => ({ ...acc, [day]: { from: false, to: false } }), {})
    );

    const [loading, setLoading] = useState(true)
    const [buttonLoading, setButtonLoading] = useState(false)
    const { state } = useContext(DataContext)
    const router = useRouter()

     const screenWidth = Dimensions.get('window').width;
     const dropdownWidth = screenWidth / 3.2;


    // get saved operating hours
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

    // save business hours
    const handleSave = async () => {
        setButtonLoading(true);

        const formattedResponse = Object.keys(selectedDays).map((day) => ({
            dayOfWeek: Object.keys(dayMapping).find((key) => dayMapping[key] === day) || day,
            updates: {
                startTime: selectedDays[day as Day].from,
                endTime: selectedDays[day as Day].to,
                isActive: selectedDays[day as Day].active,
            },
        }));

        const res = await PatchRequest("/operating-hours/rider/bulk", formattedResponse, state?.token);
        if (res?.status === 200 || res?.status === 201) {
            toast.success(res?.data?.message);
            router.replace("/(rider)/account");
        }

        setButtonLoading(false);
    };

    // 

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
                        {/* <Text style={{ fontSize: 18, color: "gray" }}>What time do you operate?</Text> */}
                    </View>

                    {loading ? <ActivityIndicator size="large" /> :
                        <>
                            {days.map((day) => (
                                <View key={day} style={styles.row}>
                                    <CheckBox
                                        isChecked={selectedDays[day].active}
                                        onClick={() => toggleDay(day)}
                                        rightText={day}
                                        checkBoxColor="#f97216"
                                        style={{ width: 70 }}
                                    />

                                    {selectedDays[day].active ? (
                                        <View style={styles.timeContainer}>

                                            <View style={[styles.pickerWrapper, { zIndex: openDropdown[day].from ? 1000 : 1 }]}>
                                                <Text style={styles.label}>From</Text>
                                                <DropDownPicker
                                                    open={openDropdown[day].from}
                                                    value={selectedDays[day].from}
                                                    items={times}
                                                    setOpen={(open) => setOpenDropdown((prev: any) => ({ ...prev, [day]: { ...prev[day], from: open } }))}
                                                    setValue={(callback) =>
                                                        handleTimeChange(day, "from", typeof callback === "function" ? callback(selectedDays[day].from) : callback)
                                                    }
                                                    style={{ width: dropdownWidth, borderWidth: 0, backgroundColor: "transparent" }}
                                                    textStyle={{ fontSize: s(11), fontWeight: 500 }}
                                                    dropDownContainerStyle={{
                                                        width: dropdownWidth,
                                                        borderColor: colors.muted,
                                                        backgroundColor: colors.muted
                                                    }}
                                                />
                                            </View>

                                            <View style={[styles.pickerWrapper, { zIndex: openDropdown[day].to ? 1000 : 1 }]}>
                                                <Text style={styles.label}>To</Text>
                                                <DropDownPicker
                                                    open={openDropdown[day].to}
                                                    value={selectedDays[day].to}
                                                    items={times}
                                                    setOpen={(open) => setOpenDropdown((prev: any) => ({ ...prev, [day]: { ...prev[day], to: open } }))}
                                                    setValue={(callback) =>
                                                        handleTimeChange(day, "to", typeof callback === "function" ? callback(selectedDays[day].to) : callback)
                                                    }
                                                    style={{ width: dropdownWidth, borderWidth: 0, backgroundColor: "transparent", zIndex: 900 }}
                                                    textStyle={{ fontSize: s(11), fontWeight: 500 }}
                                                    dropDownContainerStyle={{
                                                        width: dropdownWidth,
                                                        borderColor: colors.muted,
                                                        backgroundColor: colors.muted
                                                    }}
                                                />
                                            </View>
                                        </View>
                                    ) : (
                                        <Text style={{ fontWeight: "bold", color: "gray" }}>Closed</Text>
                                    )}
                                </View>
                            ))}

                            <View style={styles.saveButton}>
                                <CustomButton
                                    onPress={() => {
                                        const formattedResponse = Object.keys(selectedDays).map((day) => ({
                                            dayOfWeek: day.toUpperCase(),
                                            updates: {
                                                startTime: selectedDays[day as Day].from,
                                                endTime: selectedDays[day as Day].to,
                                                isActive: selectedDays[day as Day].active,
                                            },
                                        }));
                                        handleSave()
                                    }}
                                    title="Save and continue"
                                    icon={
                                        buttonLoading && <ActivityIndicator color="white" />
                                    }
                                />
                            </View>
                        </>

                    }

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
        marginTop: 10,
        columnGap: 20,

    },
    timeContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    label: {
        fontSize: 11,
        color: "gray",
        marginHorizontal: 8,
        marginTop: 4
    },
    pickerWrapper: {
        borderWidth: 1,
        borderColor: "#6363631A",
        borderRadius: 4,
    },
    pickerText: {
        fontSize: s(12),
    },
    closedText: {
        fontWeight: "bold",
        color: "gray",
    },

    saveButton: {
        marginTop: 40,
    },
});

export default BusinessHour