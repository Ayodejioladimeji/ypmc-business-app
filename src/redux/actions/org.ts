import { createApi } from "@reduxjs/toolkit/query/react";

import { AuthRequest, AuthResponse } from "@/types/type";

import { baseQuery } from "../config";

export const orgApi = createApi({
  reducerPath: "Org",
  baseQuery: baseQuery,
  tagTypes: ["Org", "Riders", 'Rider'],
  endpoints: (builder) => ({
    orgSignUp: builder.mutation<any, any>({
      query: (body) => ({
        url: "/auth/register/partner",
        method: "POST",
        body: JSON.stringify(body),
      }),
    }),

    orgLogin: builder.mutation<AuthResponse, AuthRequest>({
      query: (body) => ({
        url: "/auth/login/partner",
        method: "POST",
        body: JSON.stringify(body),
      }),
    }),

    verifyOtp: builder.mutation<any, any>({
      query: (body) => ({
        url: "/auth/verify-otp",
        method: "POST",
        body,
      }),
    }),

    resendOtp: builder.mutation<any, any>({
      query: (body) => ({
        url: "/auth/send-otp",
        method: "POST",
        body: JSON.stringify(body),
      }),
    }),

    forgotPassword: builder.mutation<any, any>({
      query: (body) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body,
      }),
    }),

    resetPassword: builder.mutation<any, any>({
      query: (body) => ({
        url: "/auth/reset-password",
        method: "POST",
        body,
      }),
    }),

    getOrgDetails: builder.query({
      query: () => "/partner/profile",
      providesTags: ["Org"],
    }),

    getDashboardMetrics: builder.query({
      query: () => "/rider-management/dashboard-metrics",
      providesTags: ["Org"],
    }),

    orgGetAllRiders: builder.query({
      query: () => "/rider-management/riders",
      providesTags: ["Riders"],
    }),

    approveRiderApplication: builder.mutation<any, any>({
      query: (riderId) => ({
        url: `/rider-management/approve-application/${riderId}`,
        method: "POST",
      }),
      invalidatesTags: ["Riders"],
    }),

    getRiderById: builder.query({
      query: (riderId) => `/rider-management/${riderId}`,
      providesTags: ["Rider"],
    }),

    uploadCompanyLogo: builder.mutation<any, any>({
      query: (formData) => ({
        url: '/partner/upload-logo',
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Org"],
    }),
  }),
});

export const {
  useOrgSignUpMutation,
  useOrgLoginMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useGetOrgDetailsQuery,
  useGetDashboardMetricsQuery,
  useOrgGetAllRidersQuery,
  useApproveRiderApplicationMutation,
  useGetRiderByIdQuery,
  useUploadCompanyLogoMutation
} = orgApi;
