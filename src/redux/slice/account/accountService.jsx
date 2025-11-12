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
 return {
    data: res.data.data,
    extras: {
      pagination: {
        currentPage: res.data.extras.page,
        totalPages: res.data.extras.totalPages,
        limit: res.data.extras.limit,
        totalCount: res.data.extras.total,
      },
    },
  };
};
const getAccountById = async (id, companyId) => {
  const res = await api.get(`/accounts/${id}?companyId=${companyId}`);
  return res.data;
};

const getAccountsByCompany = async (companyId) => {
  const res = await api.get(`/accounts?companyId=${companyId}`);
  return res.data;
};
const updateAccount = async ({ accountId, data }) => {
  const res = await api.put(`/accounts/${accountId}`, data);
  return res.data;
};

const deleteAccount = async (accountId) => {
  const res = await api.delete(`/accounts/${accountId}`);
  return res.data;
};

const accountService = {
  createAccount,
  getAllAccount,
  getAccountById,
  getAccountsByCompany,
  updateAccount,
  deleteAccount
};

export default accountService;
