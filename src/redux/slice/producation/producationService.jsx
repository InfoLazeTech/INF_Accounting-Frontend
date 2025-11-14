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

const deleteProducationOrder = async (orderId) => {
    const res = await api.delete(`/productionOrder/deleteProductionOrder/${orderId}`);
    return res.data;
};

const getProducationOrderById = async (orderId) => {
    const res = await api.get(`/productionOrder/getProductionOrder/${orderId}`);
    return res.data;
};

export default { getProducationOrder, createProducationOrder,deleteProducationOrder,getProducationOrderById };