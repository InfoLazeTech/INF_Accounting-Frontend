import React, { useEffect } from "react";
import {
    Card,
    Row,
    Col,
    Button,
    Spin,
    Typography,
    Descriptions,
    Table,
} from "antd";
import Icons from "../../assets/icon";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getProducationOrderById } from "../../redux/slice/producation/producationSlice";

const { Title } = Typography;

const ViewProducationOrder = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { orderId } = useParams();

    const { producationOrderById, loading } = useSelector(
        (state) => state.producation
    );

    useEffect(() => {
        if (orderId) {
            dispatch(getProducationOrderById(orderId));
        }
    }, [orderId, dispatch]);

    const rawColumns = [
        {
            title: "Item Name",
            dataIndex: ["itemId", "name"],
        },
        {
            title: "Item Code",
            dataIndex: ["itemId", "itemId"],
        },
        {
            title: "Category",
            dataIndex: ["itemId", "category", "name"],
        },
        {
            title: "Unit",
            dataIndex: ["itemId", "unitOfMeasure"],
        },
        {
            title: "Quantity",
            dataIndex: "quantity",
        },
    ];

    const finishedColumns = [
        {
            title: "Item Name",
            dataIndex: ["itemId", "name"],
        },
        {
            title: "Item Code",
            dataIndex: ["itemId", "itemId"],
        },
        {
            title: "Category",
            dataIndex: ["itemId", "category", "name"],
        },
        {
            title: "Unit",
            dataIndex: ["itemId", "unitOfMeasure"],
        },
        {
            title: "Quantity",
            dataIndex: "quantity",
        },
    ];

    return (
        <div className="!relative">
            <Card className="!p-3 !m-4 !pb-10">
                <Row align="middle" justify="space-between" style={{ marginBottom: 24 }}>
                    <Col>
                        <Row align="middle" gutter={8}>
                            <Col>
                                <Button
                                    type="text"
                                    icon={<Icons.ArrowLeftOutlined />}
                                    onClick={() => navigate("/producation-order")}
                                />
                            </Col>
                            <Col>
                                <Title level={3} style={{ margin: 0 }}>
                                    View Production Order
                                </Title>
                            </Col>
                        </Row>
                    </Col>
                </Row>

                {loading ? (
                    <div className="flex items-center justify-center h-[60vh]">
                        <Spin tip="Loading..." />
                    </div>
                ) : (
                    <div className="min-h-[70vh] !px-2">
                        <Descriptions
                            title="Production Order Details"
                            bordered
                            column={2}
                            labelStyle={{ fontWeight: 600 }}
                        >
                            <Descriptions.Item label="Order No">
                                {producationOrderById?.productionOrderNo}
                            </Descriptions.Item>

                            <Descriptions.Item label="Date">
                                {producationOrderById?.date
                                    ? new Date(producationOrderById.date).toLocaleDateString()
                                    : "-"}
                            </Descriptions.Item>
                        </Descriptions>

                        {/* Raw Materials Table */}
                        <Title level={4} style={{ marginTop: 30 }}>
                            Raw Materials
                        </Title>
                        <Table
                            dataSource={producationOrderById?.rawMaterials || []}
                            columns={rawColumns}
                            rowKey="_id"
                            bordered
                            pagination={false}
                        />

                        {/* Finished Goods Table */}
                        <Title level={4} style={{ marginTop: 30 }}>
                            Finished Goods
                        </Title>
                        <Table
                            dataSource={producationOrderById?.finishedGoods || []}
                            columns={finishedColumns}
                            rowKey="_id"
                            bordered
                            pagination={false}
                        />
                    </div>
                )}
            </Card>
        </div>
    );
};

export default ViewProducationOrder;
