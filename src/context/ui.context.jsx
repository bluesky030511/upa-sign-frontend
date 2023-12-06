import React, {
  useContext,
  createContext,
  useReducer,
  useMemo,
  useState,
  useEffect,
} from "react";
import { Loader } from "../shared-components/loader/loader";
import { getUserToken } from "../utils/token-manager";
import { useGetProfile } from "../hooks/user-hook";
import { ToastProvider } from "./toast.context";
import PageLoader from "../shared-components/loader/page-loader";
import { SubscriptionProvider } from "./subscription.context";

const initialState = {
  user: {
    loggedIn: false,
    isAgent: false,
    isShadow: false,
  },
  authModal: false,
  successToast: {
    open: false,
    message: null,
  },
};

export const UIContext = createContext(initialState);

UIContext.displayName = "UIContext";

function uiReducer(state, action) {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        user: {
          ...action.payload,
        },
      };
    case "CLEAR_USER":
      return initialState;
    case "OPEN_AUTH_MODAL":
      return {
        ...state,
        authModal: true,
      };
    case "CLOSE_AUTH_MODAL":
      return {
        ...state,
        authModal: false,
      };
    default:
      return {
        ...state,
      };
  }
}

export const UIProvider = (props) => {
  const [state, dispatch] = useReducer(uiReducer, initialState);
  const [initialUser, setInitialUser] = useState({});
  const [loading, setLoading] = useState(true);
  const setUser = (user) => dispatch({ type: "SET_USER", payload: user });
  const removeUser = () => dispatch({ type: "CLEAR_USER" });
  const openAuthModal = () => {
    dispatch({ type: "OPEN_AUTH_MODAL" });
  };
  const closeAuthModal = () => {
    dispatch({ type: "CLOSE_AUTH_MODAL" });
  };

  const onSuccess = (data) => {
    setUser({
      ...data,
      loggedIn: true,
      isAgent: data.role === "ADMIN" || data.role === "AGENT",
      isShadow: false,
    });
  };

  const onError = (error) => {
    if (error) {
      if (error.response) {
        // eslint-disable-next-line
        if (error.response.status == 401) {
          openAuthModal();
        }
      }
    }
  };
  const { isLoading } = useGetProfile({
    id: initialUser ? initialUser.id : null,
    onSuccess,
    onError,
  });

  const checkUserLoggedIn = () => {
    try {
      var res = getUserToken();
      if (res) {
        setUser({
          ...res,
          loggedIn: true,
          isAgent: res.role === "ADMIN" || res.role === "AGENT",
          isShadow: false,
        });
        setInitialUser(res);
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (e) {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      setUser,
      removeUser,
      openAuthModal,
      closeAuthModal,
    }),
    [state]
  );
  return loading || isLoading ? (
    <PageLoader>
      <Loader size={64} />
    </PageLoader>
  ) : (
    <UIContext.Provider value={value} {...props} />
  );
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error("useUI must be used within a UIProvider");
  }
  return context;
};

export const ManagedUIContext = ({ children }) => {
  return (
    <ToastProvider>
      <SubscriptionProvider>
        <UIProvider>{children}</UIProvider>
      </SubscriptionProvider>
    </ToastProvider>
  );
};
