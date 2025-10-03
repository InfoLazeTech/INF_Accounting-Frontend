// src/redux/service/customerVendorService.js
import api from "../../axiosconfig";

const createCustomerVendor = async (data) => {
  const res = await api.post("/customer/create", data);
  return res.data;
};

const getAllCustomerVendors = async (paylod) => {
  const { companyId, search = "", limit = 10, page = 1 } = paylod;

  const quaryParams = new URLSearchParams({
    companyId: companyId,
    limit: limit,
    page: page,
  });
  if(search) {
    quaryParams.append('search', search)
  }

  const res = await api.get("/customer/get", { params: quaryParams });
  return res.data;
};

const getCustomerVendorById = async (id) => {
  const res = await api.get(`/customer/${id}`);
  return res.data;
};

const updateCustomerVendor = async (customerId, data) => {
  const res = await api.put(`/customer/${customerId}`, data);
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
