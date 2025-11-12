import api from "../../axiosconfig";

const createAccount = async (data) => {
  const res = await api.post("/accounts/create", data);
  return res.data;
};

const getAllAccount= async (payload) => {
  const { companyId, search = "", limit = 10, page = 1 } = payload;

  const quaryParams = new URLSearchParams({
    companyId: companyId,
    limit: limit,
    page: page,
  });
  if (search) {
    quaryParams.append("search", search);
  }

  const res = await api.get("/accounts/list", { params: quaryParams });
  return res.data;
};
const getAccountById = async (id, companyId) => {
  const res = await api.get(`/accounts/${id}?companyId=${companyId}`);
  return res.data;
};

const getAccountsByCompany = async (companyId) => {
  const res = await api.get(`/accounts?companyId=${companyId}`);
  return res.data;
};


const accountService = {
  createAccount,
  getAllAccount,
  getAccountById,
  getAccountsByCompany
};

export default accountService;
