import React, { useContext } from "react";
import { ImageBackground, Pressable, TouchableOpacity, View } from "react-native";

import { FontAwesome6, MaterialCommunityIcons } from "@expo/vector-icons";

import { images } from "@/constants";

import { Text } from "../ui";
import { colors } from "@/theme";
import DeliveriesBottom from "./deliveries-bottom";
import { ACTIONS } from "@/store/Actions";
import { DataContext } from "@/store/GlobalState";
import { useRouter } from "expo-router";
import ShipmentTag from "./shipment-tag";
import { SubscriptionIcon } from "@/assets/images/svgs";

interface ShipmentProps {
  data: any
}

export const ShipmentCard = ({ data }: ShipmentProps) => {
  const { state, dispatch } = useContext(DataContext)
  const router = useRouter()



  const handleRoute = () => {
    dispatch({ type: ACTIONS.ORDER_MODAL, payload: false })
    
    if (data?.status === "PENDING") {
      dispatch({ type: ACTIONS.ORDER, payload: data })
      router.push("/(rider)/start-order");
    }
    else if (data?.status === "PAYMENT_COMPLETED") {
      dispatch({ type: ACTIONS.ORDER, payload: data })
      router.push("/(rider)/start-order");
    }
    else if (data?.status === "IN_TRANSIT") {
      dispatch({ type: ACTIONS.ORDER, payload: data })
      router.push("/(rider)/pickup-order");

    }
    else if (data?.status === "PICKED_UP") {
      dispatch({ type: ACTIONS.ORDER, payload: data })
      router.push("/(rider)/deliver-order");

    }
    else {
      router.push({
        pathname: "/(rider)/delivery-details",
        params: {
          id: data?.id
          // id: data?.type === "single" ? data?.id : data?.multiShippingId
        }
      });
    }
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
