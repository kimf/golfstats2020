import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchCoursesThunk } from "../features/coursesSlice";
import { RootState } from "../rootReducer";

const Courses = () => {
  const dispatch = useDispatch();
  const { data: courses, isLoading, error } = useSelector(
    (state: RootState) => state.courses
  );

  useEffect(() => {
    dispatch(fetchCoursesThunk());
  }, [dispatch]);

  return (
    <div className="col">
      {isLoading && <div className="loading" />}
      {error && <div className="error">{error}</div>}
      <h2>Välj bana</h2>
      <ul>
        {courses.map(course => (
          <li key={course.id}>
            {course.name} <small>({course.holes.length} hål)</small>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Courses;
