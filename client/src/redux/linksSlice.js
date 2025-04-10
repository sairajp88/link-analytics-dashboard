// src/redux/linksSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Fetch all links
export const fetchLinks = createAsyncThunk(
  'links/fetchLinks',
  async (_, thunkAPI) => {
    try {
      const token = JSON.parse(localStorage.getItem('authState'))?.user?.token;
      const res = await axios.get('/api/links', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue('Failed to fetch links');
    }
  }
);

// Delete a link
export const deleteLinkAsync = createAsyncThunk(
  'links/deleteLinkAsync',
  async (id, thunkAPI) => {
    try {
      const token = JSON.parse(localStorage.getItem('authState'))?.user?.token;
      await axios.delete(`/api/links/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue('Failed to delete link');
    }
  }
);

// ✅ Create a new link
export const createLinkAsync = createAsyncThunk(
  'links/createLinkAsync',
  async ({ originalUrl, customAlias, expiresAt }, thunkAPI) => {
    try {
      const token = JSON.parse(localStorage.getItem('authState'))?.user?.token;
      const res = await axios.post(
        '/api/links',
        {
          originalUrl,
          customAlias: customAlias.trim() || undefined,
          expiresAt: expiresAt || undefined,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to create link');
    }
  }
);

const linksSlice = createSlice({
  name: 'links',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {
    // You can remove addLink since we're using async thunk now
  },
  extraReducers: (builder) => {
    builder
      // Fetch Links
      .addCase(fetchLinks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLinks.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchLinks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Link
      .addCase(deleteLinkAsync.fulfilled, (state, action) => {
        state.list = state.list.filter(link => link._id !== action.payload);
      })
      .addCase(deleteLinkAsync.rejected, (state, action) => {
        state.error = action.payload;
      })

      // ✅ Create Link
      .addCase(createLinkAsync.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      })
      .addCase(createLinkAsync.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default linksSlice.reducer;
