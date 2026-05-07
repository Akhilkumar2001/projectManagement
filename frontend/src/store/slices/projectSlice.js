import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import projectService from '../../services/projectService.js';

export const fetchProjects = createAsyncThunk('projects/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const { data } = await projectService.getAll(params);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch projects');
  }
});

export const createProject = createAsyncThunk('projects/create', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await projectService.create(payload);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to create project');
  }
});

export const updateProject = createAsyncThunk('projects/update', async ({ id, payload }, { rejectWithValue }) => {
  try {
    const { data } = await projectService.update(id, payload);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update project');
  }
});

export const deleteProject = createAsyncThunk('projects/delete', async (id, { rejectWithValue }) => {
  try {
    await projectService.delete(id);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete project');
  }
});

const projectSlice = createSlice({
  name: 'projects',
  initialState: { list: [], loading: false, error: null, selected: null },
  reducers: {
    setSelected(state, action) { state.selected = action.payload; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending,   (state)         => { state.loading = true; })
      .addCase(fetchProjects.fulfilled, (state, action) => { state.loading = false; state.list = action.payload; })
      .addCase(fetchProjects.rejected,  (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(createProject.fulfilled, (state, action) => { state.list.unshift(action.payload); })
      .addCase(updateProject.fulfilled, (state, action) => {
        const idx = state.list.findIndex((p) => p._id === action.payload._id);
        if (idx !== -1) state.list[idx] = action.payload;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.list = state.list.filter((p) => p._id !== action.payload);
      });
  },
});

export const { setSelected } = projectSlice.actions;
export default projectSlice.reducer;
