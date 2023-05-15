import React from "react";
import { Navigate } from "react-router-dom";
import { decodeToken } from "react-jwt";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  let auth = null;

  if (token) {
    auth = decodeToken(token);
    if (Date.now() / 1000 > auth.exp) {
      localStorage.clear();
      return <Navigate to="/login" />;
    }
    console.log(auth);
  }

  return auth ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
