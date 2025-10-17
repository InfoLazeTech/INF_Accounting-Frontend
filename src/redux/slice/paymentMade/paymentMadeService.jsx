import api from "../../axiosconfig";

const createPaymentMade = async (data) => {
  const res = await api.post('/payment/create', data);
  return res.data;
};

const getAllPaymentMade = async (payload) => {
  const {
    companyId,
    search = "",
    limit = 10,
    page = 1,
    status,
    partyId,
    startDate,
    endDate,
  } = payload;
  
  const queryParams = new URLSearchParams({
    companyId: companyId,
    limit: limit,
    page: page,
    paymentType: "paymentMade"
  });
  
  if (search) queryParams.append("search", search);
  if (status) queryParams.append("status", status);
  if (partyId) queryParams.append("partyId", partyId);
  if (startDate && endDate) {
    queryParams.append("startDate", startDate);
    queryParams.append("endDate", endDate);
  }
  
  const res = await api.get("payment/get", { params: queryParams });
  return res.data;
};

const getPaymentMadeById = async (paymentId, companyId) => {
  const queryParams = new URLSearchParams({
    companyId: companyId,
  });
  
  const res = await api.get(`/payment/${paymentId}`, { params: queryParams });
  return res.data;
};

const updatePaymentMade = async (paymentId, data) => {
  const res = await api.put(`/payment/${paymentId}`, data);
  return res.data;
};

const deletePaymentMade = async (paymentId) => {
  const res = await api.delete(`payment/${paymentId}`);
  return res.data;
};

const getPaymentSummary = async (payload) => {
  const { companyId, startDate, endDate } = payload;
  const queryParams = new URLSearchParams({
    companyId,
    startDate,
    endDate,
    paymentType: "paymentMade"
  });
  
  const res = await api.get("/payment/summary/stats", { params: queryParams });
  return res.data;
};

const getPaymentsByParty = async (payload) => {
  const { companyId, partyId, paymentType } = payload;
  const queryParams = new URLSearchParams({
    companyId,
    partyId,
    paymentType: "paymentMade"
  });
  
  const res = await api.get("/payment/party/list", { params: queryParams });
  return res.data;
};

const paymentReceivedService = {
  createPaymentMade,
  getAllPaymentMade,
  getPaymentMadeById,
  updatePaymentMade,
  deletePaymentMade,
  getPaymentSummary,
  getPaymentsByParty,
};

export default paymentReceivedService;