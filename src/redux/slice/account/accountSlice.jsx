import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import accountService from "./accountService";
import { toast } from "react-toastify";

// Add
export const addAccount = createAsyncThunk("account/add", async (data, thunkAPI) => {
  try {
    return await accountService.createAccount(data);
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

// Get All
export const getAccounts= createAsyncThunk(
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
    deleteLoading: false,
    error: null,
  },
  reducers: {
    resetitem: (state) => {
      state.accounts = [];
      state.account = null;
      state.loading = false;
      state.error = null;
      state.message = null;
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
  },
});

export const { resetitem } = accountSlice.actions;
export default accountSlice.reducer;
