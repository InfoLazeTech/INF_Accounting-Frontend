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
} from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CustomTable from "../../component/commonComponent/CustomTable";
import Icons from "../../assets/icon";
import {
    getInvoices,
    deleteInvoice,
} from "../../redux/slice/invoice/invoiceSlice";
import { filteredURLParams, getQueryParams } from "../../utlis/services";
import { filterInputEnum } from "../../utlis/constants";
import FilterInput from "../../component/commonComponent/FilterInput";
import { getCustomerDropdown } from "../../redux/slice/customer/customerVendorSlice";
import { getItem } from "../../redux/slice/item/itemSlice";
import { getItemSalesDetail } from "../../redux/slice/reports/itemReportsSlice";

const { Search } = Input;

function ItemReport() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const { dropdownCustomers, dropLoading } = useSelector(
        (state) => state.customerVendor
    );
    const { companyId } = useSelector((state) => state.auth);

    const { items, loading, postLoading } = useSelector((state) => state.item);
    const { itemSalesDetail, loading: reportLoading } = useSelector((state) => state.itemReport);

    useEffect(() => {
        if (!companyId) return;
        dispatch(getCustomerDropdown({ companyId }));
    }, [dispatch, companyId]);

    useEffect(() => {
        dispatch(getItem({ companyId }));
    }, [dispatch, companyId]);

    const handleApplyFilter = () => {
        if (!selectedItem) {
            message.warning("Please select an Item");
            return;
        }

        const payload = {
            companyId,
            itemId: selectedItem,
            customerId: selectedCustomer,
            page: 1,
            limit: 10,
        };

        console.log("Payload Sent to API:", payload);

        dispatch(getItemSalesDetail(payload));
    };

    const columns = [
        {
            title: "INVOICE#",
            dataIndex: "invoiceNumber",
            key: "invoiceNumber",
            onHeaderCell: () => ({
                style: { fontSize: 16, fontWeight: 700, color: "#001529" },
            }),
        },
        {
            title: "Invoice Date",
            dataIndex: "invoiceDate",
            key: "invoiceDate",
            render: (date) => (date ? new Date(date).toLocaleDateString() : "-"),
            onHeaderCell: () => ({
                style: { fontSize: 16, fontWeight: 700, color: "#001529" },
            }),
        },
        {
            title: "Customer Name",
            dataIndex: "customerName",
            key: "customerName",
            render: (name) => (name ? name : "-"),
            onHeaderCell: () => ({
                style: { fontSize: 16, fontWeight: 700, color: "#001529" },
            }),
        },
        // {
        //   title: "Status",
        //   dataIndex: "status",
        //   key: "status",
        //   render: (status) => (status ? status : "N/A"),
        //   onHeaderCell: () => ({
        //     style: { fontSize: 16, fontWeight: 700, color: "#001529" },
        //   }),
        // },
        {
            title: "Due Date",
            dataIndex: "dueDate",
            key: "dueDate",
            render: (date) => (date ? new Date(date).toLocaleDateString() : "-"),
            onHeaderCell: () => ({
                style: { fontSize: 16, fontWeight: 700, color: "#001529" },
            }),
        },
        {
            title: "Total Amount",
            dataIndex: ["totals", "grandTotal"],
            key: "totalAmount",
            render: (amount) => (amount ? `₹${amount.toFixed(2)}` : "₹0.00"),
            onHeaderCell: () => ({
                style: { fontSize: 16, fontWeight: 700, color: "#001529" },
            }),
        },
        // {
        //   title: "Balance Due",
        //   dataIndex: "remainingAmount",
        //   key: "balanceDue",
        //   render: (amount) => (amount ? `₹${amount.toFixed(2)}` : "₹0.00"),
        //   onHeaderCell: () => ({
        //     style: { fontSize: 16, fontWeight: 700, color: "#001529" },
        //   }),
        // },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <Space>
                    <Button
                        type="default"
                        icon={<Icons.EyeOutlined />}
                        // onClick={() => navigate(`/invoice/view/${record._id}`)}
                    />
                    {/* <Button
                        type="primary"
                        icon={<Icons.EditOutlined />}
                        onClick={() => navigate(`/invoice/edit/${record._id}`)}
                    />
                    <Popconfirm
                        title="Are you sure you want to delete this invoice?"
                        okText="Yes"
                        okButtonProps={{ loading: deleteLoading }}
                        cancelText="No"
                        disabled
                        onConfirm={async () => {
                            try {
                                await dispatch(deleteInvoice(record._id)).unwrap();
                                message.success("Invoice deleted successfully");
                            } catch (err) {
                                message.error(err || "Failed to delete invoice");
                            }
                        }}
                    >
                        <Button type="default" danger icon={<Icons.DeleteOutlined />} />
                    </Popconfirm> */}
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
                <Row align="middle" justify="space-between">
                    <Col>
                        <div className="text-xl font-semibold">Item Reports</div>
                    </Col>
                </Row>
            </Card>

            {/* Search / Filter */}
            <Card style={{ marginBottom: 16 }}>
                <Row align="middle" justify="space-between" gutter={[16, 16]}>
                    <Col>
                        <Space size="middle" wrap>
                            <div className="w-52">
                                <Select
                                    showSearch
                                    placeholder="Select Item"
                                    loading={dropLoading}
                                    className="w-full"
                                    allowClear
                                    size="middle"
                                    optionFilterProp="label"
                                    value={selectedItem}
                                    onChange={(val) => setSelectedItem(val)}
                                    options={items?.map((item) => ({
                                        label: item.name,
                                        value: item._id,
                                    }))}
                                />
                            </div>
                            <div className="w-52">
                                <Select
                                    showSearch
                                    placeholder="Select Customer"
                                    loading={dropLoading}
                                    className="w-full"
                                    value={selectedCustomer}
                                    onChange={(val) => setSelectedCustomer(val)}
                                    options={dropdownCustomers?.map((customer) => ({
                                        label: customer.companyName || customer.name,
                                        value: customer._id,
                                    }))}
                                    allowClear
                                    size="middle"
                                    optionFilterProp="label"
                                />
                            </div>

                            {/* Clear Button */}
                            <Button
                                type="default"
                                icon={<Icons.ClearOutlined />}
                                size="middle"
                                onClick={() => {
                                    setSelectedItem(null);
                                    setSelectedCustomer(null);
                                }}
                            >
                                Clear All
                            </Button>

                            {/* Apply Filter Button */}
                            <Button
                                type="primary"
                                icon={<Icons.FilterOutlined />}
                                size="middle"
                                onClick={handleApplyFilter}
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
                    tableId="invoiceId"
                    columns={columns}
                    data={itemSalesDetail  || []}
                    loading={loading}
                    // pagination={{
                    //     current: parseInt(searchParams?.get("page")) || 1,
                    //     pageSize: parseInt(searchParams?.get("limit")) || 10,
                    //     total: pagination.totalCount,
                    //     onChange: handlePaginationChange,
                    // }}
                />
            </Card>
        </div>
    )
}

export default ItemReport