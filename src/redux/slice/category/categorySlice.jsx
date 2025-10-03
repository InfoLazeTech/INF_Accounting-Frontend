
  import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
  import categoryService from "./categoryService";


  // Add
  export const addcategory = createAsyncThunk(
    "category/add",
    async (data, thunkAPI) => {
      try {
        return await categoryService.createCategory(data);
      } catch (err) {
        return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
      }
    }
  );

  // Get All
  export const getcategory = createAsyncThunk(
    "category/getAll",
    async (payload, thunkAPI) => {
      try {
        return await categoryService.getAllCategory(payload);
      } catch (err) {
        return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
      }
    }
  );

  // Get By ID
  export const getCategoryById = createAsyncThunk(
    "category/getById",
    async (id, thunkAPI) => {
      try {
        return await categoryService.getCategoryById(id);
      } catch (err) {
        return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
      }
    }
  );

  // Update
  export const updateCategory= createAsyncThunk(
    "category/update",
    async ({ id, data }, thunkAPI) => {
      try {
        return await categoryService.updateCategory(id, data);
      } catch (err) {
        return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
      }
    }
  );

  // Delete
  export const deleteCategory = createAsyncThunk(
    "category/delete",
    async (id, thunkAPI) => {
      try {
        return await categoryService.deleteCategory(id);
      } catch (err) {
        return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
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
      },
    },
    extraReducers: (builder) => {
      builder
        // Add
        .addCase(addcategory.pending, (state) => {
          state.postLoading = true;
        })
        .addCase(addcategory.fulfilled, (state, action) => {
          
          state.postLoading = false;
          // state.categorys.push(action.payload);
        })
        .addCase(addcategory.rejected, (state, action) => {
          state.postLoading = false;
          state.error = action.payload;
        })

        // Get All
        .addCase(getcategory.pending, (state) => {
          state.loading = true;
        })
        .addCase(getcategory.fulfilled, (state, action) => {
            console.log("Fetched categories:", action.payload);
          state.loading = false;
          state.categorys = action.payload.data;
        })
        .addCase(getcategory.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })

        // Get By ID
        .addCase(getCategoryById.pending, (state) => {
          state.loading = true;
        })
        .addCase(getCategoryById.fulfilled, (state, action) => {
          state.loading = false;
          state.category = action.payload.data;
        })
        .addCase(getCategoryById.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })

        // Update
        .addCase(updateCategory.pending, (state) => {
          state.postLoading = true;
        })
        .addCase(updateCategory.fulfilled, (state, action) => {
          state.postLoading = false;
          state.category = action.payload;

          // const index = state.category.findIndex((c) => c._id === action.payload._id);
          // if (index !== -1) state.category[index] = action.payload;
        })
        .addCase(updateCategory.rejected, (state, action) => {
          state.postLoading = false;
          state.error = action.payload;
        })

        // Delete
        .addCase(deleteCategory.pending, (state) => {
          state.loading = true;
        })
        .addCase(deleteCategory.fulfilled, (state, action) => {
          state.loading = false;
          state.categorys = state.categorys.filter((c) => c._id !== action.meta.arg);
        })
        .addCase(deleteCategory.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });
    },
  });

  export const { resetcategory } = categorySlice.actions;
  export default categorySlice.reducer;
