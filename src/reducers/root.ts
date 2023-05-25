// Import necessary dependencies
import { combineReducers } from '@reduxjs/toolkit';

// Import your slice reducers
import globalSlice from './globalSlice';

// Combine the slice reducers into the rootReducer
const rootReducer = combineReducers({
    global: globalSlice.reducer,
});

export default rootReducer;
