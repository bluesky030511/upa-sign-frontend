import React, { useContext, createContext, useReducer, useMemo } from "react";
import { useGetSubscription } from "../hooks/user-hook";

const initialState = {
  subscription: "UNPAID",
  plan: null,
};

const SubscriptionContext = createContext(initialState);

function subscriptionReducer(state, action) {
  switch (action.type) {
    case "SET_SUBSCRIPTION":
      return {
        ...state,
        subscription: action.payload,
      };
    case "SET_PLAN":
      return {
        ...state,
        plan: action.payload,
      };
    default:
      return { ...state };
  }
}

export const SubscriptionProvider = (props) => {
  const [state, dispatch] = useReducer(subscriptionReducer, initialState);

  const setSubscription = (status) =>
    dispatch({ type: "SET_SUBSCRIPTION", payload: status });

  const setPlan = (plan) => dispatch({ type: "SET_PLAN", payload: plan });

  const subscriptionError = (error) => {
    if (error) {
      if (error.response) {
        // eslint-disable-next-line
        if (error.response.status == 404) {
          setSubscription("UNPAID");
        }
        // eslint-disable-next-line
        if (error.response.status == 400) {
          setSubscription("EXPIRED");
        }
      }
    }
  };

  const subscriptionSuccess = (data) => {
    setSubscription("SUBSCRIBED");
    setPlan(data.subscriptionPlan);
  };
  // eslint-disable-next-line
  useGetSubscription({
    subscriptionSuccess,
    subscriptionError,
  });

  const value = useMemo(
    () => ({
      ...state,
      setSubscription,
      setPlan,
      subscriptionSuccess,
      subscriptionError,
    }),
    [state]
  );

  return <SubscriptionContext.Provider value={value} {...props} />;
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
