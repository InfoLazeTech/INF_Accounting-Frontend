import api from "../../axiosconfig";

const createItem = async (data) => {
  const res = await api.post("/itemMaster/createItem", data);
  return res.data;
};

const getAllItem = async (payload) => {
  const { companyId, search = "", limit = 10, page = 1 } = payload;

  const quaryParams = new URLSearchParams({
    companyId: companyId,
    limit: limit,
    page: page,
  });
  if (search) {
    quaryParams.append("search", search);
  }

  const res = await api.get("/itemMaster/getItem", { params: quaryParams });
  return res.data;
};

const getItemById = async (id) => {
  const res = await api.get(`/itemMaster/${id}`);
  return res.data;
};

const updateItem = async (id, data) => {
  const res = await api.put(`/itemMaster/${id}`, data);
  return res.data;
};

const deleteItem = async (id) => {
  const res = await api.delete(`/itemMaster/${id}`);
  return res.data;
};

const itemService = {
  createItem,
  getAllItem,
  getItemById,
  updateItem,
  deleteItem,
};

export default itemService;
