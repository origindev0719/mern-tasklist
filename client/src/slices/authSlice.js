import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLogged: false,
    data: null
  },
  reducers: {
    checkAuth(state, action) {
      state.isLogged = action.payload;
    },
    updateUserInfo(state, action) {
      state.data = action.payload;
    }
  }
});

export const { checkAuth, updateUserInfo } = authSlice.actions;

export default authSlice.reducer;
