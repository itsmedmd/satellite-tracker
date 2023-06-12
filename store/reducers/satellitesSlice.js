import { createSlice } from "@reduxjs/toolkit";

export const satellitesSlice = createSlice({
  name: "satellites",
  initialState: {
    searchFilterValue: "",
    showingSearchItemsCount: 100,
  },
  reducers: {
    setSearchFilterValue: (state, { payload }) => {
      return {
        ...state,
        searchFilterValue: payload,
      };
    },
    setShowingSearchItemsCount: (state, { payload }) => {
      return {
        ...state,
        showingSearchItemsCount: payload,
      };
    },
  },
});

export const { setSearchFilterValue, setShowingSearchItemsCount } = satellitesSlice.actions;
export default satellitesSlice.reducer;
