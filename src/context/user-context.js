import React from "react";

const defaultContext = {
  user: {
    loggedIn: false,
    isAgent: false,
  },
};

export const UserContext = React.createContext(defaultContext);

export const userReducer = (state = defaultContext, action) => {
  switch (action.type) {
    case "SET_USER":
      return {
        ...action.user,
      };
    case "CLEAR_USER":
      return defaultContext;

    default:
      return state;
  }
};
