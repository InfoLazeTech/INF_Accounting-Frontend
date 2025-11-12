import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import accountService from "./accountService";
import { toast } from "react-toastify";

// Add
export const addAccount = createAsyncThunk(
  "account/add",
  async (data, thunkAPI) => {
    try {
      return await accountService.createAccount(data);
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

// Get All
export const getAccounts = createAsyncThunk(
  "account/getAll",
  async (payload, thunkAPI) => {
    try {
      return await accountService.getAllAccount(payload);
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);
export const updateAccount = createAsyncThunk(
  "account/update",
  async ({ accountId, data }, thunkAPI) => {
    try {
      return await accountService.updateAccount({ accountId, data });
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

export const removeAccount = createAsyncThunk(
  "account/delete",
  async (accountId, thunkAPI) => {
    try {
      await accountService.deleteAccount(accountId);
      return accountId;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

const accountSlice = createSlice({
  name: "account",
  initialState: {
    accounts: [],
    pagination: {
      totalPages: 1,
      totalCount: 0,
      limit: 10,
      currentPage: 1,
    },
    account: null,
    loading: false,
    postLoading: false,
    updateLoading: false,
    deleteLoading: false,
    error: null,
    message: null,
  },
  reducers: {
    resetitem: (state) => {
      state.accounts = [];
      state.account = null;
      state.loading = false;
      state.error = null;
      state.message = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Add
      .addCase(addAccount.pending, (state) => {
        state.postLoading = true;
      })
      .addCase(addAccount.fulfilled, (state, action) => {
        state.postLoading = false;
        state.accounts.push(action.payload.data);
        state.message = action.payload?.message;
        toast.success(state.message);
      })
      .addCase(addAccount.rejected, (state, action) => {
        state.postLoading = false;
        state.error = action.error.message;
        toast.error(state.error);
      })

      // Get All
      .addCase(getAccounts.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAccounts.fulfilled, (state, action) => {
        state.loading = false;
        state.accounts = action.payload.data;
        state.pagination = {
          currentPage: action.payload.extras.pagination.currentPage,
          totalPages: action.payload.extras.pagination.totalPages,
          limit: action.payload.extras.pagination.limit,
          totalCount: action.payload.extras.pagination.totalCount,
        };
      })
      .addCase(getAccounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(state.error);
      })

      .addCase(updateAccount.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(updateAccount.fulfilled, (state, action) => {
        state.updateLoading = false;
        const updated = action.payload.data;
        state.accounts = state.accounts.map((acc) =>
          acc._id === updated._id ? updated : acc
        );
        if (state.account?._id === updated._id) {
          state.account = updated;
        }
        state.message = action.payload.message;
        toast.success(state.message);
      })
      .addCase(updateAccount.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload;
        toast.error(state.error);
      })
      .addCase(removeAccount.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
      })
      .addCase(removeAccount.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.accounts = state.accounts.filter(
          (acc) => acc._id !== action.payload
        );
        toast.success("Account deleted successfully");
      })
      .addCase(removeAccount.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload;
        toast.error(state.error);
      });
  },
});

export const { resetitem } = accountSlice.actions;
export default accountSlice.reducer;
