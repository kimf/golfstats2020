import { gretch } from "gretchen";
export const API_URL = "http://localhost:3002";

export type Point = [number, number];

export type Hole = {
  id: string;
  number: number;
  par: number;
  keypoints: Point[];
};

export type Course = {
  id: string;
  name: string;
  holes: Hole[];
};

export async function fetchCourses() {
  const res = await gretch<Course[]>(`${API_URL}/courses?_embed=holes`).json();
  console.log(res);
  if (res.error) {
    throw new Error(res.error);
  }
  if (res.data) {
    return res.data;
  }
  throw new Error("No, error, but undefined data");
}
