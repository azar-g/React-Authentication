import React, { useState, useEffect } from "react";

let logoutTimer;

const initialState = {
  token: "",
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {},
};
const AuthContext = React.createContext(initialState);

const retrieveToken = () => {
  const token = localStorage.getItem("token");
  const remainingTime = localStorage.getItem("expirationTime");
  if (remainingTime <= 10000) {
    localStorage.removeItem("token");
    localStorage.removeItem("expirationTime");
    return null;
  }

  return {
    token,
    remainingTime,
  };
};

export const AuthContextProvider = (props) => {
  const retrievedData = retrieveToken();
  console.log(retrievedData);
  let initialToken;
  if (retrievedData) {
    initialToken = retrievedData.token;
  }

  const [token, setToken] = useState(initialToken);

  const isLoggedIn = !!token;

  const logoutHandler = () => {
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("expirationTime");
    logoutTimer && clearTimeout(logoutTimer);
  };

  const loginHandler = (token, time) => {
    console.log(token, time);
    setToken(token);
    localStorage.setItem("token", token);
    localStorage.setItem("expirationTime", time);
    logoutTimer = setTimeout(logoutHandler, time);
  };

  if (retrievedData) setTimeout(logoutHandler, retrievedData.remainingTime);

  /*  useEffect(() => {
    
    setTimeout(logoutHandler, retrievedData.remainingTime);
  }, [retrievedData]); */

  const contextValue = {
    token,
    isLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};
export default AuthContext;
