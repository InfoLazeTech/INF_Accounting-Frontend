// src/redux/slice/reports/vendorReportSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import reportService from "./reportService";
import { toast } from "react-toastify";

export const getVendorReports = createAsyncThunk(
  "vendorReport/getVendorReports",
  async (payload, thunkAPI) => {
    try {
      const response = await reportService.getPurchaseReport(payload);
      return response; 
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
    vendors: [],
    selectedVendorReport: null, // For /view/:vendorId
    summary: {
      totalVendors: 0,
      totalBills: 0,
      totalAmount: 0,
      totalPaid: 0,
      totalPending: 0,
      totalPaymentsMade: 0,
      netAmount: 0,
      averageBillAmount: 0,
    },
    loading: false,
    error: null,
    pagination: {
      current: 1,
      limit: 10,
      totalCount: 0,
    },
  },
  reducers: {
    resetVendorReport: (state) => {
      state.vendors = [];
      state.selectedVendorReport = null;
      state.summary = {
        totalVendors: 0,
        totalBills: 0,
        totalAmount: 0,
        totalPaid: 0,
        totalPending: 0,
        totalPaymentsMade: 0,
        netAmount: 0,
        averageBillAmount: 0,
      };
      state.pagination = { current: 1, limit: 10, totalCount: 0 };
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
        const { data } = action.payload;
        const { vendorId } = action.meta.arg || {};
        if (!vendorId) {
          state.vendors = data.vendors || [];

          const s = data.summary || {};
          state.summary = {
            totalVendors: s.totalVendors || 0,
            totalBills: s.totalBills || 0,
            totalAmount: s.totalAmount || 0,
            totalPaid: s.totalPaid || 0,
            totalPending: s.totalPending || 0,
            totalPaymentsMade: s.totalPaymentsMade || 0,
            netAmount: s.netAmount || 0,
            averageBillAmount: s.averageBillAmount || 0,
          };

          const { page = 1, limit = 10 } = action.meta.arg || {};
          state.pagination = {
            current: parseInt(page),
            limit: parseInt(limit),
            totalCount: data.vendors?.length || 0,
          };

          state.selectedVendorReport = null; 
        }
        else {
          const vendor = data.vendors?.[0];
          if (!vendor) {
            state.selectedVendorReport = null;
            state.vendors = [];
            return;
          }
          const bills = vendor.bills?.map((b) => ({
            key: b.billId,
            billNumber: b.billNumber,
            billDate: b.billDate,
            dueDate: b.dueDate,
            totalAmount: b.totalAmount,
            paidAmount: b.paidAmount,
            remainingAmount: b.remainingAmount,
            status: (b.paymentStatus || b.status || "draft").toLowerCase(),
          })) || [];
          const venSummary = vendor.summary || {};

          state.selectedVendorReport = {
            vendor: {
              _id: vendor.vendorId,
              companyName: vendor.vendorDetails?.companyName || vendor.vendorName || "Unknown",
              email: vendor.vendorDetails?.email || "",
              phone: vendor.vendorDetails?.phone || "",
              contactPerson: vendor.vendorDetails?.contactPerson || "",
            },
            bills,
            payments: vendor.payments || [],
            summary: {
              totalBillAmount: venSummary.totalBillAmount || 0,
              totalPaidAmount: venSummary.totalPaidAmount || 0,
              totalRemainingAmount: venSummary.totalRemainingAmount || 0,
              totalPaymentAmount: venSummary.totalPaymentAmount || 0,
              netAmountDue: venSummary.netAmountDue || 0,
            },
          };
          state.vendors = [vendor];
        }
      })

      .addCase(getVendorReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.vendors = [];
        state.selectedVendorReport = null;
      });
  },
});

export const { resetVendorReport } = vendorReportSlice.actions;
export default vendorReportSlice.reducer;