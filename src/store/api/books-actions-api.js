import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_URLS } from '../../settings/urls';
import { baseApiUrl, prepHeaders } from '../../settings/api';

export const bookActionsApi = createApi({
  reducerPath: 'bookActionsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseApiUrl}${API_URLS.api}`,
    prepareHeaders: prepHeaders,
  }),
  endpoints: (builder) => ({
    sendBookReview: builder.mutation({
      query: (reviewData) => ({
        url: API_URLS.sendReview,
        method: 'POST',
        body: { data: reviewData },
      }),
    }),
    getBookById: builder.query({
      query: (id) => ({ url: `${API_URLS.books}/${id}`, method: 'GET' }),
    }),
    getBookCategories: builder.query({
      query: () => ({
        url: API_URLS.categories,
        method: 'GET',
      }),
    }),
    getAllBooks: builder.query({
      query: () => ({
        url: API_URLS.books,
        method: 'GET',
      }),
      providesTags: ['books'],
    }),

    sendBookingRequest: builder.mutation({
      query: (bookingData) => ({
        url: API_URLS.bookings,
        method: 'POST',
        body: { data: bookingData },
      }),
      invalidatesTags: ['books'],
    }),
    sendUnbookingRequest: builder.mutation({
      query: (bookingId) => ({
        url: `${API_URLS.bookings}/${bookingId}`,
        method: 'DELETE',
      }),
    }),
    sendChangeBookingRequest: builder.mutation({
      query: (params) => ({
        url: `${API_URLS.bookings}/${params.id}`,
        method: 'PUT',
        body: { data: params.data },
      }),
    }),
    sendChangeBookReview: builder.mutation({
      query: (params) => ({
        url: `${API_URLS.sendReview}/${params.commentId}`,
        method: 'PUT',
        body: { data: params.data },
      }),
    }),
  }),
});

export const {
  useSendBookReviewMutation,
  useSendUnbookingRequestMutation,
  useSendChangeBookingRequestMutation,
  useSendBookingRequestMutation,
  useSendChangeBookReviewMutation,
  useGetAllBooksQuery,
  useGetBookByIdQuery,
  useGetBookCategoriesQuery,
} = bookActionsApi;
