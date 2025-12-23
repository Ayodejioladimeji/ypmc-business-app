import { UploadPhoto } from "@/components/auth/OrganizationAuth/UploadPhoto"
import TopNavigation from "@/components/TopNavigation"
import React from "react"
import { SafeAreaView, Text, View } from "react-native"


const UploadProfilePhoto = () => {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white', paddingTop: 40 }} >
            <TopNavigation title=""/>
            <UploadPhoto />
        </SafeAreaView>
    )
}

export default UploadProfilePhoto