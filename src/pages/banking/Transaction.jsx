import { useState, useEffect } from "react";
import { Card, Row, Col, Button, Space, Tag, DatePicker, Skeleton, Popconfirm } from "antd";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import CustomTable from "../../component/commonComponent/CustomTable";
import Icons from "../../assets/icon";
import { useDispatch, useSelector } from "react-redux";
import {
    getCustomerReports,
    getCustomerSummary,
    resetCustomerReport,
} from "../../redux/slice/reports/customerReportSlice";
import { filteredURLParams, getQueryParams } from "../../utlis/services";
import FilterInput from "../../component/commonComponent/FilterInput";
import { filterInputEnum } from "../../utlis/constants";
import dayjs from "dayjs";
import { getTransaction } from "../../redux/slice/bank/bankSlice";

const { RangePicker } = DatePicker;

function Transaction() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { bankId } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();

    const [filter, setFilter] = useState({
        startDate: searchParams.get("startDate") || "",
        endDate: searchParams.get("endDate") || "",
    });

    const { transactions, loading, bankData } = useSelector((state) => state.bank);
    const { companyId } = useSelector((state) => state.auth);

    console.log("transactions", transactions);

    useEffect(() => {
        if (!companyId || !bankId) return;

        dispatch(getTransaction({ companyId, bankId }));
    }, [companyId, bankId]);


    const updateUrlParams = (newParams) => {
        const params = new URLSearchParams(searchParams);
        const filterParams = filteredURLParams(params, newParams);
        setSearchParams(filterParams);
    };

    const handleSearch = () => {
        updateUrlParams({
            startDate: filter.startDate,
            endDate: filter.endDate,
        });

        dispatch(
            getTransaction({
                companyId,
                bankId,
                startDate: filter.startDate || undefined,
                endDate: filter.endDate || undefined,
            })
        );
    };


    const handleDateChange = (dates) => {
        if (dates && dates[0] && dates[1]) {
            setFilter({
                ...filter,
                startDate: dates[0].format("YYYY-MM-DD"),
                endDate: dates[1].format("YYYY-MM-DD"),
            });
        } else {
            setFilter({ ...filter, startDate: "", endDate: "" });
        }
    };

    const handleClear = () => {
        setFilter({ startDate: "", endDate: "" });
        updateUrlParams({
            startDate: "",
            endDate: "",
        });
        dispatch(getTransaction({ companyId, bankId }));
    };

    const columns = [
        {
            title: "Date",
            dataIndex: "date",
            key: "date",
            render: (date) => dayjs(date).format("DD-MM-YYYY"),
        },
        {
            title: "Type",
            dataIndex: "type",
            key: "type",
            render: (type) => (
                <Tag color={type === "credit" ? "green" : "red"}>
                    {type?.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: "Amount",
            dataIndex: "amount",
            key: "amount",
            render: (val, record) => (
                <span style={{ color: record.type === "credit" ? "green" : "red" }}>
                    ₹ {Number(val).toFixed(2)}
                </span>
            )
        },
        {
            title: "Available Balance",
            dataIndex: "balance",
            key: "balance",
            render: (val) => `₹ ${Number(val).toFixed(2)}`
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            render: (text) => text && text.trim() !== "" ? text : "-"
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <Space>
                    <Button
                        type="primary"
                        icon={<Icons.EditOutlined />}
                        // onClick={() => navigate(`/customer/edit/${record._id}`)}
                    />
                    <Popconfirm
                        title="Are you sure you want to delete this customer?"
                        okText="Yes"
                        disabled
                        cancelText="No"
                        // okButtonProps={{ loading: deleteLoading }}
                        // onConfirm={async () => {
                        //     try {
                        //         await dispatch(deleteCustomerVendor(record._id)).unwrap();
                        //         message.success("Customer deleted successfully");
                        //     } catch (err) {
                        //         message.error(err || "Failed to delete customer");
                        //     }
                        // }}
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

    return (
        <div className="m-4">
            {/* Header */}
            <Card style={{ marginBottom: 16 }} bodyStyle={{ padding: "12px 20px" }}>
                <Row align="middle">
                    <Col>
                        <Button
                            type="text"
                            icon={<Icons.ArrowLeftOutlined />}
                            onClick={() => navigate("/banking")}
                            style={{ marginRight: 8 }}
                        />
                    </Col>
                    <Col>
                        <div className="text-xl font-semibold">Bank Transaction Reports</div>
                    </Col>
                </Row>
            </Card>
            {loading ? (
                <Row gutter={16} style={{ marginBottom: 16 }}>
                    {[1, 2, 3, 4].map((i) => (
                        <Col span={6} key={i}>
                            <Card>
                                <Skeleton active paragraph={{ rows: 1 }} />
                            </Card>
                        </Col>
                    ))}
                </Row>
            ) : (
                <Row gutter={16} style={{ marginBottom: 16 }}>
                    <Col span={6}>
                        <Card>
                            <div className="text-sm text-gray-500">Bank Name</div>
                            <div className="text-2xl font-bold">
                                {bankData?.bankName}
                            </div>
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card>
                            <div className="text-sm text-gray-500">Account Number</div>
                            <div className="text-2xl font-bold text-green-600">
                                {bankData?.BankAccountNo}
                            </div>
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card>
                            <div className="text-sm text-gray-500">Opening Balance</div>
                            <div className="text-2xl font-bold">
                                ₹{Number(bankData?.openingBalance).toFixed(2)}
                            </div>
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card>
                            <div className="text-sm text-gray-500">Closing Balance</div>
                            <div className="text-2xl font-bold">
                                ₹{Number(bankData?.closingBalance).toFixed(2)}
                            </div>
                        </Card>
                    </Col>
                </Row>
            )}
            <Card style={{ marginBottom: 16 }}>
                <Row gutter={16} align="middle">
                    <Col span={8}>
                        <RangePicker
                            style={{ width: "100%" }}
                            value={
                                filter.startDate
                                    ? [dayjs(filter.startDate), dayjs(filter.endDate)]
                                    : null
                            }
                            onChange={handleDateChange}
                            format="YYYY-MM-DD"
                        />
                    </Col>
                    <Col span={8} style={{ textAlign: "right" }}>
                        <Space>
                            <Button
                                type="default"
                                icon={<Icons.ClearOutlined />}
                                onClick={handleClear}
                            >
                                Clear All
                            </Button>
                            <Button
                                type="primary"
                                icon={<Icons.FilterOutlined />}
                                onClick={handleSearch}
                            >
                                Apply Filter
                            </Button>
                        </Space>
                    </Col>
                </Row>
            </Card>

            {/* Table */}
            <Card>
                <CustomTable
                    // tableId="customerId"
                    data={transactions || []}
                    loading={loading}
                    columns={columns}
                    pagination={false}
                />
            </Card>
        </div>
    )
}

export default Transaction