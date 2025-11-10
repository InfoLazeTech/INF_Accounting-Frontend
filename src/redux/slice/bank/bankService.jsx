import api from "../../axiosconfig";

const createBank = async (data) => {
    const res = await api.post("/bank/createBank", data);
    return res.data;
};

const getListBank = async (payload) => {
    const {
        search = "",
        limit = 10,
        page = 1,
        companyId
    } = payload;
    const queryParams = new URLSearchParams({
        limit,
        page,
        companyId
    });
    if (search) queryParams.append("search", search);
    const res = await api.get("/bank/listBanks", { params: queryParams });
    return res.data;
};

const createTransaction = async (data) => {
    const res = await api.post("/transaction/addTransaction", data);
    return res.data;
};

const getBankAccount = async (companyId) => {
    const res = await api.get(`/bank/getBankslist?companyId=${companyId}`);
    return res.data;
};

const getTransaction = async (payload) => {
    const { companyId, bankId, startDate, endDate } = payload;

    const queryParams = new URLSearchParams();
    if (startDate && endDate) {
        queryParams.append("startDate", startDate);
        queryParams.append("endDate", endDate);
    }

    const res = await api.get(`/transaction/bank/${bankId}/${companyId}`, { params: queryParams });
    return res.data;
};

const updateTransaction = async (payload) => {
    const { transactionId, description, amount, type, date } = payload;

    const res = await api.put(`/transaction/updateTransaction/${transactionId}`, {
        description,
        amount,
        type,
        date,
    });

    return res.data;
};

const deleteTransaction = async (transactionId) => {
    const res = await api.delete(`/transaction/deleteTransaction/${transactionId}`);
    return res.data;
};

const bankService = {
    createBank,
    getListBank,
    createTransaction,
    getBankAccount,
    getTransaction,
    updateTransaction,
    deleteTransaction
}

export default bankService;