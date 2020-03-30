import { createSlice, PayloadAction } from "@reduxjs/toolkit"; // PayloadAction

import { Course, fetchCourses, fetchCourseWithHoles, Hole } from "../api/api";
import { AppThunk } from "../store";

type CoursesState = {
  isLoading: boolean;
  error: string | null;
  courses: Course[];
  course?: Course;
  holes: Hole[];
};

let initialState: CoursesState = {
  isLoading: false,
  courses: [],
  holes: [],
  error: null
};

function startLoading(state: CoursesState) {
  state.isLoading = true;
}

function gotError(state: CoursesState, action: PayloadAction<string>) {
  state.error = action.payload;
  state.isLoading = false;
}

const coursesSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    // Single Course
    getOneCourseStart: startLoading,
    getOneCourseError: gotError,
    getOneCourseSuccess(state, action: PayloadAction<Course>) {
      const course = action.payload;
      state.course = course;
      state.holes = course.holes;
      state.isLoading = false;
      state.error = null;
    },
    // Courses
    getCoursesStart: startLoading,
    getCoursesError: gotError,
    getCoursesSuccess(state, action: PayloadAction<Course[]>) {
      state.courses = action.payload;
      state.error = null;
      state.isLoading = false;
    }
  }
});

export const {
  getOneCourseStart,
  getOneCourseError,
  getOneCourseSuccess,
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

export const fetchCoursesWithHolesThunk = (
  courseId: string
): AppThunk => async dispatch => {
  try {
    dispatch(getOneCourseStart());
    const course = await fetchCourseWithHoles(courseId);
    dispatch(getOneCourseSuccess(course));
  } catch (err) {
    dispatch(getOneCourseError(err.toString()));
  }
};
