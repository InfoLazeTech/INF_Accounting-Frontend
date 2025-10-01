import api from "../../axiosconfig";

// Get company details by ID
const getCompany = async (companyId) => {
  const res = await api.get(`/company/${companyId}`);
  return res.data; // expects { data: { ...companyData } }
};

// Update company details
const updateCompany = async (companyId, data) => {
  const res = await api.put(`/company/${companyId}`, data);
  return res.data;
};

const companyService = {
  getCompany,
  updateCompany,
};

export default companyService;
