import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import bankService from "./bankService";

export const addbank = createAsyncThunk(
    "bank/addbank",
    async (data) => {
        try {
            const response = await bankService.createBank(data);
            return response;
        } catch (error) {
            throw error?.response?.data?.error?.message || error?.message || "Something went wrong";
        }
    }
);

export const getBank = createAsyncThunk(
    "bank/getBank",
    async (payload) => {
        try {
            const response = await bankService.getListBank(payload);
            return response;
        } catch (error) {
            throw error?.response?.data?.error?.message || error?.message || "Something went wrong";
        }
    }
);

export const addTransaction = createAsyncThunk(
    "bank/addTransaction",
    async (data) => {
        try {
            const response = await bankService.createTransaction(data);
            return response;
        } catch (error) {
            throw error?.response?.data?.error?.message || error?.message || "Something went wrong";
        }
    }
);

export const getBankDropdown = createAsyncThunk(
    "bank/getBankDropdown",
    async ({ companyId }) => {
        try {
            const response = await bankService.getBankAccount(companyId);
            return response;
        } catch (error) {
            throw error?.response?.data?.error?.message || error?.message || "Something went wrong";
        }
    }
);

export const getTransaction = createAsyncThunk(
    "bank/getTransaction ",
    async (payload) => {
        try {
            const response = await bankService.getTransaction(payload);
            return response;
        } catch (error) {
            throw error?.response?.data?.error?.message || error?.message || "Something went wrong";
        }
    }
);

export const updateTransaction = createAsyncThunk(
    "bank/updateTransaction  ",
    async (payload) => {
        try {
            const response = await bankService.updateTransaction(payload);
            return response;
        } catch (error) {
            throw error?.response?.data?.error?.message || error?.message || "Something went wrong";
        }
    }
);

export const deleteTransaction = createAsyncThunk(
    "bank/deleteTransaction",
    async (transactionId) => {
        try {
            const response = await bankService.deleteTransaction(transactionId);
            return response;
        } catch (error) {
            throw error?.response?.data?.error?.message || error?.message || "Something went wrong";
        }
    }
);



const bankSlice = createSlice({
    name: "bank",
    initialState: {
        banks: [],
        bankDropdown: [],
        transactions: [],
        bankData: {},
        bank: null,
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
            state.bank = null;
            state.loading = false;
            state.postLoading = false;
            state.error = null;
            state.message = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(addbank.pending, (state) => {
                state.postLoading = true;
            })
            .addCase(addbank.fulfilled, (state, action) => {
                state.postLoading = false;
                state.message = action.payload.message;
                toast.success(state.message);
            })
            .addCase(addbank.rejected, (state, action) => {
                state.postLoading = false;
                state.error = action.error.message;
                toast.error(state.error);
            })
            .addCase(getBank.pending, (state) => {
                state.loading = true;
            })
            .addCase(getBank.fulfilled, (state, action) => {
                state.loading = false;
                state.banks = action.payload.data;
                state.pagination = action.payload.extras || {};
            })
            .addCase(getBank.rejected, (state, action) => {
                state.loading = false;
            })
            .addCase(addTransaction.pending, (state) => {
                state.postLoading = true;
            })
            .addCase(addTransaction.fulfilled, (state, action) => {
                state.postLoading = false;
                state.message = action.payload.message;
                toast.success(state.message);
            })
            .addCase(addTransaction.rejected, (state, action) => {
                state.postLoading = false;
                state.error = action.error.message;
                toast.error(state.error);
            })
            .addCase(getBankDropdown.pending, (state) => {
                state.loading = true;
            })
            .addCase(getBankDropdown.fulfilled, (state, action) => {
                state.loading = false;
                state.bankDropdown = action.payload.data;
            })
            .addCase(getBankDropdown.rejected, (state, action) => {
                state.loading = false;
            })
            .addCase(getTransaction.pending, (state) => {
                state.loading = true;
            })
            .addCase(getTransaction.fulfilled, (state, action) => {
                state.loading = false;
                state.transactions = action.payload.data;
                state.bankData = action.payload.extras;
            })
            .addCase(getTransaction.rejected, (state, action) => {
                state.loading = false;
            })
            .addCase(updateTransaction.pending, (state) => {
                state.postLoading = true;
            })
            .addCase(updateTransaction.fulfilled, (state, action) => {
                state.postLoading = false;
                state.message = action.payload.message;
                toast.success(state.message);
            })
            .addCase(updateTransaction.rejected, (state, action) => {
                state.postLoading = false;
                state.error = action.error.message;
                toast.error(state.error);
            })
            .addCase(deleteTransaction.pending, (state) => {
                state.deleteLoading = true;
            })
            .addCase(deleteTransaction.fulfilled, (state, action) => {
                state.deleteLoading = false;
                state.message = action.payload.message;
                toast.success(state.message);
            })
            .addCase(deleteTransaction.rejected, (state, action) => {
                state.deleteLoading = false;
                state.error = action.error.message;
                toast.error(state.error);
            })
    },
});

export const { resetBank } = bankSlice.actions;
export default bankSlice.reducer;
