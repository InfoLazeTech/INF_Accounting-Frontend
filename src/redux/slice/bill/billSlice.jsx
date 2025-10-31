import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import billService from "./billService";
import { toast } from "react-toastify";

export const addBill = createAsyncThunk("bill/add", async (data) => {
  try {
    const response = await billService.createBill(data);
    return response;
  } catch (error) {
    throw error?.response?.data?.error?.message || error?.message || "Something went wrong";
  }
});

export const getBills = createAsyncThunk(
  "bill/getAll",
  async (payload, thunkAPI) => {
    try {
      const response = await billService.getAllBills(payload);
      return response;
    } catch (error) {
      throw error?.response?.data?.error?.message || error?.message || "Something went wrong";
    }
  }
);

export const getBillById = createAsyncThunk(
  "bill/getById",
  async (payload, thunkAPI) => {
    try {
      const response = await billService.getBillById(payload);
      return response;
    } catch (error) {
      throw error?.response?.data?.error?.message || error?.message || "Something went wrong";
    }
  }
);

export const updateBill = createAsyncThunk(
  "bill/update",
  async ({ billId, data }, thunkAPI) => {
    try {
      const response = await billService.updateBill(billId, data);
      return response;
    } catch (error) {
      throw error?.response?.data?.error?.message || error?.message || "Something went wrong";
    }
  }
);

export const deleteBill = createAsyncThunk(
  "bill/delete",
  async (billId, thunkAPI) => {
    try {
      const response = await billService.deleteBill(billId);
      return response;
    } catch (error) {
      throw error?.response?.data?.error?.message || error?.message || "Something went wrong";
    }
  }
);

export const updateBillStatus = createAsyncThunk(
  "bill/updateStatus",
  async ({ billId, data }, thunkAPI) => {
    try {
      const response = await billService.updateBillStatus(billId, data);
      return response;
    } catch (error) {
      throw error?.response?.data?.error?.message || error?.message || "Something went wrong";
    }
  }
);

export const recordPayment = createAsyncThunk(
  "bill/recordPayment",
  async ({ billId, data }, thunkAPI) => {
    try {
      const response = await billService.recordPayment(billId, data);
      return response;
    } catch (error) {
      throw error?.response?.data?.error?.message || error?.message || "Something went wrong";
    }
  }
);

export const getBillSummary = createAsyncThunk(
  "bill/summary",
  async (payload, thunkAPI) => {
    try {
      const response = await billService.getBillSummary(payload);
      return response;
    } catch (error) {
      throw error?.response?.data?.error?.message || error?.message || "Something went wrong";
    }
  }
);
export const getOverdueBills = createAsyncThunk(
  "bill/overdue",
  async (payload, thunkAPI) => {
    try {
      const response = await billService.getOverdueBills(payload);
      return response;
    } catch (error) {
      throw error?.response?.data?.error?.message || error?.message || "Something went wrong";
    }
  }
);

const billSlice = createSlice({
  name: "bill",
  initialState: {
    bills: [],
    pagination: {
      totalPages: 1,
      totalCount: 0,
      limit: 10,
      currentPage: 1,
    },
    bill: null,
    summary: null,
    overdueBills: [],
    loading: false,
    postLoading: false,
    deleteLoading: false,
    error: null,
    message: null,
  },
  reducers: {
    resetBill: (state) => {
      state.bills = [];
      state.bill = null;
      state.summary = null;
      state.overdueBills = [];
      state.loading = false;
      state.postLoading = false;
      state.deleteLoading = false;
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Add Bill
      .addCase(addBill.pending, (state) => {
        state.postLoading = true;
      })
      .addCase(addBill.fulfilled, (state, action) => {
        state.postLoading = false;
        state.bills.push(action.payload.data);
        state.message = action.payload.message;
        toast.success(state.message);
      })
      .addCase(addBill.rejected, (state, action) => {
        state.postLoading = false;
        state.error = action.error.message;
        toast.error(state.error);
      })
      // Get All Bills
      .addCase(getBills.pending, (state) => {
        state.loading = true;
      })
      .addCase(getBills.fulfilled, (state, action) => {
        state.loading = false;
        state.bills = action.payload.data;
        state.pagination = {
          currentPage: action.payload.extras?.pagination?.currentPage || 1,
          totalPages: action.payload.extras?.pagination?.totalPages || 1,
          limit: action.payload.extras?.pagination?.limit || 10,
          totalCount: action.payload.extras?.pagination?.totalCount || 0,
        };
      })
      .addCase(getBills.rejected, (state, action) => {
        state.loading = false;
      })

      .addCase(getBillById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getBillById.fulfilled, (state, action) => {
        state.loading = false;
        state.bill = action.payload.data;
      })
      .addCase(getBillById.rejected, (state, action) => {
        state.loading = false;
      })
      // Update Bill
      .addCase(updateBill.pending, (state) => {
        state.postLoading = true;
      })
      .addCase(updateBill.fulfilled, (state, action) => {
        state.postLoading = false;
        state.message = action.payload.message;
        toast.success(state.message);
      })
      .addCase(updateBill.rejected, (state, action) => {
        state.postLoading = false;
        state.error = action.error.message;
        toast.error(state.error);
      })
      // Delete Bill
      .addCase(deleteBill.pending, (state) => {
        state.deleteLoading = true;
      })
      .addCase(deleteBill.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.message = action.payload.message;
        toast.success(state.message);
      })
      .addCase(deleteBill.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.error.message;
        toast.error(state.error);
      })
      // Update Bill Status
      .addCase(updateBillStatus.pending, (state) => {
        state.postLoading = true;
      })
      .addCase(updateBillStatus.fulfilled, (state, action) => {
        state.postLoading = false;
        state.message = action.payload.message;
        toast.success(state.message);
      })
      .addCase(updateBillStatus.rejected, (state, action) => {
        state.postLoading = false;
        state.error = action.error.message;
        toast.error(state.error);
      })
      // Record Payment
      .addCase(recordPayment.pending, (state) => {
        state.postLoading = true;
      })
      .addCase(recordPayment.fulfilled, (state, action) => {
        state.postLoading = false;
        state.message = action.payload.message;
        toast.success(state.message);
      })
      .addCase(recordPayment.rejected, (state, action) => {
        state.postLoading = false;
        state.error = action.error.message;
        toast.error(state.error);
      })
      // Get Bill Summary
      .addCase(getBillSummary.pending, (state) => {
        state.loading = true;
      })
      .addCase(getBillSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload.data;
      })
      .addCase(getBillSummary.rejected, (state, action) => {
        state.loading = false;
      })
      // Get Overdue Bills
      .addCase(getOverdueBills.pending, (state) => {
        state.loading = true;
      })
      .addCase(getOverdueBills.fulfilled, (state, action) => {
        state.loading = false;
        state.overdueBills = action.payload.data;
      })
      .addCase(getOverdueBills.rejected, (state, action) => {
        state.loading = false;
      });
  },
});

export const { resetBill } = billSlice.actions;
export default billSlice.reducer;
