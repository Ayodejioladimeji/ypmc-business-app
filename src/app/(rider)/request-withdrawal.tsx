import React, { useContext, useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

import { AntDesign, Feather, Ionicons, MaterialCommunityIcons, SimpleLineIcons } from "@expo/vector-icons";
import BottomSheet, {
    BottomSheetModal,
    SCREEN_HEIGHT,
} from "@gorhom/bottom-sheet";
import { zodResolver } from "@hookform/resolvers/zod";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { useSharedValue } from "react-native-reanimated";
import { s } from "react-native-size-matters";
import { toast } from "sonner-native";
import { z } from "zod";

import { CreditCardIcon } from "@/assets/images/svgs";
import { CustomButton } from "@/components";
import AddBank from "@/components/rider-components/add-bank";
import TopNavigation from "@/components/TopNavigation";
import { Text } from "@/components/ui";
import { Button, ButtonText } from "@/components/ui/button";
import Input from "@/components/ui/input";
import CustomModal from "@/components/ui/modal";
import { DataContext } from "@/store/GlobalState";
import { colors, spacing } from "@/theme";
import { DeleteRequest, GetRequest, PostRequest } from "@/utils/requests";
import VerifyBank from "@/components/rider-components/verify-bank";
import Withdraw from "@/components/rider-components/withdraw";
import { Line } from "@/components/ui/line";

const schema = z.object({
    amount: z.string().min(1, { message: "Amount is required" }),
    channel: z.string().min(1, { message: "Channel is required" }),
});

export default function Payment() {
    const router = useRouter();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const { state } = useContext(DataContext);
    const { user } = state;
    const [loading, setLoading] = useState(true);
    const [fundLoading, setFundLoading] = useState(false);
    const [cards, setCards] = useState<any>(null);
    const paymentSheetRef = useRef<BottomSheetModal>(null);
    const paymentSheetIndex = useSharedValue<number>(0);
    const paymentSheetPosition = useSharedValue<number>(SCREEN_HEIGHT);
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [id, setId] = useState("");
    const [callback, setCallback] = useState(false);
    const [banks, setBanks] = useState<any>(null);

    const verifySheetRef = useRef<BottomSheetModal>(null);
    const verifySheetIndex = useSharedValue<number>(0);
    const verifySheetPosition = useSharedValue<number>(SCREEN_HEIGHT);

    // get banks
    useEffect(() => {
        if (state?.token) {
            const getBanks = async () => {
                const res = await GetRequest("/bank-accounts/rider", state?.token);
                if (res?.status === 200 || res?.status === 201) {
                    setBanks(res?.data?.data);
                }
                setLoading(false);
            };
            getBanks();
        }
    }, [state?.token, state?.callback, callback]);

    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            amount: "",
            channel: "PAYSTACK",
        },
        mode: "onSubmit",
    });

    // fund wallet
    const handleSubmit = async () => {
        setFundLoading(true);

        const payload = {
            amount: Number(form.getValues("amount")),
            channel: "PAYSTACK",
        };

        const res = await PostRequest(
            "/transactions/fund-wallet",
            payload,
            state?.token
        );
        if (res?.status === 200 || res?.status === 201) {
            router.replace({
                pathname: "/(app)/(tabs)/account/paystack",
                params: {
                    paystack_url: res?.data?.data?.authorization_url,
                    amount: form.getValues("amount"),
                },
            });
            setIsModalVisible(false);
            form.reset();
        }
        setFundLoading(false);
    };

    // delete card
    const handleDelete = async () => {
        setDeleteLoading(true);

        const res = await DeleteRequest(`/bank-accounts/rider/${id}`, state?.token);
        if (res?.status === 200 || res?.status === 201) {
            setCallback(!callback);
            toast.success(res?.data?.message);
            setLoading(true)
            setDeleteModal(false);
        }
        setDeleteLoading(false);
    };

    return (
        <SafeAreaView style={styles.container}>
            <TopNavigation title="Request withdrawal" />
            <ScrollView>
                <View style={{marginTop:20}}>
                    <View style={{ paddingHorizontal: 16, alignItems:'center', justifyContent:'center'}}>
                        <Text style={{ fontSize: s(12), color: colors.mutedForeground, marginBottom:20 }}>
                            Wallet Balance ₦{user?.walletBalance}
                        </Text>

                        <Text style={{ fontSize: s(13), marginBottom: 10 }}>
                            Withdrawal Amount (NGN)
                        </Text>
                        <Text style={{ fontSize: s(20), marginBottom: 10, fontWeight: 700 }}>
                            ₦{user?.walletBalance}
                        </Text>

                        <Text style={{ fontSize: s(12), color: 'red', marginBottom: 20 }}>
                            Comission (10%) : - ₦{user?.walletBalance}
                        </Text>
                        
                    </View>

                    <View
                        style={{
                            height: 2,
                            backgroundColor: colors.muted,
                            marginVertical: 20,
                        }}
                    ></View>

                    {loading ? (
                        <ActivityIndicator
                            size="small"
                            color={colors.primary}
                            style={{
                                alignSelf: "flex-start",
                                paddingLeft: 20,
                                marginTop: 15,
                            }}
                        />
                    ) : (
                        <>
                            {banks?.length === 0 ? (
                                <View>
                                    <Text
                                        style={{
                                            fontSize: s(13),
                                            marginBottom: 10,
                                            color: colors.mutedForeground,
                                            paddingHorizontal: 20
                                        }}
                                    >
                                        Select Withdrawal Method
                                    </Text>

                                    <TouchableOpacity onPress={() => paymentSheetRef.current?.present()} style={styles.itemContainers}>
                                        <View
                                            style={{
                                                flexDirection: "row",
                                                alignItems: "center",
                                                gap: 10,
                                            }}
                                        >
                                            <Ionicons name="add" size={24} color="black" />
                                            <Text style={styles.itemText}>Add New</Text>
                                        </View>

                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            onPress={() => paymentSheetRef.current?.present()}
                                        >
                                            <Ionicons
                                                name="chevron-forward"
                                                size={18}
                                                color="black"
                                            />
                                        </Button>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <>
                                    {banks?.map((item: any, index: number) => {
                                        return (
                                            <View style={styles.itemContainer} key={index}>
                                                <View>
                                                    <View
                                                        style={{
                                                            flexDirection: "row",
                                                            alignItems: "center",
                                                            gap: 10,
                                                        }}
                                                    >
                                                        <View style={{ height: 50, width: 50, backgroundColor: colors.muted, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}>
                                                            <MaterialCommunityIcons name="bank-outline" size={22} color="black" />
                                                        </View>

                                                        <View>
                                                            <Text>{item?.bankName}</Text>
                                                            <Text style={styles.accountNumber}>
                                                                {item?.accountNumber}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                </View>

                                                <TouchableOpacity
                                                    activeOpacity={0.7}
                                                    style={styles.deleteCard}
                                                    onPress={() => {
                                                        setDeleteModal(true), setId(item.id);
                                                    }}
                                                >
                                                    <AntDesign name="delete" size={15} color="red" />
                                                    <Text style={styles.deleteText}>Delete</Text>
                                                </TouchableOpacity>
                                            </View>
                                        );
                                    })}

                                    <Line />

                                    {/* <View style={styles.itemContainers}>
                                        <View
                                            style={{
                                                flexDirection: "row",
                                                alignItems: "center",
                                                gap: 10,
                                            }}
                                        >
                                            <SimpleLineIcons name="pencil" size={17} color="black" />
                                            <Text style={styles.itemText}>
                                                Change withdrawal method
                                            </Text>
                                        </View>

                                        <TouchableOpacity activeOpacity={0.7} onPress={() => paymentSheetRef.current?.present()}>
                                            <Ionicons
                                                name="chevron-forward"
                                                size={18}
                                                color="black"
                                            />
                                        </TouchableOpacity>
                                    </View> */}

                                </>
                            )}
                        </>
                    )}
                </View>

                <View style={{ paddingHorizontal: 16 }}>
                    <View
                        style={{
                            flexDirection: "row",
                            backgroundColor: "#FEE4E2",
                            borderRadius: 25,
                            paddingVertical: 15,
                            gap: 10,
                            alignItems: "center",
                            justifyContent: "center",
                            marginTop: 25,
                        }}
                    >
                        <AntDesign name="exclamationcircleo" size={17} color="black" />
                        <Text style={{ color: "#FEE4E2 ", fontSize: s(12) }}>
                            Funds will be available in 1-3 business days.
                        </Text>
                    </View>

                    <CustomButton
                        onPress={() => verifySheetRef.current?.present()}
                        title="Withdraw"
                        style={{ marginTop: 30, borderRadius: 25 }}
                    disabled={banks?.length === 0 || loading}
                    />
                </View>
            </ScrollView>

            <AddBank
                ref={paymentSheetRef}
                index={paymentSheetIndex}
                position={paymentSheetPosition}
            />

            <Withdraw
                ref={verifySheetRef}
                index={verifySheetIndex}
                position={verifySheetPosition}
                banks={banks}
                amount={user?.walletBalance}
            />

            <CustomModal visible={deleteModal} onClose={() => setDeleteModal(false)}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}> Are you sure?</Text>

                    <Text style={styles.modalMessage}>
                        Are you sure you want to delete this account? This action cannot be
                        undone.
                    </Text>


                    <View style={{
                        marginTop: 30,
                        display: "flex",
                        flexDirection: "row",
                        gap: spacing.xs,
                    }}>
                        <Button onPress={handleDelete} size="sm" style={{ flex: 1, backgroundColor: "#E73323" }}>
                            <ButtonText>Yes, Delete </ButtonText>
                            {deleteLoading && <ActivityIndicator color="#fff" size="small" />}
                        </Button>

                        <Button
                            variant="outline"
                            size="sm"
                            style={{
                                flex: 1,
                                borderRadius: 25,
                            }}
                            onPress={() => setDeleteModal(false)}
                        >
                            <ButtonText>No, Cancel </ButtonText>
                        </Button>
                    </View>
                </View>
            </CustomModal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: 40
    },

    itemContainer: {
        backgroundColor: "#ffffff",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 20,
        marginHorizontal: 10,
        borderWidth: 1,
        paddingHorizontal: 10,
        paddingVertical: 15,
        borderRadius: 15,
        borderColor: colors.mutedForeground
    },
    itemContainers: {
        backgroundColor: "#fff",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginVertical: 20,
        paddingHorizontal: 10,
    },
    itemText: {
        fontSize: 16,
        textTransform: "capitalize",
    },
    accountNumber: {
        fontSize: s(11),
        color: colors.mutedForeground,
        marginTop: 5,
    },
    savedCardStyle: {
        paddingHorizontal: spacing.md,
        marginTop: 30,
        marginBottom: 10,
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    loader: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: "center",
    },
    deleteCard: {
        backgroundColor: "#E733230D",
        flexDirection: "row",
        alignItems: "center",
        columnGap: 10,
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    deleteText: {
        fontSize: s(10),
        color: "red",
    },
    modalContent: {
        // padding: 20,
    },
    modalTitle: {
        fontSize: 16,
        fontFamily: "interSemiBold",
        textAlign: "center",
    },
    modalMessage: {
        fontSize: 14,
        color: "#666",
        textAlign: "center",
        marginTop: 20,
    },
});
