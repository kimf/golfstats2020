export const API_URL = process.env.REACT_APP_API_URL;

export type KeyPoint = {
  type: string;
  lat: number;
  lng: number;
};

export type Hole = {
  id: string;
  number: number;
  par: number;
  keypoints: KeyPoint[];
};

export type Course = {
  id: string;
  name: string;
  par: number;
  holesCount: number;
  holes: Hole[];
};

export async function fetchCourses() {
  const res = await fetch(`${API_URL}/courses`);
  const courses = await res.json();
  return courses as Course[];
}

export async function fetchCourseWithHoles(courseId: string) {
  const res = await (
    await fetch(`${API_URL}/courses/${courseId}?_embed=holes`)
  ).json();
  return res as Course;
}
