
import api from "../../axiosconfig";

const getSalesReport = async (payload) => {
  const {
    companyId,
    page = 1,
    limit = 10,
    search = "",
    customerId = "",
    startDate = "",
    endDate = "",
    status = "",
  } = payload;

  const queryParams = new URLSearchParams({
    companyId,
    page,
    limit 
  });

  if (search) queryParams.append("search", search);
  if (customerId) queryParams.append("customerId", customerId);
  if (startDate) queryParams.append("startDate", startDate);
  if (endDate) queryParams.append("endDate", endDate);
  if (status) queryParams.append("status", status);

  const res = await api.get("/report/sales", { params: queryParams });
  return res.data;
};


const getSalesSummary = async (payload) => {
  const {
    companyId,
    customerId = "",
    startDate = "",
    endDate = "",
    status = "",
  } = payload;

  const queryParams = new URLSearchParams({ companyId });

  if (customerId) queryParams.append("customerId", customerId);
  if (startDate) queryParams.append("startDate", startDate);
  if (endDate) queryParams.append("endDate", endDate);
  if (status) queryParams.append("status", status);

  const res = await api.get("/report/sales/summary", { params: queryParams });
  return res.data;
};


const getPurchaseReport = async (payload) => {
  const {
    companyId,
    page = 1,
    limit = 10,
    search = "",
    vendorId = "",
    startDate = "",
    endDate = "",
    status = "",
  } = payload;

  const queryParams = new URLSearchParams({
    companyId,
    page: page,
    limit: limit,
  });

  if (search) queryParams.append("search", search);
  if (vendorId) queryParams.append("vendorId", vendorId);
  if (startDate) queryParams.append("startDate", startDate);
  if (endDate) queryParams.append("endDate", endDate);
  if (status) queryParams.append("status", status);

  const res = await api.get("/report/purchase", { params: queryParams });
  return res.data;
};


const getPurchaseSummary = async (payload) => {
  const {
    companyId,
    vendorId = "",
    startDate = "",
    endDate = "",
    status = "",
  } = payload;

  const queryParams = new URLSearchParams({ companyId });

  if (vendorId) queryParams.append("vendorId", vendorId);
  if (startDate) queryParams.append("startDate", startDate);
  if (endDate) queryParams.append("endDate", endDate);
  if (status) queryParams.append("status", status);

  const res = await api.get("/report/purchase/summary", { params: queryParams });
  return res.data;
};

const reportService = {
  getSalesReport,
  getSalesSummary,
  getPurchaseReport,
  getPurchaseSummary,
};

export default reportService;