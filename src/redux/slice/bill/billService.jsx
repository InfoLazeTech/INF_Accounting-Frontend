import api from "../../axiosconfig";

const createBill = async (data) => {
  const res = await api.post("/bill", data);
  return res.data;
};

const getAllBills = async (payload) => {
  const {
    companyId,
    search = "",
    limit = 10,
    page = 1,
    status,
    vendorId,
    startDate,
    endDate,
  } = payload;
  const queryParams = new URLSearchParams({
    companyId: companyId,
    limit: limit,
    page: page,
  });
  if (search) queryParams.append("search", search);
  if (status) queryParams.append("status", status);
  if (vendorId) queryParams.append("vendorId", vendorId);
  if (startDate && endDate) {
    queryParams.append("startDate", startDate);
    queryParams.append("endDate", endDate);
  }
  const res = await api.get("/bill", { params: queryParams });
  return res.data;
};

const getBillById = async (payload) => {
  const { companyId, billId } = payload;

  const queryParams = new URLSearchParams({
    companyId: companyId,
  });

  const res = await api.get(`/bill/${billId}`, { params: queryParams });
  return res.data;
};

const updateBill = async (id, data) => {
  const res = await api.put(`/bill/${id}`, data);
  return res.data;
};

const deleteBill = async (id) => {
  const res = await api.delete(`/bill/${id}`);
  return res.data;
};

const updateBillStatus = async (billId, data) => {
  const res = await api.patch(`/bill/${billId}/status`, data);
  return res.data;
};

const recordPayment = async (billId, data) => {
  const res = await api.patch(`/bill/${billId}/payment`, data);
  return res.data;
};

const getBillSummary = async (payload) => {
  const { companyId } = payload;
  const queryParams = new URLSearchParams({ companyId });
  const res = await api.get("/bill/summary/stats", { params: queryParams });
  return res.data;
};

const getOverdueBills = async (payload) => {
  const { companyId } = payload;
  const queryParams = new URLSearchParams({ companyId });
  const res = await api.get("/bill/overdue/list", { params: queryParams });
  return res.data;
};

const billService = {
  createBill,
  getAllBills,
  getBillById,
  updateBill,
  deleteBill,
  updateBillStatus,
  recordPayment,
  getBillSummary,
  getOverdueBills,
};

export default billService;
