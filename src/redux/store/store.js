import { combineReducers, configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import persistReducer from "redux-persist/es/persistReducer";
import persistStore from "redux-persist/es/persistStore";
import authReducer from "../slice/auth/authSlice";

const appReducer = combineReducers({
    auth: authReducer,
});

// Root reducer that can handle resetting all slices
const rootReducer = (state, action) => {
  if (action.type === "auth/logout") {
    // Reset all slices to initial state except auth (which will be handled by the auth slice itself)
    const { auth } = state;
    return appReducer({ auth }, action);
  }
  return appReducer(state, action);
};

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);