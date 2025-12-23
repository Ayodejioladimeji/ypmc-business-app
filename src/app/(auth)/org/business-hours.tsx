import { BusinessHours } from "@/components/auth/OrganizationAuth"
import TopNavigation from "@/components/TopNavigation"
import { AntDesign } from "@expo/vector-icons"
import React from "react"
import { Pressable, SafeAreaView, ScrollView, Text, View } from "react-native"


const BusinessHour = () => {
    return(
        <SafeAreaView style={{flex:1, backgroundColor:'white', paddingTop:40}}>
            <TopNavigation title=""/>
            <BusinessHours/>
        </SafeAreaView>
    )
}

export default BusinessHour