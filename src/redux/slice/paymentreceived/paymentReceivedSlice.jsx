import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import paymentReceivedService from "../paymentreceived/paymentReceivedService";

import { toast } from "react-toastify";

// Async Thunks
export const createPaymentReceived = createAsyncThunk(
  "paymentReceived/createPaymentReceived",
  async (paymentData, { rejectWithValue }) => {
    try {
      const response = await paymentReceivedService.createPaymentReceived(
        paymentData
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
export const getAllPaymentReceived = createAsyncThunk(
  "paymentReceived/getAllPaymentReceived",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await paymentReceivedService.getAllPaymentReceived(
        payload
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getPaymentReceivedById = createAsyncThunk(
  "paymentReceived/getPaymentReceivedById",
  async ({ paymentId, companyId }, { rejectWithValue }) => {
    try {
      const response = await paymentReceivedService.getPaymentReceivedById(
        paymentId,
        companyId
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updatePaymentReceived = createAsyncThunk(
  "paymentReceived/updatePaymentReceived",
  async ({ paymentId, paymentData }, { rejectWithValue }) => {
    try {
      const response = await paymentReceivedService.updatePaymentReceived(
        paymentId,
        paymentData
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deletePaymentReceived = createAsyncThunk(
  "paymentReceived/deletePaymentReceived",
  async (paymentId, { rejectWithValue }) => {
    try {
      const response = await paymentReceivedService.deletePaymentReceived(
        paymentId
      );
      return { paymentId, ...response };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getPaymentSummary = createAsyncThunk(
  "paymentReceived/getPaymentSummary",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await paymentReceivedService.getPaymentSummary(payload);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getPaymentsByParty = createAsyncThunk(
  "paymentReceived/getPaymentsByParty",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await paymentReceivedService.getPaymentsByParty(payload);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
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

const paymentReceivedSlice = createSlice({
  name: "paymentReceived",
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
    // CREATE
    builder
      .addCase(createPaymentReceived.pending, (state) => {
        state.postLoading = true;
        state.error = null;
      })
      .addCase(createPaymentReceived.fulfilled, (state, action) => {
        state.postLoading = false;
        state.payments.push(action.payload.data);
        state.message = action.payload?.message;
        toast.success(state.message);
      })
      .addCase(createPaymentReceived.rejected, (state, action) => {
        state.postLoading = false;
        state.error = action.payload?.message;
        toast.error(state.error);
      })

      // GET ALL
      .addCase(getAllPaymentReceived.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllPaymentReceived.fulfilled, (state, action) => {
        state.loading = false;
        state.payments = action.payload.data || [];
        state.pagination = action.payload.extras || initialState.pagination;
        state.error = null;
      })
      .addCase(getAllPaymentReceived.rejected, (state, action) => {
        state.loading = false;
        state.payments = [];
        state.error = action.payload?.message || "Failed to fetch payments";
      })

      // GET BY ID
      .addCase(getPaymentReceivedById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPaymentReceivedById.fulfilled, (state, action) => {
        state.loading = false;
        state.payment = action.payload.data;
        state.error = null;
      })
      .addCase(getPaymentReceivedById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch payment";
      })

      // UPDATE
      .addCase(updatePaymentReceived.pending, (state) => {
        state.postLoading = true;
        state.error = null;
      })
      .addCase(updatePaymentReceived.fulfilled, (state, action) => {
        state.postLoading = false;
        state.payment = action.payload.data;
        state.message = action.payload?.message;
        toast.success(state.message);
      })
      .addCase(updatePaymentReceived.rejected, (state, action) => {
        state.postLoading = false;
        state.error = action.payload?.message;
        toast.error(state.error);
      })

      // DELETE
      .addCase(deletePaymentReceived.pending, (state) => {
        state.postLoading = true;
        state.error = null;
      })
      .addCase(deletePaymentReceived.fulfilled, (state, action) => {
        state.postLoading = false;
        state.message = action.payload?.message;
        toast.success(state.message);
      })
      .addCase(deletePaymentReceived.rejected, (state, action) => {
        state.postLoading = false;
        state.error = action.payload?.message;
        toast.error(state.error);
      })

      // SUMMARY
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
        state.error = action.payload?.message || "Failed to fetch summary";
      })

      // PARTY PAYMENTS
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
        state.error =
          action.payload?.message || "Failed to fetch party payments";
      });
  },
});

export const { clearError, clearPayments, setPagination } =
  paymentReceivedSlice.actions;
export default paymentReceivedSlice.reducer;
