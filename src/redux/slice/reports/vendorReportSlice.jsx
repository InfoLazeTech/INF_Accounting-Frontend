// src/redux/slice/report/vendorReportSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import reportService from "./reportService";
import { toast } from "react-toastify";

export const getVendorReports = createAsyncThunk(
  "vendorReport/getVendorReports",
  async (payload, thunkAPI) => {
    try {
      const reportResponse = await reportService.getPurchaseReport(payload);
      const summaryResponse = await reportService.getPurchaseSummary(payload);
      return {
        ...reportResponse,
        summary: summaryResponse.data,
      };
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const vendorReportSlice = createSlice({
  name: "vendorReport",
  initialState: {
    reports: [],
    summary: {},
    loading: false,
    error: null,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      limit: 10,
      totalCount: 0,
    },
  },
  reducers: {
    resetVendorReport: (state) => {
      state.reports = [];
      state.summary = {};
      state.pagination = {
        currentPage: 1,
        totalPages: 1,
        limit: 10,
        totalCount: 0,
      };
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getVendorReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getVendorReports.fulfilled, (state, action) => {
        state.loading = false;
        state.reports = action.payload.data?.bills || [];
        state.summary = action.payload.summary || {};
        state.pagination = {
          currentPage: action.payload.extras?.currentPage || 1,
          totalPages: action.payload.extras?.totalPages || 1,
          limit: action.payload.extras?.limit || 10,
          totalCount: action.payload.extras?.totalCount || 0,
        };
      })
      .addCase(getVendorReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetVendorReport } = vendorReportSlice.actions;
export default vendorReportSlice.reducer;