import { configureStore } from "@reduxjs/toolkit";

import { v1Reducers } from "@/store";

export default configureStore({
  reducer: { ...v1Reducers },
});
