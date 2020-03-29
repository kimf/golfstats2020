import { createSlice, PayloadAction } from "@reduxjs/toolkit"; // PayloadAction

import { Course, fetchCourses } from "../api/api";
import { AppThunk } from "../store";

type CoursesState = {
  isLoading: boolean;
  error: string | null;
  data: Course[];
};

let initialState: CoursesState = {
  isLoading: false,
  data: [],
  error: null
};

function startLoading(state: CoursesState) {
  state.isLoading = true;
}

const coursesSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    getCoursesStart: startLoading,
    getCoursesSuccess(state, action: PayloadAction<Course[]>) {
      state.data = action.payload;
      state.error = null;
      state.isLoading = false;
    },
    getCoursesError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isLoading = false;
    }
  }
});

export const {
  getCoursesStart,
  getCoursesError,
  getCoursesSuccess
} = coursesSlice.actions;

export default coursesSlice.reducer;

export const fetchCoursesThunk = (): AppThunk => async dispatch => {
  try {
    dispatch(getCoursesStart());
    const courses = await fetchCourses();
    dispatch(getCoursesSuccess(courses));
  } catch (err) {
    dispatch(getCoursesError(err.toString()));
  }
};
