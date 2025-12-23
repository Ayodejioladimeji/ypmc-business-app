import React, { useContext } from "react";
import { ImageBackground, Pressable, TouchableOpacity, View } from "react-native";

import { FontAwesome6, MaterialCommunityIcons } from "@expo/vector-icons";

import { images } from "@/constants";
import { colors } from "@/theme";
import { ACTIONS } from "@/store/Actions";
import { DataContext } from "@/store/GlobalState";
import { useRouter } from "expo-router";
import ShipmentTag from "../rider-components/shipment-tag";
import DeliveriesBottom from "./deliveries-bottom";


interface ShipmentProps {
  data: any
}

export const ShipmentCard = ({ data }: ShipmentProps) => {
  const { state, dispatch } = useContext(DataContext)
  const router = useRouter()


  const handleRoute = () => {
      router.push({
        pathname: "/(org)/delivery-details", 
        params: {
          id: data?.id,
          riderId: data?.rider?.id
        }
      });
  }

  // 
  return (
    <TouchableOpacity
      onPress={handleRoute}
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
          resizeMode="cover"
        />

        <View style={{ position: 'absolute', right: 10, top: 10 }}>
          <ShipmentTag status={data?.status} />
        </View>
      </View>

      <DeliveriesBottom data={data} />
    </TouchableOpacity>
  );
};
