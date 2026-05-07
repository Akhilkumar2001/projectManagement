import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../services/authService.js';

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const { data } = await authService.login(credentials);
    localStorage.setItem('token', data.data.token);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Login failed');
  }
});

export const fetchMe = createAsyncThunk('auth/fetchMe', async (_, { rejectWithValue }) => {
  try {
    const { data } = await authService.getMe();
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch user');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user:    null,
    token:   localStorage.getItem('token') || null,
    loading: false,
    error:   null,
  },
  reducers: {
    logout(state) {
      state.user  = null;
      state.token = null;
      localStorage.removeItem('token');
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending,   (state)          => { state.loading = true;  state.error = null; })
      .addCase(login.fulfilled, (state, action)  => {
        state.loading = false;
        state.token   = action.payload.token;
        state.user    = action.payload.user;
      })
      .addCase(login.rejected,  (state, action)  => { state.loading = false; state.error = action.payload; })
      .addCase(fetchMe.fulfilled, (state, action) => { state.user = action.payload; })
      .addCase(fetchMe.rejected,  (state)         => {
        state.user  = null;
        state.token = null;
        localStorage.removeItem('token');
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
