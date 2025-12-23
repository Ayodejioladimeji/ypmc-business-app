import React, { useContext } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

import { Feather, FontAwesome, Fontisto, Ionicons} from "@expo/vector-icons";
import { Text } from "@/components/ui";
import { ImageBackground } from "expo-image";
import { images } from "@/constants";
import { colors } from "@/theme";
import ShipmentTag from "@/components/rider-components/shipment-tag";
import { getShipmentStyles } from "@/components/rider-components/shipment-icon";
import { useRouter, useSegments } from "expo-router";
import AddressList from "@/components/addresslist";
import AddressListRider from "@/components/addressListRider";
import { ACTIONS } from "@/store/Actions";
import { DataContext } from "@/store/GlobalState";


const ActiveShipment = ({data}) => {
  const {dispatch} = useContext(DataContext)
  const router = useRouter()

  const handleRoute = (item:any) => {
    dispatch({ type: ACTIONS.ORDER, payload: item })
    router.push("/track-shipment")
  }


  // 

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 15,
        // backgroundColor: backgroundColor,
        borderRadius: 16,
        gap: 12,
        paddingVertical: 20
      }}
    >
      <Text
        style={{
          fontSize: 18,
          fontWeight: "bold",
        }}
      >
        Active shipment
      </Text>

      {data?.activeShipments?.map((item:any, index:number) => {
        const { backgroundColor, iconColor } = getShipmentStyles(item?.status);

        // 

        return(
          <View
          key={index}
            style={{
              borderRadius: 12,
              marginTop: 2,
              marginBottom: 12,
              borderWidth: 1,
              overflow: 'hidden',
              borderColor: colors.border
            }}
          >
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <ImageBackground
                source={images.shipment}
                style={{
                  width: "100%",
                  height: 150,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              />
            </View>

            <View style={styles.container}>
              <View style={styles.leftSection}>
                {/* Icon */}
                <View style={[styles.iconContainer, { backgroundColor }]}>
                  <Ionicons name="cube-outline" size={24} style={{ color: iconColor }} />
                </View>

                {/* Text Content */}
                <View style={styles.textContainer}>
                  <Text style={styles.title} numberOfLines={2}>
                    {item?.packageDetails?.name}
                  </Text>
                </View>
              </View>

              <AddressListRider data={item} />

              <TouchableOpacity
              style={{
                flexDirection:'row',
                alignItems:'center',
                justifyContent:'center',
                gap:5,
                padding:15,
                backgroundColor:colors.primary,
                borderRadius:30,
                marginTop:30
              }}
              onPress={() => handleRoute(item)}
              >
                <Text style={{color:"white", fontFamily:'interSemiBold'}}>Track Live Location</Text>
                <Feather name="map-pin" size={15} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        )
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    container: {
        padding: 15,
    },
    leftSection: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    iconContainer: {
        width: 45,
        height: 45,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
    },
    textContainer: {
        flex: 1,
        marginLeft: 8,
    }, 
    title: {
        fontSize: 15,
        fontWeight: "bold",
        flexShrink: 1,
        marginBottom:5
    },
    eta: {
        fontSize: 15,
    },
    amountContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginLeft: 10,
    },
    amount: {
        fontSize: 15,
        fontWeight: "bold",
    },
});

export default ActiveShipment
