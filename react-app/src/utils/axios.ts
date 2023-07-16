import axios from "axios";

export const baseURL: string = "https://wa-toolbox.web.app";
export const apiUrl = axios.create({
  baseURL,
  withCredentials: true,
});
