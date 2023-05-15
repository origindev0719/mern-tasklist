import { createSlice } from "@reduxjs/toolkit";

const dataSlice = createSlice({
  name: "task",
  initialState: {
    isLoading: false,
    data: null,
    error: null,
    currentPage: 1,
    pagePer: 5,
    totalPage: 1,
    keyword: "",
    pending: true,
    started: true,
    completed: true,
    date: "all"
  },
  reducers: {
    fetchDataStart(state) {
      state.isLoading = true;
      state.error = null;
    },
    fetchDataSuccess(state, action) {
      state.isLoading = false;
      state.data = action.payload;
      state.error = null;
    },
    fetchDataFailure(state, action) {
      state.isLoading = false;
      state.data = null;
      state.error = action.payload;
    },
    addData(state, action) {
      state.data.push(action.payload);
    },
    removeData(state, action) {
      state.data.push(action.payload);
    },
    updateTotalPages(state, action) {
      state.totalPage = action.payload;
    },
    updateCurrentPage(state, action) {
      state.currentPage = action.payload;
    },
    updatePagePer(state, action) {
      state.pagePer = action.payload;
    },
    setSearchQuery(state, action) {
      state.keyword = action.payload;
    },
    updatePending(state, action) {
      state.pending = action.payload;
    },
    updatedCompleted(state, action) {
      state.completed = action.payload;
    },
    updateStarted(state, action) {
      state.started = action.payload;
    },
    updatedDate(state, action) {
      state.date = action.payload;
    }
  }
});

export const {
  fetchDataStart,
  fetchDataSuccess,
  fetchDataFailure,
  addData,
  addCase,
  removeData,
  updateTotalPages,
  updatePagePer,
  updateCurrentPage,
  setSearchQuery,
  updatePending,
  updateStarted,
  updatedCompleted,
  updatedDate
} = dataSlice.actions;

export default dataSlice.reducer;
