import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import itemService from "./itemService";
import { toast } from "react-toastify";

export const addItem = createAsyncThunk("item/add", async (data) => {
  try {
    const response = await itemService.createItem(data);
    return response;
  } catch (error) {
    throw error?.response?.data?.error?.message || error?.message || "Something went wrong";
  }
});

export const getItem = createAsyncThunk(
  "item/getAll",
  async (payload) => {
    try {
      const response = await itemService.getAllItem(payload);
      return response;
    } catch (error) {
      throw error?.response?.data?.error?.message || error?.message || "Something went wrong";
    }
  }
);

export const getItemById = createAsyncThunk(
  "item/getById",
  async (id) => {
    try {
      const response = await itemService.getItemById(id);
      return response;
    } catch (error) {
      throw error?.response?.data?.error?.message || error?.message || "Something went wrong";
    }
  }
);

export const updateItem = createAsyncThunk(
  "item/update",
  async ({ id, data }) => {
    try {
      const response = await itemService.updateItem(id, data);
      return response;
    } catch (error) {
      throw error?.response?.data?.error?.message || error?.message || "Something went wrong";
    }
  }
);

export const deleteItem = createAsyncThunk(
  "item/delete",
  async (id) => {
    try {
      const response = await itemService.deleteItem(id);
      return response;
    } catch (error) {
      throw error?.response?.data?.error?.message || error?.message || "Something went wrong";
    }
  }
);

const itemSlice = createSlice({
  name: "item",
  initialState: {
    items: [],
    pagination: {
      totalPages: 1,
      totalCount: 0,
      limit: 10,
      currentPage: 1,
    },
    item: null,
    loading: false,
    postLoading: false,
    deleteLoading: false,
    error: null,
  },
  reducers: {
    resetitem: (state) => {
      state.items = [];
      state.item = null;
      state.loading = false;
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addItem.pending, (state) => {
        state.postLoading = true;
      })
      .addCase(addItem.fulfilled, (state, action) => {
        state.postLoading = false;
        // state.items.push(action.payload.data);
        state.message = action.payload.message;
        toast.success(state.message);
      })
      .addCase(addItem.rejected, (state, action) => {
        state.postLoading = false;
        state.error = action.error.message;
        toast.error(state.error);
      })
      .addCase(getItem.pending, (state) => {
        state.loading = true;
      })
      .addCase(getItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.pagination = {
          currentPage: action.payload.extras.pagination.currentPage,
          totalPages: action.payload.extras.pagination.totalPages,
          limit: action.payload.extras.pagination.limit,
          totalCount: action.payload.extras.pagination.totalCount,
        };
      })
      .addCase(getItem.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(getItemById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getItemById.fulfilled, (state, action) => {
        state.loading = false;
        state.item = action.payload.data;
      })
      .addCase(getItemById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        toast.error(state.error);
      })
      .addCase(updateItem.pending, (state) => {
        state.postLoading = true;
      })
      .addCase(updateItem.fulfilled, (state, action) => {
        state.postLoading = false;
        state.current = action.payload;

        const index = state.items.findIndex(
          (c) => c._id === action.payload._id
        );
        if (index !== -1) state.items[index] = action.payload;
        toast.success(action.payload?.message);
      })
      .addCase(updateItem.rejected, (state, action) => {
        state.postLoading = false;
        state.error = action.error.message;
        toast.error(state.error);
      })
      .addCase(deleteItem.pending, (state) => {
        state.deleteLoading = true;
      })
      .addCase(deleteItem.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.items = state.items.filter((c) => c._id !== action.meta.arg);
        state.message = action.payload.message;
        toast.success(state.message);
      })
      .addCase(deleteItem.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.error.message;
        toast.error(state.error);
      });
  },
});

export const { resetitem } = itemSlice.actions;
export default itemSlice.reducer;
