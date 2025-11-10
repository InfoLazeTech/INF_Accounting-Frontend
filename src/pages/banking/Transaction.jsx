import { useState, useEffect } from "react";
import { Card, Row, Col, Button, Space, Tag, DatePicker, Skeleton, Popconfirm, Form, Modal, Input, Select } from "antd";
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
import { deleteTransaction, getBankDropdown, getTransaction, updateTransaction } from "../../redux/slice/bank/bankSlice";

const { RangePicker } = DatePicker;

function Transaction() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { bankId } = useParams();
    const [selectedBankId, setSelectedBankId] = useState(bankId);
    const [searchParams, setSearchParams] = useSearchParams();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editData, setEditData] = useState(null);
    const [form] = Form.useForm();

    const [filter, setFilter] = useState({
        startDate: searchParams.get("startDate") || "",
        endDate: searchParams.get("endDate") || "",
    });

    const { transactions, loading, bankData, bankDropdown, postLoading, deleteLoading } = useSelector((state) => state.bank);
    const { companyId } = useSelector((state) => state.auth);

    console.log("transactions", transactions);

    useEffect(() => {
        if (companyId) {
            dispatch(getBankDropdown({ companyId }));
        }
    }, [companyId]);


    useEffect(() => {
        if (!companyId || !bankId) return;

        dispatch(getTransaction({ companyId, bankId, startDate: "", endDate: "" }));
    }, [companyId]);

    useEffect(() => {
        if (!filter.startDate && !filter.endDate) {
            const startOfMonth = dayjs().startOf("month").format("YYYY-MM-DD");
            const endOfMonth = dayjs().endOf("month").format("YYYY-MM-DD");

            setFilter({
                startDate: startOfMonth,
                endDate: endOfMonth,
            });

            // Also load with default month range
            if (companyId && selectedBankId) {
                dispatch(getTransaction({
                    companyId,
                    bankId: selectedBankId,
                    startDate: startOfMonth,
                    endDate: endOfMonth,
                }));
            }
        }
    }, [companyId, selectedBankId]);


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
                bankId: selectedBankId,
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
        dispatch(getTransaction({ companyId, bankId: selectedBankId }));
    };

    const openEditModal = (record) => {
        setEditData(record);
        form.setFieldsValue({
            description: record?.description,
            amount: record?.amount,
            type: record?.type,
            date: dayjs(record?.date),
        });
        setIsModalOpen(true);
    };

    const handleUpdate = async () => {
        try {
            const values = await form.validateFields();
            await dispatch(updateTransaction({
                transactionId: editData._id,
                companyId,
                bankId,
                ...values,
                date: values.date.format("YYYY-MM-DD")
            })).unwrap();

            // message.success("Transaction updated successfully");
            setIsModalOpen(false);
            dispatch(getTransaction({ companyId, bankId }));
        } catch (error) {
            message.error(error || "Update failed");
        }
    };

    const columns = [
        {
            title: "Date",
            dataIndex: "date",
            key: "date",
            render: (date) => dayjs(date).format("DD-MM-YYYY"),
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            render: (text) => text && text.trim() !== "" ? text : "-"
        },
        {
            title: "Credit (₹)",
            key: "credit",
            render: (_, record) =>
                record.type === "credit" ? (
                    <span style={{ color: "green", fontWeight: 600 }}>
                        ₹ {Number(record.amount).toFixed(2)}
                    </span>
                ) : (
                    "-"
                ),
        },
        {
            title: "Debit (₹)",
            key: "debit",
            render: (_, record) =>
                record.type === "debit" ? (
                    <span style={{ color: "red", fontWeight: 600 }}>
                        ₹ {Number(record.amount).toFixed(2)}
                    </span>
                ) : (
                    "-"
                ),
        },
        {
            title: "Available Balance",
            dataIndex: "balance",
            key: "balance",
            render: (val) => `₹ ${Number(val).toFixed(2)}`
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <Space>
                    {/* <Button
                        type="primary"
                        icon={<Icons.EditOutlined />}
                        onClick={() => openEditModal(record)}
                    /> */}
                    <Popconfirm
                        title="Are you sure you want to delete this Transaction?"
                        okText="Yes"
                        cancelText="No"
                        okButtonProps={{ loading: deleteLoading }}
                        onConfirm={async () => {
                            try {
                                await dispatch(deleteTransaction(record._id)).unwrap();
                                dispatch(getTransaction({ companyId, bankId }));
                                message.success("Transaction deleted successfully");
                            } catch (err) {
                                message.error(err || "Failed to delete customer");
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
            <Card style={{ marginBottom: 16 }}>
                <Row gutter={16} align="middle">
                    <Col span={8}>
                        <Select
                            showSearch
                            placeholder="Select Bank"
                            loading={false}
                            className="w-full"
                            allowClear
                            size="middle"
                            optionFilterProp="label"
                            dropdownStyle={{ textAlign: "left" }}
                            style={{ textAlign: "left" }}
                            value={selectedBankId || undefined}
                            onChange={(value) => {
                                setSelectedBankId(value);
                                value ? navigate(`/banking/transaction/${value}`) : navigate(`/banking`);
                            }}
                            options={bankDropdown?.map((bank) => ({
                                label: `${bank.bankName} (${bank.accountNumber})`,
                                value: bank._id,
                            }))}
                        />
                    </Col>
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
            <Modal
                title="Edit Transaction"
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onOk={handleUpdate}
                okText="Update"
                confirmLoading={postLoading}
            >
                <Form layout="vertical" form={form}>
                    <Form.Item label="Description" name="description">
                        <Input placeholder="Enter description" />
                    </Form.Item>

                    <Form.Item label="Amount" name="amount" rules={[{ required: true }]}>
                        <Input type="number" placeholder="Enter amount" />
                    </Form.Item>

                    <Form.Item label="Type" name="type" rules={[{ required: true }]}>
                        <Select disabled>
                            <Select.Option value="credit">Credit</Select.Option>
                            <Select.Option value="debit">Debit</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item label="Date" name="date" rules={[{ required: true }]}>
                        <DatePicker style={{ width: "100%" }} />
                    </Form.Item>
                </Form>
            </Modal>


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