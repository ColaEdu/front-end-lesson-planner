// Import necessary libraries
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reducers/root";
import thunk from 'redux-thunk';

// Create the Redux store using Redux Toolkit's configureStore function
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

// Export the store for use in the application
export default store;