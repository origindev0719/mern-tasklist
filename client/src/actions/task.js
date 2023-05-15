import axios from "axios";
import {
  fetchDataStart,
  fetchDataSuccess,
  fetchDataFailure,
  updateTotalPages,
  updateCurrentPage,
  updatePagePer,
  setSearchQuery,
  updatePending,
  updateStarted,
  updatedCompleted,
  updatedDate
} from "../slices/taskSlice";
const API_URL = "http://localhost:3001/api";

export const fetchTask = (setting) => async (dispatch) => {
  dispatch(fetchDataStart());
  try {
    const response = await axios.get(
      `${API_URL}/getTask?currentPage=${setting.currentPage}&pagePer=${setting.pagePer}&totalPage=${setting.totalPage}&keyword=${setting.keyword}&pending=${setting.pending}&completed=${setting.completed}&started=${setting.started}&date=${setting.date}`
    );
    dispatch(fetchDataSuccess(response.data));
    dispatch(updateTotalPages(response.data.totalPage));
    dispatch(setSearchQuery(setting.keyword));

    return { result: "success", data: response.data.taskList };
  } catch (error) {
    dispatch(fetchDataFailure(error.message));
    return { result: "error" };
  }
};

export const addTask = (data) => (setting) => async (dispatch) => {
  try {
    await axios.post(`${API_URL}/createTask`, {
      data,
      setting
    });
    const result = publicFetch(setting)(dispatch);
    return result;
  } catch (error) {
    return { result: "error" };
  }
};

export const updateTask = (data) => (setting) => async (dispatch) => {
  try {
    await axios.post(`${API_URL}/updateTask`, data);
    const result = publicFetch(setting)(dispatch);
    return result;
  } catch (error) {
    return { result: "error" };
  }
};

export const removeTask = (id) => (setting) => async (dispatch) => {
  try {
    const removeReturn = await axios.get(`${API_URL}/removeTask/${id}`);
    const result = await publicFetch(setting)(dispatch);
    const setCurrentPage = Math.ceil(
      removeReturn.data.totalItems / setting.pagePer
    );
    if (setCurrentPage < setting.currentPage) {
      dispatch(updateCurrentPage(setCurrentPage));
    }
    return result;
  } catch (error) {
    return { result: "error" };
  }
};

export const searchTask = (setting) => async (dispatch) => {
  try {
    const result = await axios.post(`${API_URL}/searchTask`, setting);
    dispatch(fetchDataSuccess(result.data.items));
    dispatch(setSearchQuery(setting.keyword));
    dispatch(updateCurrentPage(1));
    dispatch(updateTotalPages(result.data.totalPage));
    return result;
  } catch (error) {
    return { result: "error" };
  }
};

export const filterByTask = (filterBy) => (setting) => async (dispatch) => {
  try {
    const rst = await axios.post(`${API_URL}/filterTask`, {
      filterBy: filterBy,
      setting: setting
    });
    const { result, totalPage, currentPage } = rst.data;
    dispatch(fetchDataSuccess(result));
    dispatch(updateTotalPages(totalPage));
    dispatch(updateCurrentPage(currentPage));
    dispatch(updatePending(filterBy.pending));
    dispatch(updateStarted(filterBy.started));
    dispatch(updatedCompleted(filterBy.completed));
    dispatch(updatedDate(filterBy.date));
    return result;
  } catch (error) {
    return { result: error };
  }
};

export const publicFetch = (setting) => (dispatch) => {
  const result = fetchTask(setting)(dispatch);
  dispatch(updateTotalPages(setting.totalPage));
  dispatch(updatePagePer(setting.pagePer));
  dispatch(updateCurrentPage(setting.currentPage));
  return result;
};
