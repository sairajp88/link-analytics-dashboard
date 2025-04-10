import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import linksReducer from './linksSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    links: linksReducer,
  },
  // Optional: Middleware is already included by default in RTK
  // but you can customize here if needed:
  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware().concat(customMiddleware),
});

export default store;
