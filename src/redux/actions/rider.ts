import { createApi } from "@reduxjs/toolkit/query/react";
import { io } from "socket.io-client";

import { AuthRequest, AuthResponse } from "@/types/type";

import { baseQuery } from "../config";

export const riderApi = createApi({
  reducerPath: "rider",
  baseQuery: baseQuery,
  tagTypes: ["Rider", "Business Hours"],
  endpoints: (builder) => ({
    riderSignUp: builder.mutation<any, any>({
      query: (body) => ({
        url: "/auth/register/rider",
        method: "POST",
        body: JSON.stringify(body),
      }),
    }),

    riderLogin: builder.mutation<AuthResponse, AuthRequest>({
      query: (body) => ({
        url: "/auth/login/rider",
        method: "POST",
        body: body,
      }),
    }),

    uploadRiderPhoto: builder.mutation<any, any>({
      query: (formData) => ({
        url: "/rider/upload-profile-image",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Rider"],
    }),

    getRiderDetails: builder.query({
      query: () => "/rider/profile",
      providesTags: ["Rider"],
    }),

    updateRiderStatus: builder.mutation({
      query: (status) => ({
        url: "/rider/status",
        method: "PATCH",
        body: status,
      }),
      invalidatesTags: ["Rider"],
    }),

    updateRiderProfile: builder.mutation({
      query: (body) => ({
        url: "/rider/profile",
        method: "PUT",
        body: body,
      }),
      invalidatesTags: ["Rider"],
    }),

    setRiderBusinessHours: builder.mutation({
      query: (body) => ({
        url: "/operating-hours/rider/bulk",
        method: "PATCH",
        body: body,
      }),
      invalidatesTags: ["Business Hours"],
    }),

    getRiderBusinessHours: builder.query({
      query: () => ({
        url: "/operating-hours/rider",
        providesTags: ["Business Hours"],
      }),
    }),
    getRiderShipments: builder.query({
      query: () => ({
        url: "/shipping/rider?assignmentType=proposed",
      }),
    }),
  }),
});

export const {
  useRiderSignUpMutation,
  useRiderLoginMutation, 
  useUploadRiderPhotoMutation,
  useGetRiderDetailsQuery,
  useUpdateRiderStatusMutation,
  useUpdateRiderProfileMutation,
  useSetRiderBusinessHoursMutation,
  useGetRiderBusinessHoursQuery,
  useGetRiderShipmentsQuery,
} = riderApi;
