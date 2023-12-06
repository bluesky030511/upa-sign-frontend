import React, { useContext, createContext, useReducer, useMemo } from "react";

const initialState = {
  successToast: {
    open: false,
    message: null,
  },
  errorToast: {
    open: false,
    message: null,
  },
};

const ToastContext = createContext(initialState);

function toastReducer(state, action) {
  switch (action.type) {
    case "SHOW_SUCCESS_TOAST":
      return {
        ...state,
        successToast: {
          open: true,
          message: action.payload,
        },
      };
    case "HIDE_SUCCESS_TOAST":
      return {
        ...state,
        successToast: {
          open: false,
          message: null,
        },
      };
    default:
      return { ...state };
    case "SHOW_ERROR_TOAST":
      return {
        ...state,
        errorToast: {
          open: true,
          message: action.payload,
        },
      };
    case "HIDE_ERROR_TOAST":
      return {
        ...state,
        errorToast: {
          open: false,
          message: null,
        },
      };
  }
}

export const ToastProvider = (props) => {
  const [state, dispatch] = useReducer(toastReducer, initialState);

  const showSuccessToast = (message) =>
    dispatch({
      type: "SHOW_SUCCESS_TOAST",
      payload: message,
    });

  const hideSuccessToast = () =>
    dispatch({
      type: "HIDE_SUCCESS_TOAST",
    });

  const showErrorToast = (message) =>
    dispatch({
      type: "SHOW_ERROR_TOAST",
      payload: message,
    });

  const hideErrorToast = () =>
    dispatch({
      type: "HIDE_ERROR_TOAST",
    });

  const value = useMemo(
    () => ({
      ...state,
      showSuccessToast,
      hideSuccessToast,
      showErrorToast,
      hideErrorToast,
    }),
    [state]
  );

  return <ToastContext.Provider value={value} {...props} />;
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
