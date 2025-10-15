import axios from "axios";

let store = null;

export const setAxiosStore = (reduxStore) => {
  store = reduxStore;
};

const api = axios.create({
  // baseURL: "http://localhost:5000/",
  baseURL: "https://inf-accounting-backend.vercel.app/",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  function (config) {
    const token = store ? store.getState().auth.token : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default api;
