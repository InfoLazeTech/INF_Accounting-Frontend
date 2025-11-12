import React, { useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  Spin,
  Typography,
  Descriptions,
  Tag,
} from "antd";
import Icons from "../../assets/icon";
import { getPaymentReceivedById } from "../../redux/slice/paymentreceived/paymentReceivedSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const { Title } = Typography;

const ViewPaymentReceived = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { paymentId } = useParams();
  const { payment, loading } = useSelector((state) => state.paymentReceived);
  const { companyId } = useSelector((state) => state.auth);

  useEffect(() => {
    if (paymentId && companyId) {
      dispatch(getPaymentReceivedById({ paymentId, companyId }));
    }
  }, [paymentId, dispatch, companyId]);

  const getPartyContact = () => {
    return payment?.partyId?.contactPerson || "-";
  };

  const getPaymentModeDisplay = (mode) => {
    const modeMap = {
      cash: "Cash",
      bank: "Bank Transfer",
      cheque: "Cheque",
      online: "Online",
      upi: "UPI",
    };
    return modeMap[mode?.toLowerCase()] || mode?.toUpperCase() || "-";
  };

  return (
    <div className="!relative">
      <Card className="!p-3 !m-4 !pb-10">
        <Row
          align="middle"
          justify="space-between"
          style={{ marginBottom: 24 }}
        >
          <Col>
            <Row align="middle" gutter={8}>
              <Col>
                <Button
                  type="text"
                  icon={<Icons.ArrowLeftOutlined />}
                  onClick={() => navigate("/payment-received")}
                />
              </Col>
              <Col>
                <Title level={3} style={{ margin: 0 }}>
                  View Payment Received
                </Title>
              </Col>
            </Row>
          </Col>
          <Col>
            <Row gutter={8}>
              <Col>
                <Button
                  type="primary"
                  icon={<Icons.EditOutlined />}
                  onClick={() =>
                    navigate(`/payment-received/edit/${paymentId}`)
                  }
                >
                  Edit
                </Button>
              </Col>
              <Col>
                <Button onClick={() => navigate("/payment-received")}>
                  Cancel
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>

        {loading ? (
          <div className="flex items-center justify-center h-[60vh]">
            <Spin tip="Loading Payment Details..." />
          </div>
        ) : (
          <div className="min-h-[70vh] !px-2">
            <Descriptions
              title="Payment Information"
              bordered
              column={1}
              labelStyle={{ fontWeight: 600, width: "25%" }}
            >
              <Descriptions.Item label="Payment ID">
                <Tag color="blue">{payment?.paymentId || "-"}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Reference Number">
                {payment?.referenceNumber}
              </Descriptions.Item>
              <Descriptions.Item label="Party Name">
                <strong>{payment?.partyId?.companyName||payment?.partyId?.name}</strong>
              </Descriptions.Item>
              <Descriptions.Item label="Contact Person">
                {payment?.partyId?.contactPerson}
              </Descriptions.Item>
              <Descriptions.Item label="Payment Date">
                {payment?.paymentDate
                  ? new Date(payment.paymentDate).toLocaleDateString("en-IN")
                  : "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Payment Mode">
                <Tag color="cyan">
                  {payment?.paymentMode}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                {payment?.status === "completed" ? (
                  <Tag color="green">Completed</Tag>
                ) : payment?.status === "pending" ? (
                  <Tag color="orange">Pending</Tag>
                ) : (
                  <Tag color="red">{payment?.status || "Unknown"}</Tag>
                )}
              </Descriptions.Item>
            </Descriptions>

            <Descriptions
              title="Amount Details"
              bordered
              column={1}
              style={{ marginTop: 24 }}
              labelStyle={{ fontWeight: 600, width: "25%" }}
            >
              <Descriptions.Item label="Amount Received">
                <span style={{ color: "#52c41a", fontWeight: 500 }}>
                  ₹ {payment?.amount?.toLocaleString("en-IN")}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Charges">
                ₹ {payment?.charges?.toLocaleString("en-IN") }
              </Descriptions.Item>
              {/* <Descriptions.Item label="Net Amount" span={2}>
                <strong
                  style={{
                    color: "#52c41a",
                    fontSize: "16px",
                    fontWeight: "bold",
                  }}
                >
                  ₹ {payment?.netAmount?.toLocaleString("en-IN")}
                </strong>
              </Descriptions.Item> */}
            </Descriptions>

            <Descriptions
              title="Additional Information"
              bordered
              column={1}
              style={{ marginTop: 24 }}
              labelStyle={{ fontWeight: 600, width: "25%" }}
            >
              <Descriptions.Item label="Notes" span={2}>
                {payment?.notes}
              </Descriptions.Item>
              <Descriptions.Item label="Created Date">
                {payment?.createdAt
                  ? new Date(payment.createdAt).toLocaleDateString("en-IN")
                  : "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Last Updated">
                {payment?.updatedAt
                  ? new Date(payment.updatedAt).toLocaleDateString("en-IN")
                  : "-"}
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ViewPaymentReceived;
