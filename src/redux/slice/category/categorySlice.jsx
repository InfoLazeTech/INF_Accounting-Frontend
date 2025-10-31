import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import categoryService from "./categoryService";
import { toast } from "react-toastify";

// Add
export const addcategory = createAsyncThunk(
  "category/add",
  async (data) => {
    try {
      const response = await categoryService.createCategory(data);
      return response;
    } catch (error) {
      throw error?.response?.data?.error?.message || error?.message || "Something went wrong";
    }
  }
);

// Get All
export const getcategory = createAsyncThunk(
  "category/getAll",
  async (payload) => {
    try {
      const response = await categoryService.getAllCategory(payload);
      return response;
    } catch (error) {
      throw error?.response?.data?.error?.message || error?.message || "Something went wrong";
    }
  }
);

// Get By ID
export const getCategoryById = createAsyncThunk(
  "category/getById",
  async (id) => {
    try {
      const response = await categoryService.getCategoryById(id);
      return response;
    } catch (error) {
      throw error?.response?.data?.error?.message || error?.message || "Something went wrong";
    }
  }
);

// Update
export const updateCategory = createAsyncThunk(
  "category/update",
  async ({ id, data }) => {
    try {
      const response = await categoryService.updateCategory(id, data);
      return response;
    } catch (error) {
      throw error?.response?.data?.error?.message || error?.message || "Something went wrong";
    }
  }
);

// Delete
export const deleteCategory = createAsyncThunk(
  "category/delete",
  async (id) => {
    try {
      const response = await categoryService.deleteCategory(id);
      return response;
    } catch (error) {
      throw error?.response?.data?.error?.message || error?.message || "Something went wrong";
    }
  }
);

const categorySlice = createSlice({
  name: "category",
  initialState: {
    categorys: [],
    category: null,
    loading: false,
    postLoading: false,
    error: null,
  },
  reducers: {
    resetcategory: (state) => {
      state.category = [];
      state.category = null;
      state.loading = false;
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addcategory.pending, (state) => {
        state.postLoading = true;
      })
      .addCase(addcategory.fulfilled, (state, action) => {
        state.postLoading = false;
        state.message = action.payload.message;
        toast.success(state.message);
      })
      .addCase(addcategory.rejected, (state, action) => {
        state.postLoading = false;
        state.error = action.error.message;
        toast.error(state.error);
      })
      .addCase(getcategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(getcategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categorys = action.payload.data;
      })
      .addCase(getcategory.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(getCategoryById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCategoryById.fulfilled, (state, action) => {
        state.loading = false;
        state.category = action.payload.data;
      })
      .addCase(getCategoryById.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(updateCategory.pending, (state) => {
        state.postLoading = true;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.postLoading = false;
        state.category = action.payload;
        state.message = action.payload.message;
        toast.success(state.message);
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.postLoading = false;
        state.error = action.error.message;
        toast.error(state.error);
      })
      .addCase(deleteCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categorys = state.categorys.filter(
          (c) => c._id !== action.meta.arg
        );
        state.message = action.payload.message;
        toast.success(state.message);
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        toast.error(state.error);
      });
  },
});

export const { resetcategory } = categorySlice.actions;
export default categorySlice.reducer;
