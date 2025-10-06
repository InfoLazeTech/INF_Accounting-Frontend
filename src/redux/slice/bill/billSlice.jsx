import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import billService from "./billService";
import { toast } from "react-toastify";

export const addBill = createAsyncThunk("bill/add", async (data, thunkAPI) => {
  try {
    return await billService.createBill(data);
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const getBills = createAsyncThunk(
  "bill/getAll",
  async (payload, thunkAPI) => {
    try {
      return await billService.getAllBills(payload);
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

export const getBillById = createAsyncThunk(
  "bill/getById",
  async (payload, thunkAPI) => {
    try {
      return await billService.getBillById(payload);
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

export const updateBill = createAsyncThunk(
  "bill/update",
  async ({ billId, data }, thunkAPI) => {
    try {
      return await billService.updateBill(billId, data);
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

export const deleteBill = createAsyncThunk(
  "bill/delete",
  async (billId, thunkAPI) => {
    try {
      return await billService.deleteBill(billId);
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

export const updateBillStatus = createAsyncThunk(
  "bill/updateStatus",
  async ({ billId, data }, thunkAPI) => {
    try {
      return await billService.updateBillStatus(billId, data);
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

export const recordPayment = createAsyncThunk(
  "bill/recordPayment",
  async ({ billId, data }, thunkAPI) => {
    try {
      return await billService.recordPayment(billId, data);
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

export const getBillSummary = createAsyncThunk(
  "bill/summary",
  async (payload, thunkAPI) => {
    try {
      return await billService.getBillSummary(payload);
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);
export const getOverdueBills = createAsyncThunk(
  "bill/overdue",
  async (payload, thunkAPI) => {
    try {
      return await billService.getOverdueBills(payload);
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
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
        state.message = action.payload?.message;
        toast.success(state.message);
      })
      .addCase(addBill.rejected, (state, action) => {
        state.postLoading = false;
        state.error = action.payload;
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
        state.error = action.payload;
        toast.error(state.error);
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
        state.error = action.payload;
        toast.error(state.error);
      })
      // Update Bill
      .addCase(updateBill.pending, (state) => {
        state.postLoading = true;
      })
      .addCase(updateBill.fulfilled, (state, action) => {
        state.postLoading = false;
        const index = state.bills.findIndex(
          (b) => b._id === action.payload.data._id
        );
        if (index !== -1) state.bills[index] = action.payload.data;
        state.message = action.payload?.message;
        toast.success(state.message);
      })
      .addCase(updateBill.rejected, (state, action) => {
        state.postLoading = false;
        state.error = action.payload;
        toast.error(state.error);
      })
      // Delete Bill
      .addCase(deleteBill.pending, (state) => {
        state.deleteLoading = true;
      })
      .addCase(deleteBill.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.bills = state.bills.filter((b) => b._id !== action.meta.arg);
        state.message = action.payload?.message;
        toast.success(state.message);
      })
      .addCase(deleteBill.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload;
        toast.error(state.error);
      })
      // Update Bill Status
      .addCase(updateBillStatus.pending, (state) => {
        state.postLoading = true;
      })
      .addCase(updateBillStatus.fulfilled, (state, action) => {
        state.postLoading = false;
        const index = state.bills.findIndex(
          (b) => b._id === action.payload.data._id
        );
        if (index !== -1) state.bills[index] = action.payload.data;
        state.message = action.payload?.message;
        toast.success(state.message);
      })
      .addCase(updateBillStatus.rejected, (state, action) => {
        state.postLoading = false;
        state.error = action.payload;
        toast.error(state.error);
      })
      // Record Payment
      .addCase(recordPayment.pending, (state) => {
        state.postLoading = true;
      })
      .addCase(recordPayment.fulfilled, (state, action) => {
        state.postLoading = false;
        const index = state.bills.findIndex(
          (b) => b._id === action.payload.data._id
        );
        if (index !== -1) state.bills[index] = action.payload.data;
        state.message = action.payload?.message;
        toast.success(state.message);
      })
      .addCase(recordPayment.rejected, (state, action) => {
        state.postLoading = false;
        state.error = action.payload;
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
        state.error = action.payload;
        toast.error(state.error);
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
        state.error = action.payload;
        toast.error(state.error);
      });
  },
});

export const { resetBill } = billSlice.actions;
export default billSlice.reducer;
