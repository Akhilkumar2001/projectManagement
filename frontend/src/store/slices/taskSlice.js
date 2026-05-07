import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import taskService from '../../services/taskService.js';

export const fetchTasks = createAsyncThunk('tasks/fetchByProject', async ({ projectId, params }, { rejectWithValue }) => {
  try {
    const { data } = await taskService.getByProject(projectId, params);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch tasks');
  }
});

export const createTask = createAsyncThunk('tasks/create', async (formData, { rejectWithValue }) => {
  try {
    const { data } = await taskService.create(formData);
    // assignAll returns array, single returns object — normalise to array
    const tasks = Array.isArray(data.data) ? data.data : [data.data];
    return tasks;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to create task');
  }
});

export const updateTask = createAsyncThunk('tasks/update', async ({ id, payload }, { rejectWithValue }) => {
  try {
    const { data } = await taskService.update(id, payload);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update task');
  }
});

export const approveTask = createAsyncThunk('tasks/approve', async (id, { rejectWithValue }) => {
  try {
    const { data } = await taskService.approve(id);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to approve task');
  }
});

export const rejectTask = createAsyncThunk('tasks/reject', async ({ id, rejectionReason }, { rejectWithValue }) => {
  try {
    const { data } = await taskService.reject(id, rejectionReason);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to reject task');
  }
});

const taskSlice = createSlice({
  name: 'tasks',
  initialState: { list: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    const upsert = (state, action) => {
      const idx = state.list.findIndex((t) => t._id === action.payload._id);
      if (idx !== -1) state.list[idx] = action.payload;
    };
    builder
      .addCase(fetchTasks.pending,   (state)         => { state.loading = true; })
      .addCase(fetchTasks.fulfilled, (state, action) => { state.loading = false; state.list = action.payload; })
      .addCase(fetchTasks.rejected,  (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(createTask.fulfilled, (state, action) => { state.list.unshift(...action.payload); })
      .addCase(updateTask.fulfilled, upsert)
      .addCase(approveTask.fulfilled, upsert)
      .addCase(rejectTask.fulfilled,  upsert);
  },
});

export default taskSlice.reducer;
