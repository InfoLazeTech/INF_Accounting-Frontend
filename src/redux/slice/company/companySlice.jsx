import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import companyService from "./companyService";
import { toast } from "react-toastify";

// Get company
export const getCompany = createAsyncThunk(
  "company/get",
  async (companyId) => {
    try {
      const response = await companyService.getCompany(companyId);
      return response;
    } catch (error) {
      throw error?.response?.data?.error?.message || error?.message || "Something went wrong";
    }
  }
);

// Update company
export const updateCompany = createAsyncThunk(
  "company/update",
  async ({ companyId, data }) => {
    try {
      const response = await companyService.updateCompany(companyId, data);
      return response;
    } catch (error) {
      throw error?.response?.data?.error?.message || error?.message || "Something went wrong";
    }
  }
);

const companySlice = createSlice({
  name: "company",
  initialState: {
    companyData: null,
    loading: false,
    postLoading: false,
    error: null,
  },
  reducers: {
    resetCompany: (state) => {
      state.data = null;
      state.loading = false;
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCompany.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.companyData = action.payload.data;
      })
      .addCase(getCompany.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(updateCompany.pending, (state) => {
        state.postLoading = true;
      })
      .addCase(updateCompany.fulfilled, (state, action) => {
        state.postLoading = false;
        state.message = action.payload.message;
        toast.success(state.message);
      })
      .addCase(updateCompany.rejected, (state, action) => {
        state.postLoading = false;
        state.error = action.error.message;
        toast.error(state.error);
      });
  },
});

export const { resetCompany } = companySlice.actions;
export default companySlice.reducer;
