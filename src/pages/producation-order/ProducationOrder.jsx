import React, { useEffect, useState } from "react";
import {
    Card,
    Row,
    Col,
    Button,
    Input,
    Space,
    message,
    Popconfirm,
    Select,
    Modal,
} from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CustomTable from "../../component/commonComponent/CustomTable";
import Icons from "../../assets/icon";
import { getItem, deleteItem } from "../../redux/slice/item/itemSlice";
import { filteredURLParams, getQueryParams } from "../../utlis/services";
import { filterInputEnum } from "../../utlis/constants";
import FilterInput from "../../component/commonComponent/FilterInput";
import { getcategory } from "../../redux/slice/category/categorySlice";
import { deleteProducationOrder, getProducationOrder } from "../../redux/slice/producation/producationSlice";


const ProducationOrder = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { producationOrder, loading, pagination, deleteLoading } = useSelector((state) => state.producation);
    const [searchParams, setSearchParams] = useSearchParams();
    const { categorys } = useSelector((state) => state.category);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalData, setModalData] = useState([]);


    // const [filter, setFilter] = useState({
    //     search: searchParams.get("search") || "",
    //     categoryId: searchParams.get("categoryId") || null,
    // });

    const { companyId } = useSelector((state) => state.auth);

    const fetchItem = (signal) => {
        const page = parseInt(searchParams?.get("page")) || 1;
        const pageSize = parseInt(searchParams?.get("limit")) || pagination.limit;

        let payload = getQueryParams(window.location.href);

        if (Object.keys(payload)?.length <= 0) {
            payload = { companyId, page, limit: pageSize };
        }

        if (!payload?.companyId) {
            payload = {
                ...payload,
                companyId,
            };
        }
        dispatch(getProducationOrder({ ...payload }));
    };
    useEffect(() => {
        const controller = new AbortController();
        fetchItem(controller.signal);
        return () => controller.abort();
    }, [dispatch, companyId, searchParams]);

    // useEffect(() => {
    //     if (companyId) {
    //         dispatch(getcategory({ companyId }));
    //     }
    // }, [dispatch, companyId]);

    // const updateUrlParams = (newParams) => {
    //     const params = new URLSearchParams(searchParams);
    //     const filterParams = filteredURLParams(params, newParams);
    //     setSearchParams(filterParams);
    // };
    // const handleSearch = () => {
    //     const searchValue = filter.search ? String(filter.search) : "";
    //     const categoryId = filter.categoryId ? String(filter.categoryId) : "";
    //     updateUrlParams({ companyId, page: 1, limit: 10, search: searchValue, categoryId, });
    // };

    // const handleClear = () => {
    //     updateUrlParams({ companyId, page: 1, limit: 10, search: "", categoryId: "" });
    //     setFilter({
    //         search: "",
    //         categoryId: null,
    //     });
    // };

    const handlePaginationChange = (page, pageSize) => {
        updateUrlParams({ page, limit: pageSize });
    };

    const openModal = (title, data) => {
        setModalTitle(title);
        setModalData(data);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalTitle("");
        setModalData([]);
    };


    const columns = [
        {
            title: "Production Order No",
            dataIndex: "productionOrderNo",
            key: "productionOrderNo",
            onHeaderCell: () => ({
                style: { fontSize: 16, fontWeight: 700, color: "#001529" },
            }),
        },
        {
            title: "Date",
            dataIndex: "date",
            key: "date",
            render: (date) => (date ? new Date(date).toLocaleDateString() : "-"),
            onHeaderCell: () => ({
                style: { fontSize: 16, fontWeight: 700, color: "#001529" },
            }),
        },
        {
            title: "Raw Materials",
            dataIndex: "rawMaterials",
            key: "rawMaterials",
            render: (rawMaterials) => {
                if (!rawMaterials || rawMaterials.length === 0) return "-";

                const firstTwo = rawMaterials.slice(0, 2);

                return (
                    <div>
                        <ul style={{ margin: 0, paddingLeft: 16 }}>
                            {firstTwo.map((rm) => (
                                <li key={rm._id}>
                                    {rm.itemId?.name || "-"} ({rm.quantity})
                                </li>
                            ))}
                        </ul>

                        {rawMaterials.length > 2 && (
                            <Button
                                type="link"
                                onClick={() =>
                                    openModal("Raw Materials", rawMaterials)
                                }
                            >
                                View More
                            </Button>
                        )}
                    </div>
                );
            },
        },
        {
            title: "Finished Goods",
            dataIndex: "finishedGoods",
            key: "finishedGoods",
            render: (finishedGoods) => {
                if (!finishedGoods || finishedGoods.length === 0) return "-";

                const firstTwo = finishedGoods.slice(0, 2);

                return (
                    <div>
                        <ul style={{ margin: 0, paddingLeft: 16 }}>
                            {firstTwo.map((fg) => (
                                <li key={fg._id}>
                                    {fg.itemId?.name || "-"} ({fg.quantity})
                                </li>
                            ))}
                        </ul>

                        {finishedGoods.length > 2 && (
                            <Button
                                type="link"
                                onClick={() =>
                                    openModal("Finished Goods", finishedGoods)
                                }
                            >
                                View More
                            </Button>
                        )}
                    </div>
                );
            },
        },
        // {
        //     title: "Available Stock",
        //     key: "availableStock",
        //     render: (_, record) => {
        //         // sum of availableStock from finishedGoods (or rawMaterials)
        //         const totalStock =
        //             record?.finishedGoods?.reduce(
        //                 (sum, fg) => sum + (fg.itemId?.availableStock || 0),
        //                 0
        //             ) || 0;
        //         return totalStock > 0 ? totalStock : "-";
        //     },
        //     onHeaderCell: () => ({
        //         style: { fontSize: 16, fontWeight: 700, color: "#001529" },
        //     }),
        // },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <Space>
                    <Button
                        type="default"
                        icon={<Icons.EyeOutlined />}
                        onClick={() => navigate(`/producation-order/view/${record._id}`)}
                    />
                    <Popconfirm
                        title="Are you sure you want to delete this item?"
                        okText="Yes"
                        okButtonProps={{ loading: deleteLoading }}
                        cancelText="No"
                        onConfirm={async () => {
                            try {
                                await dispatch(deleteProducationOrder(record._id)).unwrap();
                                dispatch(getProducationOrder({ companyId }));
                            } catch (err) {
                                message.error(err || "Failed to delete item");
                            }
                        }}
                    >
                        <Button type="default" danger icon={<Icons.DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            ),
            onHeaderCell: () => ({
                style: { fontSize: 16, fontWeight: 700, color: "#001529" },
            }),
        },
    ];


    const categoryOptions =
        categorys && Array.isArray(categorys) && categorys.length
            ? categorys.map((c) => ({
                label: c.name || c.categoryName || c.title || "Unnamed",
                value: c._id || c.id,
            }))
            : [];

    return (
        <div className="m-4">
            {/* Header */}
            <Card style={{ marginBottom: 16 }} bodyStyle={{ padding: "12px 20px" }}>
                <Row align="middle" justify="space-between">
                    <Col>
                        <div className="text-xl font-semibold">View Production Order</div>
                    </Col>
                    <Col>
                        <Space size="middle">
                            <Button
                                type="primary"
                                icon={<Icons.PlusCircleOutlined />}
                                size="middle"
                                onClick={() => navigate("/producation-order/add")}
                            >
                                Add Production Order
                            </Button>
                        </Space>
                    </Col>
                </Row>
            </Card>

            {/* Search / Filter */}
            {/* <Card style={{ marginBottom: 16 }}>
                <Row gutter={16} align="middle">
                    <Col span={10}>
                        <FilterInput
                            type={filterInputEnum?.SEARCH}
                            name={"search"}
                            placeHolder="Search..."
                            value={filter?.search}
                            setFilter={setFilter}
                            onSerch={handleSearch}
                            onClear={handleClear}
                        />
                    </Col>
                    <Col span={14} style={{ textAlign: "right" }}>
                        <Space>
                            <div className="w-44">
                                <Select
                                    showSearch
                                    placeholder="Select Catgory"
                                    loading={false}
                                    className="w-full"
                                    value={filter.categoryId ?? null}
                                    onChange={(value) => setFilter((prev) => ({ ...prev, categoryId: value }))}
                                    onClear={() => {
                                        setFilter(prev => ({ ...prev, categoryId: null }));
                                        updateUrlParams({ companyId, page: 1, limit: 10, categoryId: "" });
                                    }}
                                    allowClear
                                    size="large"
                                    optionFilterProp="label"
                                    dropdownStyle={{ textAlign: "left" }}
                                    style={{ textAlign: "left" }}
                                    options={
                                        categoryOptions.length
                                            ? categoryOptions
                                            : [
                                                {
                                                    label: "No categories available",
                                                    value: "",
                                                    disabled: true,
                                                },
                                            ]
                                    }
                                />
                            </div>
                            <Button
                                type="primary"
                                icon={<Icons.FilterOutlined />}
                                size="middle"
                                onClick={handleSearch}
                            >
                                Apply Filter
                            </Button>
                        </Space>
                    </Col>
                </Row>
            </Card> */}

            {/* Table */}
            <Card>
                <CustomTable
                    tableId="itemId"
                    columns={columns}
                    data={producationOrder || []}
                    loading={loading}
                    pagination={{
                        current: pagination.page || 1,
                        pageSize: pagination.limit || 10,
                        total: pagination.total || 0,
                        onChange: handlePaginationChange,
                    }}
                />
            </Card>
            <Modal
                title={
                    <div
                        style={{
                            fontSize: 20,
                            fontWeight: 700,
                            color: "#111",
                            paddingBottom: 4,
                        }}
                    >
                        {modalTitle}
                    </div>
                }
                open={isModalOpen}
                onCancel={closeModal}
                footer={null}
                bodyStyle={{
                    maxHeight: "65vh",
                    overflowY: "auto",
                    padding: "0",
                }}
            >
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 100px",
                        padding: "14px 22px",
                        background: "#fafafa",
                        borderBottom: "1px solid #eee",
                        fontSize: 15,
                        fontWeight: 600,
                        color: "#444",
                        position: "sticky",
                        top: 0,
                        zIndex: 10,
                    }}
                >
                    <div>Item Name</div>
                    <div style={{ textAlign: "right" }}>Quantity</div>
                </div>
                {modalData.map((item) => (
                    <div
                        key={item._id}
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 100px",
                            padding: "14px 22px",
                            fontSize: 15,
                            borderBottom: "1px solid #f2f2f2",
                            transition: "background 0.2s",
                            cursor: "default",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#f9f9f9")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                        <div style={{ color: "#333" }}>{item?.itemId?.name || "-"}</div>
                        <div style={{ fontWeight: 600, textAlign: "right" }}>
                            {item?.quantity}
                        </div>
                    </div>
                ))}
            </Modal>
        </div>
    )
}

export default ProducationOrder