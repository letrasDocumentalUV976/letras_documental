import { combineReducers, configureStore } from "@reduxjs/toolkit";

import { logout, v1Reducers } from "@/store";

const appReducer = combineReducers(v1Reducers);

const rootReducer: typeof appReducer = (state, action) => {
  if (action.type === logout.type) {
    state = undefined;
  }
  return appReducer(state, action);
};

export default configureStore({
  reducer: rootReducer,
});
