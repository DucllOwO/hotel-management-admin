import axios from "axios";
import LocalStorage from "../Utils/localStorage";

const BASE_URL = "https://hotel-management-admin.onrender.com";
//http://localhost:1205/api
//https://hotel-management-admin.onrender.com
export const publicRequest = axios.create({
  baseURL: BASE_URL,
});

export const userRequest = axios.create({
  baseURL: BASE_URL,
});
