import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import customerVendorService from "./customerService";
import { toast } from "react-toastify";

// Add
export const addCustomerVendor = createAsyncThunk(
  "customerVendor/add",
  async (data) => {
    try {
      const response = await customerVendorService.createCustomerVendor(data);
      return response;
    } catch (error) {
      throw error?.response?.data?.error?.message || error?.message || "Something went wrong";
    }
  }
);

// Get All
export const getCustomersVendors = createAsyncThunk(
  "customerVendor/getAll",
  async (paylod) => {
    try {
      const response = await customerVendorService.getAllCustomerVendors(paylod);
      return response;
    } catch (error) {
      throw error?.response?.data?.error?.message || error?.message || "Something went wrong";
    }
  }
);

// Get By ID
export const getCustomerVendorById = createAsyncThunk(
  "customerVendor/getById",
  async (id) => {
    try {
      const response = await customerVendorService.getCustomerVendorById(id);
      return response;
    } catch (error) {
      throw error?.response?.data?.error?.message || error?.message || "Something went wrong";
    }
  }
);

// Update
export const updateCustomerVendor = createAsyncThunk(
  "customerVendor/update",
  async ({ customerId, data }) => {
    try {
      const response = await customerVendorService.updateCustomerVendor(customerId, data);
      return response;
    } catch (err) {
      retur.rejectWithValue(
        err.response?.data?.message || err?.message
      );
    }
  }
);

// Delete
export const deleteCustomerVendor = createAsyncThunk(
  "customerVendor/delete",
  async (id) => {
    try {
      const response = await customerVendorService.deleteCustomerVendor(id);
      return response;
    } catch (error) {
      throw error?.response?.data?.error?.message || error?.message || "Something went wrong";
    }
  }
);

export const getCustomerDropdown = createAsyncThunk(
  "customerVendor/getCustomerDropdown",
  async (payload) => {
    try {
      const response = await customerVendorService.getCustomerDropdown(
        payload
      );
      return response;
    } catch (error) {
      throw error?.response?.data?.error?.message || error?.message || "Something went wrong";
    }
  }
);

export const getVendorDropdown = createAsyncThunk(
  "customerVendor/getVendorDropdown",
  async (payload) => {
    try {
      const response = await customerVendorService.getVendorDropdown(
        payload
      );
      return response;
    } catch (error) {
      throw error?.response?.data?.error?.message || error?.message || "Something went wrong";
    }
  }
);

const customerVendorSlice = createSlice({
  name: "customerVendor",
  initialState: {
    customers: [],
    dropdownCustomers: [],
    dropdownVendors: [],
    pagination: {
      totalPages: 1,
      totalCount: 0,
      limit: 10,
      currentPage: 1,
    },
    customer: null,
    loading: false,
    dropLoading: false,
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
      .addCase(addCustomerVendor.pending, (state) => {
        state.postLoading = true;
      })
      .addCase(addCustomerVendor.fulfilled, (state, action) => {
        state.postLoading = false;
        // state.customers.push(action.payload);
        state.message = action.payload.message;
        toast.success(state.message);
      })
      .addCase(addCustomerVendor.rejected, (state, action) => {
        state.postLoading = false;
        state.error = action.error.message;
        toast.error(state.error);
      })
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
      })
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
      })
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
        toast.success(action.payload.message);
      })
      .addCase(updateCustomerVendor.rejected, (state, action) => {
        state.postLoading = false;
        state.error = action.error.message;
        toast.error(state.error);
      })
      .addCase(deleteCustomerVendor.pending, (state) => {
        state.deleteLoading = true;
      })
      .addCase(deleteCustomerVendor.fulfilled, (state, action) => {
        state.deleteLoading = false;
        // state.customers = state.customers.filter(
        //   (c) => c._id !== action.meta.arg
        // );
        state.message = action.payload.message;
        toast.success(state.message);
      })
      .addCase(deleteCustomerVendor.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.error.message;
        toast.error(state.error);
      })
      .addCase(getCustomerDropdown.pending, (state) => {
        state.dropLoading = true;
      })
      .addCase(getCustomerDropdown.fulfilled, (state, action) => {
        state.dropLoading = false;
        state.dropdownCustomers = action.payload.data.customers;
        state.error = null;
      })
      .addCase(getCustomerDropdown.rejected, (state, action) => {
        state.dropLoading = false;
        state.dropdownCustomers = [];
      })
      .addCase(getVendorDropdown.pending, (state) => {
        state.dropLoading = true;
      })
      .addCase(getVendorDropdown.fulfilled, (state, action) => {
        state.dropLoading = false;
        state.dropdownVendors = action.payload.data.customers;
        state.error = null;
      })
      .addCase(getVendorDropdown.rejected, (state, action) => {
        state.dropLoading = false;
        state.dropdownVendors = [];
      });
  },
});

export const { resetCustomerVendor } = customerVendorSlice.actions;
export default customerVendorSlice.reducer;
