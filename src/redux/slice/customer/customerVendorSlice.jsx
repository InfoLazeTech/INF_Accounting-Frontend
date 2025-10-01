
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import customerVendorService from "./customerService";


// Add
export const addCustomerVendor = createAsyncThunk(
  "customerVendor/add",
  async (data, thunkAPI) => {
    try {
      return await customerVendorService.createCustomerVendor(data);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Get All
export const getCustomersVendors = createAsyncThunk(
  "customerVendor/getAll",
  async (_, thunkAPI) => {
    try {
      return await customerVendorService.getAllCustomerVendors();
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
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
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Update
export const updateCustomerVendor = createAsyncThunk(
  "customerVendor/update",
  async ({ id, data }, thunkAPI) => {
    try {
      return await customerVendorService.updateCustomerVendor(id, data);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
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
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const customerVendorSlice = createSlice({
  name: "customerVendor",
  initialState: {
    customers: [],
    customer: null,
    loading: false,
    postLoading: false,
    error: null,
  },
  reducers: {
    resetCustomerVendor: (state) => {
      state.customers = [];
      state.customer = null;
      state.loading = false;
      state.error = null;
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
      })
      .addCase(addCustomerVendor.rejected, (state, action) => {
        state.postLoading = false;
        state.error = action.payload;
      })

      // Get All
      .addCase(getCustomersVendors.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCustomersVendors.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = action.payload.data;
      })
      .addCase(getCustomersVendors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get By ID
      .addCase(getCustomerVendorById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCustomerVendorById.fulfilled, (state, action) => {
        state.loading = false;
        state.customer = action.payload.data;
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
        const index = state.customers.findIndex((c) => c._id === action.payload._id);
        if (index !== -1) state.customers[index] = action.payload;
      })
      .addCase(updateCustomerVendor.rejected, (state, action) => {
        state.postLoading = false;
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteCustomerVendor.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteCustomerVendor.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = state.customers.filter((c) => c._id !== action.meta.arg);
      })
      .addCase(deleteCustomerVendor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetCustomerVendor } = customerVendorSlice.actions;
export default customerVendorSlice.reducer;
