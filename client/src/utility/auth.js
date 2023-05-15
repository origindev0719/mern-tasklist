import axios from "axios";
const API_URL = "http://localhost:3001/api";

export const verifyToken = async (token) => {
  const returnValue = await axios.post(`${API_URL}/vaildAuth`, {
    token: token
  });
  return returnValue;
};
