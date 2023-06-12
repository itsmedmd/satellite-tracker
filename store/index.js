import { configureStore } from "@reduxjs/toolkit";
import satellitesReducer from "./reducers/satellitesSlice";

export default configureStore({
  reducer: {
    satellites: satellitesReducer,
  },
});
