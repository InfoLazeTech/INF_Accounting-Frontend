import api from "../../axiosconfig";

const createItem = async (data) => {
  const res = await api.post("/item-master/createItem", data);
  return res.data;
};

const getAllItem = async (payload) => {
  const { companyId, search = "", limit = 10, page = 1, categoryId = "" } = payload;

  const quaryParams = new URLSearchParams({
    companyId: companyId,
    limit: limit,
    page: page,
  });
  if (search) {
    quaryParams.append("search", search);
  }
  if (categoryId) {
    quaryParams.append("categoryId", categoryId);
  }

  const res = await api.get("/item-master/getItem", { params: quaryParams });
  return res.data;
};

const getItemById = async (id) => {
  const res = await api.get(`/item-master/${id}`);
  return res.data;
};

const updateItem = async (id, data) => {
  const res = await api.put(`/item-master/${id}`, data);
  return res.data;
};

const deleteItem = async (id) => {
  const res = await api.delete(`/item-master/${id}`);
  return res.data;
};

const addStock = async (data) => {
  const res = await api.post("/item-configuration/add-stock", data);
  return res.data;
};

const removeStock = async (data) => {
  const res = await api.post("/item-configuration/remove-stock", data);
  return res.data;
};

const itemService = {
  createItem,
  getAllItem,
  getItemById,
  updateItem,
  deleteItem,
  addStock,
  removeStock
};

export default itemService;
