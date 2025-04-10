import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const ADMIN_EMAIL = 'admin@linkmail.com';
const ADMIN_PASSWORD = 'admin123';

export const loginUser = createAsyncThunk('auth/loginUser', async ({ email, password }, thunkAPI) => {
  try {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const token = 'dummy-token';
      localStorage.setItem('token', token); // Save token
      localStorage.setItem('userEmail', email); // Optional: Save user info
      return { email, token };
    } else {
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

const tokenFromStorage = localStorage.getItem('token');
const userEmailFromStorage = localStorage.getItem('userEmail');

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isLoggedIn: !!tokenFromStorage,
    user: tokenFromStorage ? { email: userEmailFromStorage } : null,
    token: tokenFromStorage || null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
      state.token = null;
      state.error = null;
      localStorage.removeItem('token');
      localStorage.removeItem('userEmail');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isLoggedIn = true;
        state.user = { email: action.payload.email };
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
