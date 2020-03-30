import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouteMatch } from "react-router-dom";

import HoleView from "../components/HoleView";
import Page from "../components/Page";
import { fetchCoursesWithHolesThunk } from "../features/coursesSlice";
import { RootState } from "../rootReducer";

const Play = () => {
  const match = useRouteMatch<{ id: string }>();
  const { id } = match.params;
  const dispatch = useDispatch();
  const { holes, isLoading, error } = useSelector(
    (state: RootState) => state.courses
  );

  useEffect(() => {
    dispatch(fetchCoursesWithHolesThunk(id));
  }, [dispatch, id]);

  return (
    <Page>
      {isLoading && <div className="loading" />}
      {error && <div className="error">{error}</div>}
      {holes && holes.length > 0 && <HoleView holes={holes} />}
    </Page>
  );
};

export default Play;
