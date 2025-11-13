import api from "../../axiosconfig";

const createProducationOrder = async (data) => {
    const res = await api.post("/productionOrder/createProductionOrder", data);
    return res.data;
};

const getProducationOrder = async (payload) => {
    const {
        limit = 10,
        page = 1,
        companyId
    } = payload;
    const queryParams = new URLSearchParams({ companyId, limit, page });
    // if (search) queryParams.append("search", search);
    const res = await api.get("/productionOrder/getProductionOrders", { params: queryParams });
    return res.data;
};

export default { getProducationOrder, createProducationOrder };