import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import itemService from "./itemService";
import { toast } from "react-toastify";

// Add
export const addItem = createAsyncThunk("item/add", async (data, thunkAPI) => {
  try {
    return await itemService.createItem(data);
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

// Get All
export const getItem = createAsyncThunk(
  "item/getAll",
  async (payload, thunkAPI) => {
    try {
      return await itemService.getAllItem(payload);
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

// Get By ID
export const getItemById = createAsyncThunk(
  "item/getById",
  async (id, thunkAPI) => {
    try {
      return await itemService.getItemById(id);
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

// Update
export const updateItem = createAsyncThunk(
  "item/update",
  async ({ id, data }, thunkAPI) => {
    try {
      return await itemService.updateItem(id, data);
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

// Delete
export const deleteItem = createAsyncThunk(
  "item/delete",
  async (id, thunkAPI) => {
    try {
      return await itemService.deleteItem(id);
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
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
      // Add
      .addCase(addItem.pending, (state) => {
        state.postLoading = true;
      })
      .addCase(addItem.fulfilled, (state, action) => {
        state.postLoading = false;
        state.items.push(action.payload.data);
        state.message = action.payload?.message;
        toast.success(state.message);
      })
      .addCase(addItem.rejected, (state, action) => {
        state.postLoading = false;
        state.error = action.error.message;
        toast.error(state.error);
      })

      // Get All
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
        state.error = action.payload;
        toast.error(state.error);
      })

      // Get By ID
      .addCase(getItemById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getItemById.fulfilled, (state, action) => {
        state.loading = false;
        state.item = action.payload.data;
      })
      .addCase(getItemById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(state.error);
      })

      // Update
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

      // Delete
      .addCase(deleteItem.pending, (state) => {
        state.deleteLoading = true;
      })
      .addCase(deleteItem.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.items = state.items.filter((c) => c._id !== action.meta.arg);
        state.message = action.payload?.message;
        toast.success(state.message);
      })
      .addCase(deleteItem.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload;
        toast.error(action.payload);
      });
  },
});

export const { resetitem } = itemSlice.actions;
export default itemSlice.reducer;
