import { List, ListItem, ListItemText } from "@material-ui/core";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import Page from "../components/Page";
import { fetchCoursesThunk } from "../features/coursesSlice";
import { RootState } from "../rootReducer";

const Courses = () => {
  const dispatch = useDispatch();
  const { courses, isLoading, error } = useSelector(
    (state: RootState) => state.courses
  );

  useEffect(() => {
    dispatch(fetchCoursesThunk());
  }, [dispatch]);

  return (
    <Page title="Välj bana">
      {isLoading && <div className="loading" />}
      {error && <div className="error">{error}</div>}
      <List>
        {courses.map(course => (
          <ListItem
            alignItems="flex-start"
            key={course.id}
            button
            component={Link}
            to={`/play/${course.id}`}
          >
            <ListItemText
              primary={course.name}
              secondary={`Par ${course.par}. ${course.holesCount} hål.`}
            />
          </ListItem>
        ))}
      </List>
    </Page>
  );
};

export default Courses;
