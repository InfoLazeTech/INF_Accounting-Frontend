
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import companyService from "./companyService";

// Get company
export const getCompany = createAsyncThunk(
  "company/get",
  async (companyId, thunkAPI) => {
    try {
      return await companyService.getCompany(companyId);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Update company
export const updateCompany = createAsyncThunk(
  "company/update",
  async ({ companyId, data }, thunkAPI) => {
    try {
      return await companyService.updateCompany(companyId, data);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
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
        state.error = action.payload;
      })
      .addCase(updateCompany.pending, (state) => {
        state.postLoading = true;
      })
      .addCase(updateCompany.fulfilled, (state, action) => {
        state.postLoading = false;
        // state.data = action.payload.data; 
      })
      .addCase(updateCompany.rejected, (state, action) => {
        state.postLoading = false;
        state.error = action.payload;
      });
  },
});

export const { resetCompany } = companySlice.actions;
export default companySlice.reducer;
