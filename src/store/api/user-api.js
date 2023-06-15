import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react';

import { baseApiUrl, prepHeaders } from '../../settings/api';
import { authApi } from './auth-api';

import { API_URLS } from '../../settings/urls';
import axios from '../../settings/axios-instance';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseApiUrl}${API_URLS.api}`,
    prepareHeaders: prepHeaders,
  }),
  endpoints: (builder) => ({
    changeUserPhoto: builder.mutation({
      async queryFn(arg, { getState }) {
        try {
          const formData = new FormData();
          formData.append('files', arg);
          const respImage = await axios.post(`${baseApiUrl}${API_URLS.api}${API_URLS.upload}`, formData);

          const state = getState();
          const user = authApi.endpoints.authMe.select()(state);

          const resChangePhoto = await axios.put(`${baseApiUrl}${API_URLS.api}${API_URLS.users}/${user.data.id}`, {
            avatar: respImage.data[0].id,
          });
          return { data: resChangePhoto };
        } catch (error) {
          return { error };
        }
      },
    }),
    changeUserData: builder.mutation({
      query: (data) => ({
        url: `${API_URLS.users}/${data.userId}`,
        method: 'PUT',
        body: data.data,
      }),
    }),
  }),
});

export const { useChangeUserPhotoMutation, useChangeUserDataMutation } = userApi;
