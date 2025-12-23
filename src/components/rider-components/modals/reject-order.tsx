import images from '@/assets/images'
import { Text } from '@/components/ui'
import { Button, ButtonText } from '@/components/ui/button'
import CustomModal from '@/components/ui/modal'
import { DataContext } from '@/store/GlobalState'
import {PostRequest } from '@/utils/requests'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import React, { useContext, useState } from 'react'
import { ActivityIndicator, StyleSheet, View } from 'react-native'
import { toast } from 'sonner-native'

interface RejectProps {
    confirmModal: boolean,
    setConfirmModal: ((item: boolean) => void)
}


const RejectorderModal = ({ confirmModal, setConfirmModal }: RejectProps) => {
    const { state} = useContext(DataContext)
    const { order } = state
    const [rejectLoading, setRejectLoading] = useState(false)
    const router = useRouter()


    const handleReject = async () => {
        setRejectLoading(true);

        let res: any;

        const id = order?.type === "single" ? order?.id : order?.multiShippingId

        if(order?.type === "single"){
            res = await PostRequest(
                `/shipping/rider/release-accepted-order/${id}`,
                {},
                state?.token
            );

        }
        else {
            res = await PostRequest(
                `/shipping/rider/release-accepted-order/${id}?type=multi`,
                {},
                state?.token
            );
        }

        if (res?.status === 200 || res?.status === 201) {
            toast.success(res?.data?.message);
            setConfirmModal(false);
            router.push("/(rider)/home")

        }

        setRejectLoading(false);
    };
    // 

    return (
        <CustomModal
            visible={confirmModal}
            onClose={() => { setConfirmModal(false) }}
        >
            <View style={{ paddingHorizontal: 10 }}>
                <Image source={images.rejectOrder} alt="" style={{ height: 70, width: 70, marginHorizontal: 'auto' }} />

                <Text style={styles.modalTitle}>Reject Order?</Text>
                <Text style={styles.modalDescription}>
                    Are you sure you want to reject this order? This action cannot be undone.
                </Text>

                <View style={{ marginTop: 40 }}>

                    <Button
                        variant="outline"
                        style={{
                            marginTop: 10,
                            borderRadius: 25,
                            paddingVertical: 15,
                        }}
                        onPress={handleReject}
                    >
                        <ButtonText>Yes, Reject this order</ButtonText>
                        {rejectLoading && <ActivityIndicator />}
                    </Button>
                </View>
            </View>
        </CustomModal>
    )
}

const styles = StyleSheet.create({
    modalTitle: {
        fontSize: 16,
        fontFamily: "interSemiBold",
        textAlign: "center",
        marginTop: 20
    },
    modalDescription: {
        marginTop: 20,
        color: "#636363",
        fontSize: 14,
        fontFamily: "interRegular",
        textAlign: "center",
    },
})

export default RejectorderModal