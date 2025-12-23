import React, { useContext, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import {
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { Divider } from "react-native-paper";
import { CustomButton } from "@/components/CustomButton";
import { Text } from "../../ui";
import images from "@/assets/images";
import { s } from "react-native-size-matters";
import AddressList from "@/components/addresslist";
import { Image } from "expo-image";
import { colors } from "@/theme";
import { formatMoney } from "@/utils/utils";
import { Button, ButtonText } from "@/components/ui/button";
import { PostRequest } from "@/utils/requests";
import { DataContext } from "@/store/GlobalState";
import { ACTIONS } from "@/store/Actions";
import { toast } from "sonner-native";
import CustomModal from "@/components/ui/modal";

// 

export const OrgShipmentOrderComponent = ({ item }) => {
  const [rejectLoading, setRejectLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false)
  const { state, dispatch } = useContext(DataContext)
  const [confirmModal, setConfirmModal] = useState(false)


  const handleAccept = async () => {
    setButtonLoading(true);

    const payload = {
      data: "",
    };

    const res = await PostRequest(`/shipping/${item.id}/partner-approve`, payload, state?.token)

    if (res?.status === 200 || res?.status === 201) {
      dispatch({ type: ACTIONS.CALLBACK, payload: !state?.callback });
      toast.success(res?.data?.message);
    }

    setButtonLoading(false);
  };

  // reject order
  const handleReject = async () => {
    setRejectLoading(true);

     const res = await PostRequest(
        `/shipping/${item.id}/partner-reject`,
        {},
        state?.token
      );


    if (res?.status === 200 || res?.status === 201) {
      toast.success(res?.data?.message);
      setConfirmModal(false);
      dispatch({ type: ACTIONS.CALLBACK, payload: !state?.callback });
    }

    setRejectLoading(false);
  };

  // 

  return (
    <View style={{ backgroundColor: "#F972160D", borderRadius: 12, paddingVertical: 18, paddingHorizontal: 10 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Image
            source={item?.picture || images?.user}
            style={{
              width: 40,
              height: 40,
              borderRadius: 50,
              borderWidth: 0.5,
              borderColor: colors.mutedForeground
            }}
            contentFit="contain"
          />
          <Text style={{ fontSize: s(13), fontWeight: "bold" }}>{item?.riderName}</Text>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <View
            style={{
              height: 10,
              width: 10,
              backgroundColor: "#4fb948",
              borderRadius: 40,
            }}
          />
          <Text style={{ fontSize: s(13), fontWeight: "semibold" }}>{item?.riderStatus}</Text>
        </View>
      </View>

      <Divider style={{ marginTop: 15 }} />

      <View
        style={{
          marginTop: 12,
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          flexWrap: "wrap",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            padding: 3,
            backgroundColor: "#F972161A",
            width: 25,
            borderRadius: 40,
            justifyContent: "center",
          }}
        >
          <MaterialCommunityIcons
            name="package-variant-closed"
            color="#f97216"
            size={20}
          />
        </View>

        <View style={{ flex: 1, flexDirection: "row", flexWrap: "wrap", alignItems: "center" }}>
          <Text
            style={{
              fontWeight: "bold",
              fontSize: s(14),
              flexShrink: 1,
              flexWrap: "wrap",
            }}
          >
            {item?.packageDetails?.name}
          </Text>
          {/* <Text style={{ fontSize: 14 }}> (small)</Text> */}
        </View>
      </View>


      <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12, marginTop: 10 }}>
        <Text style={{ fontSize: s(14), fontFamily: 'interMedium' }}>
          ₦
          {formatMoney(item?.actualPriceInNaira)}
        </Text>

        <Text>
          <Ionicons name="location-sharp" />
          {parseInt(item?.getTotalDistance)}km
        </Text>
      </View>

      {/* Additional Details */}
      <AddressList data={item} />

      <View style={{ marginTop: 24, flexDirection: "row", gap: 6 }}>
        <CustomButton
          onPress={handleAccept}
          title={"Accept order"}
          style={{
            flex: 1,
            backgroundColor: "#f97216",
            gap: 4,
            borderRadius: 50,
            paddingVertical: 10, height: 50
          }}
          icon={
            buttonLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Ionicons name="checkmark" size={24} style={{ color: "#fff" }} />
            )
          }
        />

        <CustomButton
          onPress={() => setConfirmModal(true)}
          bgVariant="secondary"
          textVariant="secondary"
          title={"Reject"}
          style={{ flex: 1, borderRadius: 50, paddingVertical: 10, height: 50, color: colors.primary }}
        />
      </View>

      <CustomModal
        visible={confirmModal}
        onClose={() => { setConfirmModal(false), dispatch({ type: ACTIONS.ORDER, payload: null }) }}
      >
        <View style={{ paddingHorizontal: 10 }}>
          <Text style={styles.modalTitle}>Reject Order?</Text>
          <Text style={styles.modalDescription}>
            Are you sure you want to reject this order? This action cannot be undone.
          </Text>

          <View style={{ marginTop: 50 }}>
            <Button
              onPress={handleReject}
              size="sm"
              style={{ backgroundColor: "#E73323" }}
            >
              <ButtonText>Yes, Reject </ButtonText>
              {rejectLoading && (
                <ActivityIndicator color="#fff" size="small" />
              )}
            </Button>

            <Button
              variant="outline"
              style={{
                marginTop: 10,
                borderRadius: 25,
                paddingVertical: 15,
              }}
              onPress={() => setConfirmModal(false)}
            >
              <ButtonText>No, Continue </ButtonText>
            </Button>
          </View>
        </View>
      </CustomModal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalTitle: {
    fontSize: 16,
    fontFamily: "interSemiBold",
    textAlign: "center",
  },
  modalDescription: {
    marginTop: 20,
    color: "#636363",
    fontSize: 14,
    fontFamily: "interRegular",
    textAlign: "center",
  },
})