import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import reportService from "./reportService";

export const getItemSalesDetail = createAsyncThunk(
    "customerReport/getItemSalesDetail",
    async (payload, thunkAPI) => {
        try {
            const response = await reportService.getItemSales(payload);
            return response;
        } catch (err) {
            const message = err.response?.data?.message || err.message || "Failed to fetch report";
            toast.error(message);
            return thunkAPI.rejectWithValue(message);
        }
    }
);

const itemReportSlice = createSlice({
    name: "itemReport",
    initialState: {
        itemSalesDetail: [],
        selectedCustomerReport: null,
        loading: false,
        error: null,
        pagination: { current: 1, limit: 10, totalCount: 0 },
    },
    reducers: {
        resetCustomerReport: (state) => {
            state.itemSalesDetail = [];
            state.selectedCustomerReport = null;
            state.pagination = { current: 1, limit: 10, totalCount: 0 };
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getItemSalesDetail.pending, (state) => {
                state.loading = true;
            })
            .addCase(getItemSalesDetail.fulfilled, (state, action) => {
                state.loading = false;
                state.itemSalesDetail = action.payload.data;
            })
            .addCase(getItemSalesDetail.rejected, (state, action) => {
                state.loading = false;
            })
    },
});

export const { resetCustomerReport } = itemReportSlice.actions;
export default itemReportSlice.reducer;