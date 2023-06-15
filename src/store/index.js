import { configureStore } from '@reduxjs/toolkit';

import { authApi } from './api/auth-api';
import { reducer as productSliceReducer } from './slices/books-slice';
import { reducer as globalSliceReducer } from './slices/global-slice';
import { bookActionsApi } from './api/books-actions-api';
import { userApi } from './api/user-api';

export const store = configureStore({
  reducer: {
    books: productSliceReducer,
    global: globalSliceReducer,

    [authApi.reducerPath]: authApi.reducer,
    [bookActionsApi.reducerPath]: bookActionsApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false })
      .concat(authApi.middleware)
      .concat(bookActionsApi.middleware)
      .concat(userApi.middleware),
});
