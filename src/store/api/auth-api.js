import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react';

import { baseApiUrl, prepHeaders } from '../../settings/api';
import { globalSlice } from '../slices/global-slice';
import { API_URLS } from '../../settings/urls';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseApiUrl}${API_URLS.api}`,
    prepareHeaders: prepHeaders,
  }),
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (userData) => ({
        url: `${API_URLS.auth}${API_URLS.local}${API_URLS.register}`,
        method: 'POST',
        body: userData,
      }),
    }),
    login: builder.mutation({
      query: (userData) => ({
        url: `${API_URLS.auth}${API_URLS.local}`,
        method: 'POST',
        body: userData,
      }),
    }),
    recoverPass: builder.mutation({
      query: (email) => ({ url: `${API_URLS.auth}${API_URLS.forgotPass}`, method: 'POST', body: email }),
    }),
    resetPass: builder.mutation({
      query: (newPass) => ({ url: `${API_URLS.auth}${API_URLS.resetPass}`, method: 'POST', body: newPass }),
    }),
    authMe: builder.query({
      query: () => ({
        url: `${API_URLS.me}`,
        method: 'GET',
      }),
    }),
  }),
});

export const { useRegisterMutation, useLoginMutation, useRecoverPassMutation, useResetPassMutation, useAuthMeQuery } =
  authApi;
