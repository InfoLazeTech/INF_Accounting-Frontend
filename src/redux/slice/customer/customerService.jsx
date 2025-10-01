// src/redux/service/customerVendorService.js
import api from "../../axiosconfig";

const createCustomerVendor = async (data) => {
  const res = await api.post("/customer/create", data);
  return res.data;
};

const getAllCustomerVendors = async () => {
  const res = await api.get("/customer/get");
  return res.data;
};

const getCustomerVendorById = async (id) => {
  const res = await api.get(`/customer/${id}`);
  return res.data;
};

const updateCustomerVendor = async (id, data) => {
  const res = await api.put(`/customer/${id}`, data);
  return res.data;
};

const deleteCustomerVendor = async (id) => {
  const res = await api.delete(`/customer/${id}`);
  return res.data;
};

const customerService = {
  createCustomerVendor,
  getAllCustomerVendors,
  getCustomerVendorById,
  updateCustomerVendor,
  deleteCustomerVendor,
};

export default customerService;
