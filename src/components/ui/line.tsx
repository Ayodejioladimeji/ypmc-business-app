import { colors } from '@/theme'
import React from 'react'
import { View } from 'react-native'

export const Line = () => {
    return(
        <View style={{height:2, backgroundColor:colors.muted, marginVertical:10}}></View>
    )
}

export const Ruler = () => {
    return(
        <View style={{height:2, backgroundColor:colors.muted}}></View>
    )
}

export const Divider = () => {
    return(
        <View style={{height:1, backgroundColor:colors.border, marginVertical:20}}></View>
    )
}


