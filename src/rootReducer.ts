import { combineReducers } from "@reduxjs/toolkit";

import coursesReducer from "./features/coursesSlice";

const rootReducer = combineReducers({
  courses: coursesReducer
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
