import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import { orgApi } from "./actions/org";
import { riderApi } from "./actions/rider";

export const store = configureStore({
  reducer: {
    [orgApi.reducerPath]: orgApi.reducer,
    [riderApi.reducerPath]: riderApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(orgApi.middleware, riderApi.middleware),
});

// Enable RTK Query's automatic re-fetching of queries on focus and reconnect
setupListeners(store.dispatch);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
