import axios from "axios";

export const baseURL: string = ``;
export const apiRequest = axios.create({
  baseURL,
  withCredentials: true,
});
