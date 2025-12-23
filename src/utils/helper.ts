import AsyncStorage from '@react-native-async-storage/async-storage';
// import {PostRequest} from './requests';

//
export const storeToken = async (key: string, value: any) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    // saving error
  }
};

export const retrieveToken = async (key: string) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    // error reading value
  }
};

export const storeData = async (key: string, value: any) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    // saving error
  }
};

export const retrieveData = async (key: string) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    // error reading value
  }
};

export const removeToken = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    // remove error
  }
};

// export const getDistance = async (
//   riderCoord: any,
//   orderCoord: any,
//   token: string,
// ) => {
//   const newData = {
//     riderCoord: {
//       lat: riderCoord?.lat,
//       lng: riderCoord?.lng,
//     },
//     PickUpCoord: {
//       lat: orderCoord?.lat,
//       lng: orderCoord?.lng,
//     },
//   };

//   try {
//     const res = await PostRequest('/rider/rider-distance', newData, token);
//     return res.data?.data?.duration?.text;
//   } catch (error) {
//     console.log('server error', error);
//   }
// };
