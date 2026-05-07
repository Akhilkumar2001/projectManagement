import { configureStore } from '@reduxjs/toolkit';
import authReducer    from './slices/authSlice.js';
import projectReducer from './slices/projectSlice.js';
import taskReducer    from './slices/taskSlice.js';

const store = configureStore({
  reducer: {
    auth:     authReducer,
    projects: projectReducer,
    tasks:    taskReducer,
  },
});

export default store;
