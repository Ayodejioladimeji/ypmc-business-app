import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchBaseQuery } from "@reduxjs/toolkit/query";

export const baseQuery = fetchBaseQuery({
  baseUrl: process.env.EXPO_PUBLIC_API_URL,
  prepareHeaders: async (headers, { endpoint }) => {
    // Skip setting Content-Type for file uploads
    if (endpoint !== "uploadRiderPhoto") {
      headers.set("Content-Type", "application/json");
    }

    const accessToken = await AsyncStorage.getItem("accessToken");
    if (accessToken) {
      headers.set("authorization", `Bearer ${accessToken}`);
    }
    return headers;
  },
});
