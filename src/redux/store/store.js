import { combineReducers, configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import persistReducer from "redux-persist/es/persistReducer";
import persistStore from "redux-persist/es/persistStore";
import authReducer from "../slice/auth/authSlice";
import customerVendorReducer from "../slice/customer/customerVendorSlice";
import companyReducer from "../slice/company/companySlice";
import categoryReducer from "../slice/category/categorySlice";
import itemReducer from '../slice/item/itemSlice'
import billReducer from '../slice/bill/billSlice'
import invoiceReducer from '../slice/invoice/invoiceSlice'
import paymentReceivedReducer from '../slice/paymentreceived/paymentReceivedSlice'
import paymentMadeReducer from '../slice/paymentMade/paymentMadeSlice'
import customerReportReducer from "../slice/reports/customerReportSlice";
import vendorReportReducer from "../slice/reports/vendorReportSlice"; 
import itemReportReducer from "../slice/reports/itemReportsSlice";
import bankReducer from "../slice/bank/bankSlice";
import accountReducer from '../slice/account/accountSlice'

const appReducer = combineReducers({
  auth: authReducer,
  customerVendor: customerVendorReducer,
  company: companyReducer,
    item: itemReducer,
    category:categoryReducer,
    bill: billReducer,
    invoice:invoiceReducer,
    paymentReceived: paymentReceivedReducer,
    paymentMade: paymentMadeReducer,
    customerReport: customerReportReducer,
    vendorReport: vendorReportReducer,
    itemReport: itemReportReducer,
    bank: bankReducer,

    account:accountReducer

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