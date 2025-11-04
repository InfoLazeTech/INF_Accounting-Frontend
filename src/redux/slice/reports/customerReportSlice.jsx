// src/redux/slice/report/customerReportSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import reportService from "./reportService";
import { toast } from "react-toastify";

export const getCustomerReports = createAsyncThunk(
  "customerReport/getCustomerReports",
  async (payload, thunkAPI) => {
    try {
      const response = await reportService.getSalesReport(payload);
      return response;
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Failed to fetch report";
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getCustomerSummary = createAsyncThunk(
  "customerReport/getCustomerSummary",
  async (payload, thunkAPI) => {
    try {
      const response = await reportService.getSalesSummary(payload);
      return response;
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Failed to fetch report";
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getDashboardData = createAsyncThunk(
  "customerReport/getDashboardData",
  async (payload, thunkAPI) => {
    try {
      const response = await reportService.getDashboard(payload);
      return response;
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Failed to fetch report";
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const customerReportSlice = createSlice({
  name: "customerReport",
  initialState: {
    reports: [],
    summary: [],
    dashboars: [],
    selectedCustomerReport: null,
    summary: {
      totalSales: 0,
      totalPaid: 0,
      totalDue: 0,
      totalInvoices: 0,
    },
    loading: false,
    error: null,
    pagination: { current: 1, limit: 10, totalCount: 0 },
  },
  reducers: {
    resetCustomerReport: (state) => {
      state.reports = [];
      state.selectedCustomerReport = null;
      state.summary = { totalSales: 0, totalPaid: 0, totalDue: 0, totalInvoices: 0 };
      state.pagination = { current: 1, limit: 10, totalCount: 0 };
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCustomerReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCustomerReports.fulfilled, (state, action) => {
        state.loading = false;
        const { data } = action.payload;
        const { customerId } = action.meta.arg || {};
        state.reports = action.payload.data;
        // ---- 1. Global list (no customerId) ----
        // if (!customerId) {
        //   const allInvoices = [];
        //   data.customers?.forEach((cust) => {
        //     cust.invoices?.forEach((inv) => {
        //       allInvoices.push({
        //         key: inv.invoiceId,
        //         invoiceNumber: inv.invoiceNumber,
        //         invoiceDate: inv.invoiceDate,
        //         total: inv.totalAmount,
        //         amountPaid: inv.paidAmount,
        //         status: (inv.paymentStatus || inv.status || "draft").toLowerCase(),
        //         customer: {
        //           _id: cust.customerId,
        //           companyName: cust.customerDetails?.companyName || cust.customerName || "Unknown",
        //         },
        //       });
        //     });
        //   });
        //   state.reports = allInvoices;

        //   const s = data.summary || {};
        //   state.summary = {
        //     totalSales: s.totalAmount || 0,
        //     totalPaid: s.totalPaid || 0,
        //     totalDue: s.totalPending || 0,
        //     totalInvoices: s.totalInvoices || 0,
        //   };
        // }

        // // ---- 2. Single-customer view (customerId present) ----
        // else {
        //   const customer = data.customers?.[0];
        //   if (!customer) {
        //     state.selectedCustomerReport = { invoices: [], summary: {} };
        //     return;
        //   }

        //   const invoices = customer.invoices?.map((inv) => ({
        //     key: inv.invoiceId,
        //     invoiceNumber: inv.invoiceNumber,
        //     invoiceDate: inv.invoiceDate,
        //     total: inv.totalAmount,
        //     amountPaid: inv.paidAmount,
        //     status: (inv.paymentStatus || inv.status || "draft").toLowerCase(),
        //     customer: {
        //       _id: customer.customerId,
        //       companyName: customer.customerDetails?.companyName || customer.customerName,
        //     },
        //   })) || [];

        //   const custSummary = customer.summary || {};
        //   state.selectedCustomerReport = {
        //     customer: {
        //       _id: customer.customerId,
        //       companyName: customer.customerDetails?.companyName || customer.customerName,
        //       email: customer.customerDetails?.email || "",
        //       phone: customer.customerDetails?.phone || "",
        //       contactPerson: customer.customerDetails?.contactPerson || "",
        //     },
        //     invoices,
        //     summary: {
        //       totalSales: custSummary.totalInvoiceAmount || 0,
        //       totalPaid: custSummary.totalPaidAmount || 0,
        //       totalDue: custSummary.totalRemainingAmount || 0,
        //       totalInvoices: customer.invoices?.length || 0,
        //     },
        //   };
        // }
        // const { page = 1, limit = 10 } = action.meta.arg || {};
        // state.pagination = {
        //   current: parseInt(page),
        //   limit: parseInt(limit),
        //   totalCount: state.reports.length,
        // };
      })
      .addCase(getCustomerReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.reports = [];
        state.selectedCustomerReport = null;
      })
      .addCase(getCustomerSummary.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCustomerSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload.data;
        state.pagination = {
          currentPage: action.payload.data?.pagination?.currentPage || 1,
          totalPages: action.payload.data?.pagination?.totalPages || 1,
          limit: action.payload.data?.pagination?.limit || 10,
          totalCount: action.payload.data?.pagination?.totalCount || 0,
        };
      })
      .addCase(getCustomerSummary.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(getDashboardData.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboars = action.payload.data;
      })
      .addCase(getDashboardData.rejected, (state, action) => {
        state.loading = false;
      })
  },
});

export const { resetCustomerReport } = customerReportSlice.actions;
export default customerReportSlice.reducer;