import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import invoiceService from "./invoiceService";
import { toast } from "react-toastify";

export const addInvoice = createAsyncThunk("invoice/add", async (data) => {
  try {
    const response = await invoiceService.createInvoice(data);
    return response;
  } catch (error) {
    throw error?.response?.data?.error?.message || error?.message || "Something went wrong";
  }
});

export const getInvoices = createAsyncThunk(
  "invoice/getAll",
  async (payload) => {
    try {
      const response = await invoiceService.getAllInvoices(payload);
      return response;
    } catch (error) {
      throw error?.response?.data?.error?.message || error?.message || "Something went wrong";
    }
  }
);

export const getInvoiceById = createAsyncThunk(
  "invoice/getById",
  async (payload) => {
    try {
      const response = await invoiceService.getInvoiceById(payload);
      return response;
    } catch (error) {
      throw error?.response?.data?.error?.message || error?.message || "Something went wrong";
    }
  }
);

export const updateInvoice = createAsyncThunk(
  "invoice/update",
  async ({ invoiceId, data }) => {
    try {
      const response = await invoiceService.updateInvoice(invoiceId, data);
      return response;
    } catch (error) {
      throw error?.response?.data?.error?.message || error?.message || "Something went wrong";
    }
  }
);

export const deleteInvoice = createAsyncThunk(
  "invoice/delete",
  async (invoiceId) => {
    try {
      const response = await invoiceService.deleteInvoice(invoiceId);
      return response;
    } catch (error) {
      throw error?.response?.data?.error?.message || error?.message || "Something went wrong";
    }
  }
);

export const updateInvoiceStatus = createAsyncThunk(
  "invoice/updateStatus",
  async ({ invoiceId, data }) => {
    try {
      const response = await invoiceService.updateInvoiceStatus(invoiceId, data);
      return response;
    } catch (error) {
      throw error?.response?.data?.error?.message || error?.message || "Something went wrong";
    }
  }
);

export const recordPayment = createAsyncThunk(
  "invoice/recordPayment",
  async ({ invoiceId, data }) => {
    try {
      const response = await invoiceService.recordPayment(invoiceId, data);
      return response;
    } catch (error) {
      throw error?.response?.data?.error?.message || error?.message || "Something went wrong";
    }
  }
);

export const getRevenueSummary = createAsyncThunk(
  "invoice/summary",
  async (payload) => {
    try {
      const response = await invoiceService.getRevenueSummary(payload);
      return response;
    } catch (error) {
      throw error?.response?.data?.error?.message || error?.message || "Something went wrong";
    }
  }
);

export const getOverdueInvoices = createAsyncThunk(
  "invoice/overdue",
  async (payload) => {
    try {
      const response = await invoiceService.getOverdueInvoices(payload);
      return response;
    } catch (error) {
      throw error?.response?.data?.error?.message || error?.message || "Something went wrong";
    }
  }
);

export const getInvoicesByStatus = createAsyncThunk(
  "invoice/byStatus",
  async (payload) => {
    try {
      const response = await invoiceService.getInvoicesByStatus(payload);
      return response;
    } catch (error) {
      throw error?.response?.data?.error?.message || error?.message || "Something went wrong";
    }
  }
);

export const getInvoicesByCustomer = createAsyncThunk(
  "invoice/byCustomer",
  async (payload) => {
    try {
      const response = await invoiceService.getInvoicesByCustomer(payload);
      return response;
    } catch (error) {
      throw error?.response?.data?.error?.message || error?.message || "Something went wrong";
    }
  }
);

export const getInvoicesByDateRange = createAsyncThunk(
  "invoice/byDateRange",
  async (payload) => {
    try {
      const response = await invoiceService.getInvoicesByDateRange(payload);
      return response;
    } catch (error) {
      throw error?.response?.data?.error?.message || error?.message || "Something went wrong";
    }
  }
);

