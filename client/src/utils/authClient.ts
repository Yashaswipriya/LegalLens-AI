import axiosInstance from "../lib/axios";

export const login = async (formData: { email: string; password: string }) => {
  const res = await axiosInstance.post("/auth/login", formData);
  localStorage.setItem("token", res.data.token);
  return res.data;
};

export const signup = async (formData: { name: string; email: string; password: string }) => {
  const res = await axiosInstance.post("/auth/signup", formData);
  localStorage.setItem("token", res.data.token);
  return res.data;
};
