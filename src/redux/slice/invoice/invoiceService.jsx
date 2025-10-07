import api from "../../axiosconfig";

const createInvoice =async (data)=>
{
    const res = await api.post('/invoice',data);
    return res.data;
}
const getAllInvoices = async (payload) => {
  const {
    companyId,
    search = "",
    limit = 10,
    page = 1,
    status,
    customerId,
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
  if (customerId) queryParams.append("customerId", customerId);
  if (startDate && endDate) {
    queryParams.append("startDate", startDate);
    queryParams.append("endDate", endDate);
  }
  const res = await api.get("/invoice", { params: queryParams });
  return res.data;
};

const getInvoiceById = async (payload) => {
  const { companyId, invoiceId } = payload;

  const queryParams = new URLSearchParams({
    companyId: companyId,
  });

  const res = await api.get(`/invoice/${invoiceId}`, { params: queryParams });
  return res.data;
};

const updateInvoice = async (invoiceId, data) => {
  const res = await api.put(`/invoice/${invoiceId}`, data);
  return res.data;
};

const deleteInvoice = async (invoiceId) => {
  const res = await api.delete(`/invoice/${invoiceId}`);
  return res.data;
};

const updateInvoiceStatus = async (invoiceId, data) => {
  const res = await api.patch(`/invoice/${invoiceId}/status`, data);
  return res.data;
};

const recordPayment = async (invoiceId, data) => {
  const res = await api.patch(`/invoice/${invoiceId}/payment`, data);
  return res.data;
};


const getRevenueSummary = async (payload) => {
  const { companyId } = payload;
  const queryParams = new URLSearchParams({ companyId });
  const res = await api.get("/invoice/summary/revenue", { params: queryParams });
  return res.data;
};

const getOverdueInvoices = async (payload) => {
  const { companyId } = payload;
  const queryParams = new URLSearchParams({ companyId });
  const res = await api.get("/invoice/overdue/list", { params: queryParams });
  return res.data;
};

const getInvoicesByStatus = async (payload) => {
  const { companyId, status } = payload;
  const queryParams = new URLSearchParams({ companyId, status });
  const res = await api.get("/invoice/status/list", { params: queryParams });
  return res.data;
};

const getInvoicesByCustomer = async (payload) => {
  const { companyId, customerId } = payload;
  const queryParams = new URLSearchParams({ companyId, customerId });
  const res = await api.get("/invoice/customer/list", { params: queryParams });
  return res.data;
};

const getInvoicesByDateRange = async (payload) => {
  const { companyId, startDate, endDate } = payload;
  const queryParams = new URLSearchParams({ companyId, startDate, endDate });
  const res = await api.get("/invoice/date-range/list", { params: queryParams });
  return res.data;
};

const getTopCustomersByRevenue = async (payload) => {
  const { companyId } = payload;
  const queryParams = new URLSearchParams({ companyId });
  const res = await api.get("/invoice/analytics/top-customers", { params: queryParams });
  return res.data;
};

const getMonthlyRevenueTrend = async (payload) => {
  const { companyId } = payload;
  const queryParams = new URLSearchParams({ companyId });
  const res = await api.get("/invoice/analytics/revenue-trend", { params: queryParams });
  return res.data;
};

const invoiceService = {
  createInvoice,
  getAllInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
  updateInvoiceStatus,
  recordPayment,
  getRevenueSummary,
  getOverdueInvoices,
  getInvoicesByStatus,
  getInvoicesByCustomer,
  getInvoicesByDateRange,
  getTopCustomersByRevenue,
  getMonthlyRevenueTrend,
};

export default invoiceService;