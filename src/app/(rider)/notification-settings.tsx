import SafeAreaViews from "@/components/safe-area-view";
import TopNavigation from "@/components/TopNavigation";
import React, { useState } from "react";
import {
    View,
    Text,
    Switch,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ScrollView,
    SafeAreaView,
} from "react-native";
import { s } from "react-native-size-matters";

const NotificationSettings = () => {
    const [settings, setSettings] = useState({
        newOrder: true,
        orderCompleted: true,
        systemAlerts: true,
        newMessage: true,
        paymentsUpdates: false,
    });

    const toggleSwitch = (key: keyof typeof settings) => {
        setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSave = () => {
        Alert.alert("Settings Saved", "Your notification preferences have been updated.");
    };

    return (
        <SafeAreaView style={{flex:1, paddingTop:40, backgroundColor:'white'}}>
            <TopNavigation title=""/>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.container}>
                    <Text style={styles.header}>Notification Settings</Text>
                    <Text style={styles.subHeader}>
                        Customize your notification settings and stay alerted only about updates relevant to you
                    </Text>

                    {/* Order Updates */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Order Updates</Text>
                        <View style={styles.row}>
                            <Text style={styles.label}>Notify me when a new order is assigned to me</Text>
                            <Switch
                                value={settings.newOrder}
                                onValueChange={() => toggleSwitch("newOrder")}
                                trackColor={{ false: "#D3D3D3", true: "#f97216" }}
                                thumbColor="white"
                            />
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Notify me when an order is completed</Text>
                            <Switch
                                value={settings.orderCompleted}
                                onValueChange={() => toggleSwitch("orderCompleted")}
                                trackColor={{ false: "#D3D3D3", true: "#f97216" }}
                                thumbColor="white"
                            />
                        </View>
                    </View>

                    {/* System Alerts */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>System Alerts</Text>
                        <View style={styles.row}>
                            <Text style={styles.label}>Notify me about app updates and system alerts.</Text>
                            <Switch
                                value={settings.systemAlerts}
                                onValueChange={() => toggleSwitch("systemAlerts")}
                                trackColor={{ false: "#D3D3D3", true: "#f97216" }}
                                thumbColor="white"
                            />
                        </View>
                    </View>

                    {/* Messages & Payments */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Messages & Payments</Text>
                        <View style={styles.row}>
                            <Text style={styles.label}>Notify me when I get a new message</Text>
                            <Switch
                                value={settings.newMessage}
                                onValueChange={() => toggleSwitch("newMessage")}
                                trackColor={{ false: "#D3D3D3", true: "#f97216" }}
                                thumbColor="white"
                            />
                        </View> 

                        <View style={styles.row}>
                            <Text style={styles.label}>Receive updates about payments or withdrawals</Text>
                            <Switch
                                value={settings.paymentsUpdates}
                                onValueChange={() => toggleSwitch("paymentsUpdates")}
                                trackColor={{ false: "#D3D3D3", true: "#f97216" }}
                                thumbColor="white"
                            />
                        </View>
                    </View>

                    {/* Save Changes Button */}
                    <TouchableOpacity style={styles.button} onPress={handleSave}>
                        <Text style={styles.buttonText}>Save Changes ✓</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 20,
    },
    header: {
        fontSize: s(22),
        fontWeight: 500,
        marginBottom: 5,
        fontFamily: 'interMedium'
    },
    subHeader: {
        fontSize: s(13),
        color: "#555",
        marginBottom: 40,
        fontFamily: 'inter'
    },
    section: {
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
        paddingBottom: 10,
    },
    sectionTitle: {
        fontSize: s(14),
        fontWeight: 500,
        marginBottom: 10,
        color:'#636363'
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    label: {
        fontSize: s(12),
        color: "#333",
        flex: 1,
        paddingRight: 10,
        fontWeight:400
    },
    button: {
        backgroundColor: "black",
        paddingVertical: 20,
        borderRadius: 30,
        alignItems: "center",
        marginTop:20
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default NotificationSettings;
