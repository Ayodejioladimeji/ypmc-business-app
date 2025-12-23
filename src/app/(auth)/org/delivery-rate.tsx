import { DeliveryRate } from "@/components/auth/OrganizationAuth"
import TopNavigation from "@/components/TopNavigation"
import React from "react"
import { SafeAreaView, Text, View } from "react-native"


const DeliveryRates = () => {
    return(
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white', paddingTop: 40 }}>
            <TopNavigation title="" />
            <DeliveryRate/>
        </SafeAreaView>
    )
}

export default DeliveryRates