export const getTopCustomersByRevenue = createAsyncThunk(
  "invoice/topCustomers",
  async (payload) => {
    try {
      const response = await invoiceService.getTopCustomersByRevenue(payload);
      return response;
    } catch (error) {
      throw error?.response?.data?.error?.message || error?.message || "Something went wrong";
    }
  }
);

export const getMonthlyRevenueTrend = createAsyncThunk(
  "invoice/revenueTrend",
  async (payload) => {
    try {
      const response = await invoiceService.getMonthlyRevenueTrend(payload);
      return response;
    } catch (error) {
      throw error?.response?.data?.error?.message || error?.message || "Something went wrong";
    }
  }
);

const invoiceSlice = createSlice({
  name: "invoice",
  initialState: {
    invoices: [],
    pagination: {
      totalPages: 1,
      totalCount: 0,
      limit: 10,
      currentPage: 1,
    },
    invoice: null,
    summary: null,
    overdueInvoices: [],
    invoicesByStatus: [],
    invoicesByCustomer: [],
    invoicesByDateRange: [],
    topCustomers: [],
    revenueTrend: [],
    loading: false,
    postLoading: false,
    deleteLoading: false,
    error: null,
    message: null,
  },
  reducers: {
    resetInvoice: (state) => {
      state.invoices = [];
      state.invoice = null;
      state.summary = null;
      state.overdueInvoices = [];
      state.invoicesByStatus = [];
      state.invoicesByCustomer = [];
      state.invoicesByDateRange = [];
      state.topCustomers = [];
      state.revenueTrend = [];
      state.loading = false;
      state.postLoading = false;
      state.deleteLoading = false;
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Add Invoice
      .addCase(addInvoice.pending, (state) => {
        state.postLoading = true;
      })
      .addCase(addInvoice.fulfilled, (state, action) => {
        state.postLoading = false;
        // state.invoices.push(action.payload.data);
        state.message = action.payload.message;
        toast.success(state.message);
      })
      .addCase(addInvoice.rejected, (state, action) => {
        state.postLoading = false;
        state.error = action.error.message;
        toast.error(state.error);
      })
      // Get All Invoices
      .addCase(getInvoices.pending, (state) => {
        state.loading = true;
      })
      .addCase(getInvoices.fulfilled, (state, action) => {
        state.loading = false;
        state.invoices = action.payload.data;
        state.pagination = {
          currentPage: action.payload.extras?.pagination?.currentPage || 1,
          totalPages: action.payload.extras?.pagination?.totalPages || 1,
          limit: action.payload.extras?.pagination?.limit || 10,
          totalCount: action.payload.extras?.pagination?.totalCount || 0,
        };
      })
      .addCase(getInvoices.rejected, (state, action) => {
        state.loading = false;
      })
      // Get Invoice By Id
      .addCase(getInvoiceById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getInvoiceById.fulfilled, (state, action) => {
        state.loading = false;
        state.invoice = action.payload.data;
      })
      .addCase(getInvoiceById.rejected, (state, action) => {
        state.loading = false;
      })
      // Update Invoice
      .addCase(updateInvoice.pending, (state) => {
        state.postLoading = true;
      })
      .addCase(updateInvoice.fulfilled, (state, action) => {
        state.postLoading = false;
        // const index = state.invoices.findIndex(
        //   (i) => i._id === action.payload.data._id
        // );
        // if (index !== -1) state.invoices[index] = action.payload.data;
        state.message = action.payload.message;
        toast.success(state.message);
      })
      .addCase(updateInvoice.rejected, (state, action) => {
        state.postLoading = false;
        state.error = action.error.message;
        toast.error(state.error);
      })
      // Delete Invoice
      .addCase(deleteInvoice.pending, (state) => {
        state.deleteLoading = true;
      })
      .addCase(deleteInvoice.fulfilled, (state, action) => {
        state.deleteLoading = false;
        // state.invoices = state.invoices.filter((i) => i._id !== action.meta.arg);
        state.message = action.payload.message;
        toast.success(state.message);
      })
      .addCase(deleteInvoice.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.error.message;
        toast.error(state.error);
      })
      // Update Invoice Status
      .addCase(updateInvoiceStatus.pending, (state) => {
        state.postLoading = true;
      })
      .addCase(updateInvoiceStatus.fulfilled, (state, action) => {
        state.postLoading = false;
        // const index = state.invoices.findIndex(
        //   (i) => i._id === action.payload.data._id
        // );
        // if (index !== -1) state.invoices[index] = action.payload.data;
        state.message = action.payload.message;
        toast.success(state.message);
      })
      .addCase(updateInvoiceStatus.rejected, (state, action) => {
        state.postLoading = false;
        state.error = action.error.message;
        toast.error(state.error);
      })
      // Record Payment
      .addCase(recordPayment.pending, (state) => {
        state.postLoading = true;
      })
      .addCase(recordPayment.fulfilled, (state, action) => {
        state.postLoading = false;
        // const index = state.invoices.findIndex(
        //   (i) => i._id === action.payload.data._id
        // );
        // if (index !== -1) state.invoices[index] = action.payload.data;
        state.message = action.payload.message;
        toast.success(state.message);
      })
      .addCase(recordPayment.rejected, (state, action) => {
        state.postLoading = false;
        state.error = action.error.message;
        toast.error(state.error);
      })
      // Get Revenue Summary
      .addCase(getRevenueSummary.pending, (state) => {
        state.loading = true;
      })
      .addCase(getRevenueSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload.data;
      })
      .addCase(getRevenueSummary.rejected, (state, action) => {
        state.loading = false;
      })
      // Get Overdue Invoices
      .addCase(getOverdueInvoices.pending, (state) => {
        state.loading = true;
      })
      .addCase(getOverdueInvoices.fulfilled, (state, action) => {
        state.loading = false;
        state.overdueInvoices = action.payload.data;
      })
      .addCase(getOverdueInvoices.rejected, (state, action) => {
        state.loading = false;
      })
      // Get Invoices By Status
      .addCase(getInvoicesByStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(getInvoicesByStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.invoicesByStatus = action.payload.data;
      })
      .addCase(getInvoicesByStatus.rejected, (state, action) => {
        state.loading = false;
      })
      // Get Invoices By Customer
      .addCase(getInvoicesByCustomer.pending, (state) => {
        state.loading = true;
      })
      .addCase(getInvoicesByCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.invoicesByCustomer = action.payload.data;
      })
      .addCase(getInvoicesByCustomer.rejected, (state, action) => {
        state.loading = false;
      })
      // Get Invoices By Date Range
      .addCase(getInvoicesByDateRange.pending, (state) => {
        state.loading = true;
      })
      .addCase(getInvoicesByDateRange.fulfilled, (state, action) => {
        state.loading = false;
        state.invoicesByDateRange = action.payload.data;
      })
      .addCase(getInvoicesByDateRange.rejected, (state, action) => {
        state.loading = false;
      })
      // Get Top Customers By Revenue
      .addCase(getTopCustomersByRevenue.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTopCustomersByRevenue.fulfilled, (state, action) => {
        state.loading = false;
        state.topCustomers = action.payload.data;
      })
      .addCase(getTopCustomersByRevenue.rejected, (state, action) => {
        state.loading = false;
      })
      // Get Monthly Revenue Trend
      .addCase(getMonthlyRevenueTrend.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMonthlyRevenueTrend.fulfilled, (state, action) => {
        state.loading = false;
        state.revenueTrend = action.payload.data;
      })
      .addCase(getMonthlyRevenueTrend.rejected, (state, action) => {
        state.loading = false;
      });
  },
});

export const { resetInvoice } = invoiceSlice.actions;
export default invoiceSlice.reducer;