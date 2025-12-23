import React, { useContext, useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView, ActivityIndicator, ScrollView } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import TopNavigation from "@/components/TopNavigation";
import { s } from "react-native-size-matters";
import { AccountMarkerIcon, HandshakeIcon, MobileCallIcon } from "@/assets/images/svgs";
import { DataContext } from "@/store/GlobalState";
import { GetRequest } from "@/utils/requests";
import { handleDial } from "@/helpers/dialNumber";

const PartnerInfo = () => {
    const { state } = useContext(DataContext)
    const { user, token } = state
    const [partner, setPartner] = useState<any>({})
    const [loading, setLoading] = useState(true)

    // get partner info
    useEffect(() => {
        const getPartner = async () => {
            const res = await GetRequest(`/rider/partner-company`, token)
            if (res?.status === 200 || res?.status === 201) {
                setPartner(res?.data?.data)
                console.log(res?.data?.data)
            }
            setLoading(false)
        }

        if (token) {
            getPartner()
        }
    }, [token])

    // 

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white', paddingTop: 40 }}>
            <TopNavigation title="Partners Info" />

            <View style={styles.container}>
                <View style={styles.header}>
                    {partner?.companyLogo &&
                        <Image
                            source={{uri:partner?.companyLogo}}
                            style={styles.logo}
                            resizeMode="contain"
                        />}

                    <View style={styles.floatingButtons}>
                        <TouchableOpacity style={styles.callButton} onPress={() => handleDial(partner?.companyNumber)}>
                            <Ionicons name="call-outline" size={24} color="black" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.chatButton}>
                            <Ionicons name="chatbubble-outline" size={24} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>


                <ScrollView showsVerticalScrollIndicator={false} style={styles.infoContainer}>
                    {loading ? <ActivityIndicator />
                        :
                        <>

                            <View style={styles.infoRow}>
                                <HandshakeIcon />
                                <View>
                                    <Text style={styles.label}>{`Company Name`}</Text>
                                    <Text style={styles.value}>{partner?.companyName}</Text>
                                </View>
                            </View>

                            <View style={styles.infoRow}>
                                <MobileCallIcon />
                                <View>
                                    <Text style={styles.label}>{`Phone Number`}</Text>
                                    <Text style={styles.value}>{partner?.companyNumber}</Text>
                                </View>
                            </View>

                            <View style={styles.infoRow}>
                                <Ionicons name="mail-outline" size={20} color="gray" />
                                <View>
                                    <Text style={styles.label}>{`Company Email`}</Text>
                                    <Text style={styles.value}>{partner?.companyEmail || "N/A"}</Text>
                                </View>
                            </View>

                            <View style={styles.infoRow}>
                                <AccountMarkerIcon />
                                <View>
                                    <Text style={styles.label}>{`Company Address`}</Text>
                                    <Text style={styles.value}>{`${partner?.companyAddress?.street} ${partner?.companyAddress?.state} ${partner?.companyAddress?.country}`|| "N/A"}</Text>
                                </View>
                            </View>
                        </>}

                </ScrollView>
            </View>
        </SafeAreaView>
    );
};



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        backgroundColor: "#FFEFE5",
        alignItems: "center",
        // paddingVertical: 80,
        marginTop: 20,
        height: 250
    },
    logo: {
        width: "100%",
        height: "100%",
        objectFit:'cover'
    },
    floatingButtons: {
        flexDirection: "row",
        justifyContent: "center",
        position: "absolute",
        bottom: -25,
        left: 0,
        right: 0,
        zIndex: 10,
    },
    callButton: {
        backgroundColor: "#fff",
        width: 60,
        height: 60,
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        marginRight: 15,
    },
    chatButton: {
        backgroundColor: "#000",
        width: 60,
        height: 60,
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center",
    },
    infoContainer: {
        paddingHorizontal: 20,
        marginTop: 60,
    },
    infoRow: {
        flexDirection: "row",
        marginBottom: 20,
        paddingVertical: 10,
        gap: 8
    },
    icon: {
        marginRight: 10,
        marginTop: 1
    },
    label: {
        fontSize: s(13),
        color: "gray",
        fontWeight: "500",
        marginBottom: 6
    },
    value: {
        fontSize: s(14),
        fontWeight: "semibold",
        color: "#333",
    },
});

export default PartnerInfo;
