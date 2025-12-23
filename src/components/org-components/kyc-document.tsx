import React, { useContext, useState } from "react";
import { ScrollView } from "react-native";

import { AntDesign } from "@expo/vector-icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { CustomButton } from "@/components";
import { DataContext } from "@/store/GlobalState";
import VotersCardUpload from "./voters-card";
import DriversLicenseUpload from "./drivers-license";
import ElectricityBill from "./electricity-bill";
import Selfie from "./selfie";

interface Props {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
}

type UploadedImages = {
  driversLicense: UploadedFile | null;
  electricityBill: UploadedFile | null;
  votersCard: UploadedFile | null;
  selfie: UploadedFile | null;
};

type UploadedFile = {
  uri: string;
  name: string;
  size: number;
};

export const KycDocument = ({ step, setStep }: Props) => {
  const { state } = useContext(DataContext);
  const {driversLicenseUploadedFile, electricityBillUploadedFile, selfieUploadedFile} = state


  // Function to submit uploaded images
  const handleSubmit = () => {
    setStep(step +1)
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid={true}
      extraScrollHeight={100}
      keyboardShouldPersistTaps="handled"
    >
      <ScrollView style={{ paddingHorizontal: 16 }}>

        <VotersCardUpload/>
        <DriversLicenseUpload/>

        <ElectricityBill />
        <Selfie />

        <CustomButton
          style={{ gap: 5, marginTop: 20, marginBottom: 50 }}
          title="Next"
          icon={<AntDesign name="arrowright" size={18} color="white" />}
          onPress={handleSubmit}
          disabled={
            !driversLicenseUploadedFile ||
            !electricityBillUploadedFile ||
            !selfieUploadedFile
          }
        />
      </ScrollView>
    </KeyboardAwareScrollView>
  );
};
