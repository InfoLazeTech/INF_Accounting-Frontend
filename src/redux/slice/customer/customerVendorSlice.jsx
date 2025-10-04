import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import customerVendorService from "./customerService";
import { toast } from "react-toastify";

// Add
export const addCustomerVendor = createAsyncThunk(
  "customerVendor/add",
  async (data, thunkAPI) => {
    try {
      return await customerVendorService.createCustomerVendor(data);
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

// Get All
export const getCustomersVendors = createAsyncThunk(
  "customerVendor/getAll",
  async (paylod, thunkAPI) => {
    try {
      return await customerVendorService.getAllCustomerVendors(paylod);
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

// Get By ID
export const getCustomerVendorById = createAsyncThunk(
  "customerVendor/getById",
  async (id, thunkAPI) => {
    try {
      return await customerVendorService.getCustomerVendorById(id);
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

// Update
export const updateCustomerVendor = createAsyncThunk(
  "customerVendor/update",
  async ({ customerId, data }, thunkAPI) => {
    try {
      return await customerVendorService.updateCustomerVendor(customerId, data);
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err?.message
      );
    }
  }
);

// Delete
export const deleteCustomerVendor = createAsyncThunk(
  "customerVendor/delete",
  async (id, thunkAPI) => {
    try {
      return await customerVendorService.deleteCustomerVendor(id);
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

const customerVendorSlice = createSlice({
  name: "customerVendor",
  initialState: {
    customers: [],
    pagination: {
      totalPages: 1,
      totalCount: 0,
      limit: 10,
      currentPage: 1,
    },
    customer: null,
    loading: false,
    postLoading: false,
    deleteLoading: false,
    error: null,
  },
  reducers: {
    resetCustomerVendor: (state) => {
      state.customers = [];
      state.customer = null;
      state.loading = false;
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Add
      .addCase(addCustomerVendor.pending, (state) => {
        state.postLoading = true;
      })
      .addCase(addCustomerVendor.fulfilled, (state, action) => {
        state.postLoading = false;
        state.customers.push(action.payload);
        state.message = action.payload?.message;
        toast.success(state.message);
      })
      .addCase(addCustomerVendor.rejected, (state, action) => {
        state.postLoading = false;
        state.error = action.payload.error.message;
        toast.error(state.error);
      })

      // Get All
      .addCase(getCustomersVendors.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCustomersVendors.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = action.payload.data;
        state.pagination = {
          currentPage: action.payload.extras.currentPage,
          totalPages: action.payload.extras.totalPages,
          limit: action.payload.extras.limit,
          totalCount: action.payload.extras.totalCount,
        };
      })
      .addCase(getCustomersVendors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(state.error);
      })

      // Get By ID
      .addCase(getCustomerVendorById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCustomerVendorById.fulfilled, (state, action) => {
        state.loading = false;
        state.customer = action.payload.data;
        toast.error(state.customer);
      })
      .addCase(getCustomerVendorById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update
      .addCase(updateCustomerVendor.pending, (state) => {
        state.postLoading = true;
      })
      .addCase(updateCustomerVendor.fulfilled, (state, action) => {
        state.postLoading = false;
        state.current = action.payload;
        // update customers list too
        const index = state.customers.findIndex(
          (c) => c._id === action.payload._id
        );
        if (index !== -1) state.customers[index] = action.payload;
        toast.success(action.payload?.message);
      })
      .addCase(updateCustomerVendor.rejected, (state, action) => {
        state.postLoading = false;
        state.error = action.payload.error.message;
        toast.error(state.error);
      })

      // Delete
      .addCase(deleteCustomerVendor.pending, (state) => {
        state.deleteLoading = true;
      })
      .addCase(deleteCustomerVendor.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.customers = state.customers.filter(
          (c) => c._id !== action.meta.arg
        );
        state.message = action.payload?.message;
        toast.success(state.message);
      })
      .addCase(deleteCustomerVendor.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload.error.message;
        toast.error(state.error);
      });
  },
});

export const { resetCustomerVendor } = customerVendorSlice.actions;
export default customerVendorSlice.reducer;
