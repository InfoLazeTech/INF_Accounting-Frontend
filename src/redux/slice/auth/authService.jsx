import api from "../../axiosconfig";

const API_URL = "/auth";

export const register = async (userData) => {
  const res = await api.post(`${API_URL}/register`, userData);
  return res.data;
};

export const login = async (credentials) => {
  const res = await api.post(`${API_URL}/login`, credentials);
  return res.data;
};

export const logout = async () => {
  // You can add backend logout if needed
  return Promise.resolve();
};
