import { ACTIONS } from "./Actions";

const reducers = (state: any, action: any) => {
  const { type, payload } = action;
  switch (type) {
    case ACTIONS.USER:
      return {
        ...state,
        user: payload,
      };
    case ACTIONS.TOKEN:
      return {
        ...state,
        token: payload,
      };
    case ACTIONS.CALLBACK:
      return {
        ...state,
        callback: payload,
      };
    case ACTIONS.PROFILE_LOADING:
      return {
        ...state,
        profileLoading: payload,
      };
    case ACTIONS.ORDER_DATA:
      return {
        ...state,
        orderData: payload ? { ...state?.orderData, ...payload } : null,
      };
    case ACTIONS.SIGNUP_DATA:
      return {
        ...state,
        signupData: payload ? { ...state?.signupData, ...payload } : null,
      };
    case ACTIONS.VALIDATED:
      return {
        ...state,
        validated: payload,
      };
    case ACTIONS.ORDER:
      return {
        ...state,
        order: payload,
      };
    case ACTIONS.ORDER_STARTED:
      return {
        ...state,
        orderStarted: payload,
      };
    case ACTIONS.IS_ARRIVED:
      return {
        ...state,
        isArrived: payload,
      };
    case ACTIONS.RIDER_LOCATION:
      return {
        ...state,
        riderLocation: payload,
      };
    case ACTIONS.CURRENT_LOCATION:
      return {
        ...state,
        currentLocation: payload,
      };
    case ACTIONS.MESSAGE:
      return {
        ...state,
        message: payload,
      };
    case ACTIONS.ORDER_MODAL:
      return {
        ...state,
        orderModal: payload,
      };
    case ACTIONS.DELIVERED:
      return {
        ...state,
        delivered: payload,
      };
    case ACTIONS.EARNINGS:
      return {
        ...state,
        earnings: payload,
      };
    case ACTIONS.DEVICE_INFO:
      return {
        ...state,
        deviceInfo: payload,
      };
    case ACTIONS.STATUS:
      return {
        ...state,
        status: payload,
      };
    case ACTIONS.SOCKET:
      return {
        ...state,
        socket: payload,
      };
    case ACTIONS.CUSTOMER_SOCKET:
      return {
        ...state,
        customerSocket: payload,
      };
    case ACTIONS.CHATS:
      return {
        ...state,
        chats: payload,
      };
    case ACTIONS.CUSTOMER_CHATS:
      return {
        ...state,
        customerChats: payload,
      };
    case ACTIONS.ACTIVE_CHATS:
      return {
        ...state,
        activeChats: payload,
      };
    case ACTIONS.ACTIVE_CUSTOMER_CHATS:
      return {
        ...state,
        activeCustomerChats: payload,
      };
    case ACTIONS.RECIPIENT:
      return {
        ...state,
        recipient: payload,
      };
    case ACTIONS.PARTNER_CHAT_LOADING:
      return {
        ...state,
        partnerChatLoading: payload,
      };
    case ACTIONS.CUSTOMER_CHAT_LOADING:
      return {
        ...state,
        customerChatLoading: payload,
      };
    case ACTIONS.PARTNER_CALLBACK:
      return {
        ...state,
        partnerCallback: payload,
      };
    case ACTIONS.CUSTOMER_CALLBACK:
      return {
        ...state,
        customerCallback: payload,
      };
    case ACTIONS.UPLOADED_IMAGES:
      return {
        ...state,
        uploadedImages: payload,
      };
    case ACTIONS.APPROVAL:
      return {
        ...state,
        approval: payload,
      };
    case ACTIONS.NOTIFICATIONS:
      return {
        ...state,
        notifications: payload,
      };
    case ACTIONS.NOTIFICATION_CALLBACK:
      return {
        ...state,
        notificationCallback: payload,
      };
    case ACTIONS.NIN_UPLOADED_FILE:
      return {
        ...state,
        ninUploadedFile: payload,
      };
    case ACTIONS.DRIVERS_LICENSE_UPLOADED_FILE:
      return {
        ...state,
        driversLicenseUploadedFile: payload,
      };
    case ACTIONS.ELECTRICITY_BILL_UPLOADED_FILE:
      return {
        ...state,
        electricityBillUploadedFile: payload,
      };
    case ACTIONS.SELFIE_UPLOADED_FILE:
      return {
        ...state,
        selfieUploadedFile: payload,
      };
    case ACTIONS.RIDER_ID:
      return {
        ...state,
        riderId: payload,
      };
    case ACTIONS.WALLETS:
      return {
        ...state,
        wallets: payload,
      };
    case ACTIONS.NEW_CHATS:
      return {
        ...state,
        newChats: payload,
      };
    case ACTIONS.SHIPMENT_ORDER:
      return {
        ...state,
        shipmentOrder: payload,
      };
    case ACTIONS.RIDER:
      return {
        ...state,
        rider: payload,
      };
    case ACTIONS.INCOMING:
      return {
        ...state,
        incoming: payload,
      };
    case ACTIONS.MESSAGES:
      return {
        ...state,
        messages: payload,
      };
    case ACTIONS.PACKAGE_DELIVERED:
      return {
        ...state,
        packageDelivered: payload,
      };
    case ACTIONS.SHIPPING_TYPE:
      return {
        ...state,
        shippingType: payload,
      };

    default:
      return state;
  }
};

export default reducers;
