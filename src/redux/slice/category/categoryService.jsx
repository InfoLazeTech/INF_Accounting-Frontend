// src/redux/service/customerVendorService.js
import api from "../../axiosconfig";

const createCategory= async (data) => {
  const res = await api.post("/item-category/create", data);
  return res.data;
};

const getAllCategory = async (payload) => {
    const { companyId} = payload;
    
  const quaryParams = new URLSearchParams({
    companyId: companyId,
  });
  const res = await api.get("/item-category/get",{ params: quaryParams });
  return res.data;
};

const getCategoryById = async (id) => {
  const res = await api.get(`/item-category/${id}`);
  return res.data;
};

const updateCategory = async (id, data) => {
  const res = await api.put(`/item-category/${id}`, data);
  return res.data;
};

const deleteCategory = async (id) => {
  const res = await api.delete(`/item-category/${id}`);
  return res.data;
};

const categoryService = {
  createCategory,
  getAllCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
};

export default categoryService;
