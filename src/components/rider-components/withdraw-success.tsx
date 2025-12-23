import React from 'react'
import CustomModal from '../ui/modal'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { Text } from '../ui'
import { Image } from 'expo-image'
import { s } from 'react-native-size-matters'
import { useRouter } from 'expo-router'


interface ModalProps {
    amount: number,
    successModal: boolean,
    setSuccessModal: (b: boolean) => void
}

const WithdrawalSuccessModal = ({ amount, successModal, setSuccessModal }: ModalProps) => {
    const router = useRouter()

    const handleRoute = () => {
        router.replace("/(rider)/wallet")
        setSuccessModal(false)
    }
    // 

    return (
        <CustomModal
            visible={successModal}
            onClose={handleRoute}
        >
            <View style={{ paddingHorizontal: 10, alignItems: 'center', justifyContent: 'center', paddingVertical: 20 }}>
                <Image source={require("@/assets/images/success-star.svg")} style={{ height: 70, width: 70 }} />
                <Text style={styles.modalTitle}>Withdrawal Successful</Text>
                <Text style={styles.modalDescription}>
                    Success! Your withdrawal of ₦{amount} was successful
                </Text>

                <TouchableOpacity
                    activeOpacity={0.7}
                    style={styles.button}
                    onPress={handleRoute}
                >
                    <Text style={styles.buttonText}>Go to wallet</Text>
                </TouchableOpacity>
            </View>
        </CustomModal>
    )
}

const styles = StyleSheet.create({
    modalTitle: {
        fontSize: s(16),
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
    button:{
        marginTop: 24,
        backgroundColor: "#000",
        borderRadius: 20,
        paddingVertical: 16,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width:'100%'
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
      },
})

export default WithdrawalSuccessModal