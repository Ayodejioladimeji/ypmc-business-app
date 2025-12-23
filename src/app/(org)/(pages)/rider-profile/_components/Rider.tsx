import React from "react";
import { TouchableOpacity, View } from "react-native";

import { Href, router } from "expo-router";
import { Avatar, RiderBadge, VerifiedCheckMark } from "@/components";
import { Text } from "@/components/ui";
import { colors } from "@/theme";
import { MessageIcon, PhoneCallIcon, WhiteMessageIcon } from "@/assets/images/svgs";
import { handleDial } from "@/helpers/dialNumber";
import { Image } from "expo-image";
import images from "@/assets/images";
import UseChat from "@/app/(org)/chat/_components/use-chat";

const Rider = ({ riderDetails, riderId }: any) => {


  const handleRoute = () => {

    router.push({
      pathname: `/(org)/chat/[id]`,
      params: {
        id: riderId as string,
        rider: JSON.stringify(riderDetails),
      },
    });

  }

  return (
    <View
      style={{
        backgroundColor: "white",
        padding: 18,
        justifyContent: "center",
        alignItems: "center",
        gap: 6,
        borderBottomWidth: 1,
        borderColor: colors.border,
        paddingBottom: 30
      }}
    >
      <UseChat riderId={riderId}/>

      <Image
        source={riderDetails?.metadata?.profileImageUrl || images?.user}
        style={{
          width: 80,
          height: 80,
          borderRadius: 50,
          borderWidth: 0.5,
          borderColor: colors.mutedForeground
        }}
        contentFit="contain"
      />

      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          gap: 6,
        }}
      >
        <Text style={{ fontWeight: "bold", fontSize: 18 }}>
          {riderDetails?.firstName} {riderDetails?.lastName}
        </Text>
        <VerifiedCheckMark />
      </View>

      <RiderBadge status={riderDetails?.status} />

      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          gap: 6,
          marginTop: 12,
        }}
      >
        <TouchableOpacity
          onPress={() => handleDial(riderDetails?.user?.phoneNumber)}
          style={{
            borderWidth: 1,
            borderRadius: 20,
            borderColor: colors.border,
            paddingHorizontal: 20,
            backgroundColor: 'white',
            paddingVertical: 10,
            width: 100,
            alignItems: 'center',
            flexDirection: 'row'
          }}
        >
          <PhoneCallIcon />
          <Text style={{ fontFamily: 'interMedium' }}>Call</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleRoute}
          style={{
            borderRadius: 20,
            paddingHorizontal: 20,
            backgroundColor: 'black',
            paddingVertical: 10,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <WhiteMessageIcon />
          <Text style={{ color: 'white', fontFamily: 'interMedium' }}>Message</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
};

export default Rider