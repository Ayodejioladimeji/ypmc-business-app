"use client";

import { createContext, useReducer, ReactNode } from "react";
import reducers from "./Reducers";

// Create the context with a default value
export const DataContext = createContext<any>(undefined);

// Define the type for the provider props
interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider = ({ children }: DataProviderProps) => {
  const initialState = {
    user: null,
    token: null,
    callback: false,
    profileLoading:true,
    orderData:null,
    signupData:null,
    validated:false,
    order:null,
    orderStarted:false,
    isArrived:false,
    riderLocation:null,
    currentLocation:null,
    message:null,
    orderModal:false,
    delivered:false, 
    earnings:"",
    deviceInfo:null, 
    status:"", 
    socket:"",
    customerSocket:"",
    chats:null, 
    customerChats:null, 
    activeChats:[],
    activeCustomerChats:[],
    recipient:null,
    partnerChatLoading:true,
    customerChatLoading:true,
    partnerCallback:false,
    customerCallback:false,
    uploadedImages: {
      votersCard: null,
      driversLicense: null,
      electricityBill: null,
    },
    approval:false,
    notifications:[],
    notificationCallback:false,
    ninUploadedFile:null,
    driversLicenseUploadedFile:null,
    electricityBillUploadedFile:null,
    selfieUploadedFile:null,
    riderId:"",
    wallets:null,
    newChats:null,
    shipmentOrder:null,
    rider:null,
    incoming:null,
    messages:null,
    packageDelivered:null,
    shippingType:""
  };

  const [state, dispatch] = useReducer(reducers, initialState);

  return (
    <DataContext.Provider value={{ state, dispatch }}>
      {children}
    </DataContext.Provider>
  );
};
