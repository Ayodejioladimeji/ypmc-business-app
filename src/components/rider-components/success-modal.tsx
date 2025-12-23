import React, { useContext } from 'react'
import CustomModal from '../ui/modal'
import { DataContext } from '@/store/GlobalState'
import { ACTIONS } from '@/store/Actions'
import { StyleSheet, View } from 'react-native'
import { Text } from '../ui'
import { Image } from 'expo-image'
import { s } from 'react-native-size-matters'

const SuccessModal = () => {
    const {state, dispatch} = useContext(DataContext)
    const {delivered, earnings, callback} = state

    const handleDone = () => {
        // dispatch({ type: ACTIONS.CALLBACK, payload: !callback })
        dispatch({ type: ACTIONS.DELIVERED, payload: false })
    }

    if(!delivered) return null
    // 

    return(
        <CustomModal
            visible={delivered}
            onClose={handleDone} 
        >
            <View style={{ paddingHorizontal: 10, alignItems:'center', justifyContent:'center', paddingVertical:20 }}>
                <Image source={require("@/assets/images/success-star.svg")} style={{height:70, width:70}}/>
                <Text style={styles.modalTitle}>₦{Number(earnings)/100 || 0}</Text>
                <Text style={styles.modalDescription}>
                    Success! You've earned ₦{Number(earnings)/100 || 0} NGN for this delivery.  Keep it up!
                </Text>
            </View>
        </CustomModal>
    )
}

const styles = StyleSheet.create({
    modalTitle: {
        fontSize: s(16),
        fontFamily: "interSemiBold",
        textAlign: "center",
        marginTop:20
    },
    modalDescription: {
        marginTop: 20,
        color: "#636363",
        fontSize: 14,
        fontFamily: "interRegular",
        textAlign: "center",
    },
})

export default SuccessModal