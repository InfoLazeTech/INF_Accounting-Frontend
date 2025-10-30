import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import paymentMadeService from "../paymentMade/paymentMadeService";

import { toast } from "react-toastify";

// Async Thunks
export const createPaymentMade = createAsyncThunk(
  "paymentMade/createPaymentMade",
  async (paymentData) => {
    try {
      const response = await paymentMadeService.createPaymentMade(paymentData);
      return response;
    } catch (error) {
      throw error?.response?.data?.error?.message || error?.message || "Something went wrong";
    }
  }
);
export const getAllPaymentMade = createAsyncThunk(
  "paymentMade/getAllPaymentMade",
  async (payload) => {
    try {
      const response = await paymentMadeService.getAllPaymentMade(payload);
      return response;
    } catch (error) {
      throw error?.response?.data?.error?.message || error?.message || "Something went wrong";
    }
  }
);

export const getPaymentMadeById = createAsyncThunk(
  "paymentMade/getPaymentMadeById",
  async ({ paymentId, companyId }) => {
    try {
      const response = await paymentMadeService.getPaymentMadeById(
        paymentId,
        companyId
      );
      return response;
    } catch (error) {
      throw error?.response?.data?.error?.message || error?.message || "Something went wrong";
    }
  }
);

export const updatePaymentMade = createAsyncThunk(
  "paymentMade/updatePaymentMade",
  async ({ paymentId, paymentData }) => {
    try {
      const response = await paymentMadeService.updatePaymentMade(
        paymentId,
        paymentData
      );
      return response;
    } catch (error) {
      throw error?.response?.data?.error?.message || error?.message || "Something went wrong";
    }
  }
);

export const deletePaymentMade = createAsyncThunk(
  "paymentMade/deletePaymentMade",
  async (paymentId) => {
    try {
      const response = await paymentMadeService.deletePaymentMade(paymentId);
      return { paymentId, ...response };
    } catch (error) {
      throw error?.response?.data?.error?.message || error?.message || "Something went wrong";
    }
  }
);

export const getPaymentSummary = createAsyncThunk(
  "paymentMade/getPaymentSummary",
  async (payload) => {
    try {
      const response = await paymentMadeService.getPaymentSummary(payload);
      return response;
    } catch (error) {
      throw error?.response?.data?.error?.message || error?.message || "Something went wrong";
    }
  }
);

export const getPaymentsByParty = createAsyncThunk(
  "paymentMade/getPaymentsByParty",
  async (payload) => {
    try {
      const response = await paymentMadeService.getPaymentsByParty(payload);
      return response;
    } catch (error) {
      throw error?.response?.data?.error?.message || error?.message || "Something went wrong";
    }
  }
);

const initialState = {
  payments: [],
  payment: null,
  summary: null,
  partyPayments: [],
  loading: false,
  postLoading: false,
  error: null,
  message: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 10,
    hasNextPage: false,
    hasPrevPage: false,
  },
};

const paymentMadeSlice = createSlice({
  name: "paymentMade",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearPayments: (state) => {
      state.payments = [];
      state.payment = null;
      state.summary = null;
      state.partyPayments = [];
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPaymentMade.pending, (state) => {
        state.postLoading = true;
        state.error = null;
      })
      .addCase(createPaymentMade.fulfilled, (state, action) => {
        state.postLoading = false;
        // state.payments.push(action.payload.data);
        state.message = action.payload.message;
        toast.success(state.message);
      })
      .addCase(createPaymentMade.rejected, (state, action) => {
        state.postLoading = false;
        state.error = action.error.message;
        toast.error(state.error);
      })
      .addCase(getAllPaymentMade.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllPaymentMade.fulfilled, (state, action) => {
        state.loading = false;
        state.payments = action.payload.data || [];
        state.pagination = action.payload.extras || initialState.pagination;
        state.error = null;
      })
      .addCase(getAllPaymentMade.rejected, (state, action) => {
        state.loading = false;
        state.payments = [];
      })
      .addCase(getPaymentMadeById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPaymentMadeById.fulfilled, (state, action) => {
        state.loading = false;
        state.payment = action.payload.data;
        state.error = null;
      })
      .addCase(getPaymentMadeById.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(updatePaymentMade.pending, (state) => {
        state.postLoading = true;
        state.error = null;
      })
      .addCase(updatePaymentMade.fulfilled, (state, action) => {
        state.postLoading = false;
        state.payment = action.payload.data;
        state.message = action.payload.message;
        toast.success(state.message);
      })
      .addCase(updatePaymentMade.rejected, (state, action) => {
        state.postLoading = false;
        sstate.error = action.error.message;
        toast.error(state.error);
      })
      .addCase(deletePaymentMade.pending, (state) => {
        state.postLoading = true;
        state.error = null;
      })
      .addCase(deletePaymentMade.fulfilled, (state, action) => {
        state.postLoading = false;
        state.message = action.payload.message;
        toast.success(state.message);
      })
      .addCase(deletePaymentMade.rejected, (state, action) => {
        state.postLoading = false;
        state.error = action.error.message;
        toast.error(state.error);
      })
      .addCase(getPaymentSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPaymentSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload.data;
        state.error = null;
      })
      .addCase(getPaymentSummary.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(getPaymentsByParty.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPaymentsByParty.fulfilled, (state, action) => {
        state.loading = false;
        state.partyPayments = action.payload.data || [];
        state.error = null;
      })
      .addCase(getPaymentsByParty.rejected, (state, action) => {
        state.loading = false;
        state.partyPayments = [];
      });
  },
});

export const { clearError, clearPayments, setPagination } =
  paymentMadeSlice.actions;
export default paymentMadeSlice.reducer;
