import axios from "axios";
import { checkAuth, updateUserInfo } from "../slices/authSlice";

const API_URL = "http://localhost:3001/api";

export const loginUser = (userData) => (navigate) => async (dispatch) => {
  try {
    const returnValue = await axios.post(`${API_URL}/signin`, userData);
    if (returnValue.data.error) {
      return "error";
    }
    const { email, password, token, username } = returnValue.data;
    localStorage.setItem(
      "user",
      JSON.stringify({
        username: username,
        email: email,
        password: password
      })
    );
    dispatch(checkAuth(true));
    dispatch(updateUserInfo(username));

    localStorage.setItem("token", token);
    navigate("/");
  } catch (err) {
    console.log("error", err);
  }
};

export const register = async (userData) => {
  let user = await axios.post(`${API_URL}/register`, userData);
  return user;
};
