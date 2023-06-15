import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  globalLoader: false,
  user: null,
  toast: {
    text: '',
    type: '',
    show: false,
  },
};

export const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
    setGlobalLoader(state, action) {
      state.globalLoader = action.payload;
    },
    setToast(state, action) {
      state.toast = action.payload;
    },
  },
});

export const { setUser, setGlobalLoader, setToast } = globalSlice.actions;

export const { reducer } = globalSlice;
