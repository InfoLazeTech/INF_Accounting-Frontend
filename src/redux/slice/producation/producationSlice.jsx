import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import producationService from "./producationService";
import { toast } from "react-toastify";

export const addProducationOrder = createAsyncThunk("producation/addProducationOrder", async (data) => {
    try {
        const response = await producationService.createProducationOrder(data);
        return response;
    } catch (error) {
        throw error?.response?.data?.error?.message || error?.message || "Something went wrong";
    }
});

export const getProducationOrder = createAsyncThunk(
    "producation/getProducationOrder",
    async (payload) => {
        try {
            const response = await producationService.getProducationOrder(payload);
            return response;
        } catch (error) {
            throw error?.response?.data?.error?.message || error?.message || "Something went wrong";
        }
    }
);

export const deleteProducationOrder = createAsyncThunk(
    "producation/deleteProducationOrder",
    async (orderId) => {
        try {
            const response = await producationService.deleteProducationOrder(orderId);
            return response;
        } catch (error) {
            throw error?.response?.data?.error?.message || error?.message || "Something went wrong";
        }
    }
);

export const getProducationOrderById = createAsyncThunk(
    "producation/getProducationOrderById",
    async (orderId) => {
        try {
            const response = await producationService.getProducationOrderById(orderId);
            return response;
        } catch (error) {
            throw error?.response?.data?.error?.message || error?.message || "Something went wrong";
        }
    }
);

const productionSlice = createSlice({
    name: "producation",
    initialState: {
        producationOrder: [],
        producationOrderById: [],
        loading: false,
        postLoading: false,
        deleteLoading: false,
        error: null,
        message: null,
        pagination: {
            page: 1,
            limit: 10,
            total: 0,
        },
    },
    reducers: {
        resetBank: (state) => {
            state.loading = false;
            state.postLoading = false;
            state.error = null;
            state.message = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(addProducationOrder.pending, (state) => {
                state.postLoading = true;
            })
            .addCase(addProducationOrder.fulfilled, (state, action) => {
                state.postLoading = false;
                // state.items.push(action.payload.data);
                state.message = action.payload.message;
                toast.success(state.message);
            })
            .addCase(addProducationOrder.rejected, (state, action) => {
                state.postLoading = false;
                state.error = action.error.message;
                toast.error(state.error);
            })
            .addCase(getProducationOrder.pending, (state) => {
                state.loading = true;
            })
            .addCase(getProducationOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.producationOrder = action.payload.data;
                state.pagination = action.payload.extras || {};
            })
            .addCase(getProducationOrder.rejected, (state, action) => {
                state.loading = false;
            })
            .addCase(deleteProducationOrder.pending, (state) => {
                state.deleteLoading = true;
            })
            .addCase(deleteProducationOrder.fulfilled, (state, action) => {
                state.deleteLoading = false;
                state.message = action.payload.message;
                toast.success(state.message);
            })
            .addCase(deleteProducationOrder.rejected, (state, action) => {
                state.deleteLoading = false;
                state.error = action.error.message;
                toast.error(state.error);
            })
            .addCase(getProducationOrderById.pending, (state) => {
                state.loading = true;
            })
            .addCase(getProducationOrderById.fulfilled, (state, action) => {
                state.loading = false;
                state.producationOrderById = action.payload.data;
            })
            .addCase(getProducationOrderById.rejected, (state, action) => {
                state.loading = false;
            })
    },
});

export const { resetProduction } = productionSlice.actions;
export default productionSlice.reducer;
