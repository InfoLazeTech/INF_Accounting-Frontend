import { Card, Row, Col, Button, Spin, Typography, Descriptions } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import Icons from "../../assets/icon";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getCustomerVendorById } from "../../redux/slice/customer/customerVendorSlice";

const { Title } = Typography;

const CustomerView = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { customerId } = useParams();
  const { customer, loading } = useSelector((state) => state.customerVendor);

  useEffect(() => {
    if (customerId) {
      dispatch(getCustomerVendorById(customerId));
    }
  }, [customerId, dispatch]);

  return (
    <div className="!relative">
      <Card className="!p-3 !m-4 !pb-10">
        {/* Header */}
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
                  onClick={() => navigate("/customer")}
                />
              </Col>
              <Col>
                <Title level={3} style={{ margin: 0 }}>
                  View Customer
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
                  onClick={() => navigate(`/customer/edit/${customerId}`)}
                >
                  Edit
                </Button>
              </Col>
              <Col>
                <Button onClick={() => navigate("/customer")}>Cancel</Button>
              </Col>
            </Row>
          </Col>
        </Row>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center h-[60vh]">
            <Spin tip="Loading..." />
          </div>
        ) : (
          <div className="min-h-[70vh] !px-2">
            {/* Basic Info */}
            <Descriptions
              title="Basic Information"
              bordered
              column={2}
              labelStyle={{ fontWeight: 600, width: "25%" }}
            >
              <Descriptions.Item label="Type">
                {customer?.type?.isCustomer ? "Customer" : "Vendor"}
              </Descriptions.Item>
              <Descriptions.Item label="Company Name">
                {customer?.companyName || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Contact Person">
                {customer?.contactPerson || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {customer?.email || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Phone">
                {customer?.phone || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="GST Number">
                {customer?.gstNumber || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Credit Limit">
                {customer?.creditLimit || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Payment Terms">
                {customer?.paymentTerms || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                {customer?.status || "-"}
              </Descriptions.Item>
            </Descriptions>

            {/* Billing Address */}
            <Descriptions
              title="Billing Address"
              bordered
              column={2}
              style={{ marginTop: 24 }}
              labelStyle={{ fontWeight: 600, width: "25%" }}
            >
              <Descriptions.Item label="Street">
                {customer?.billingAddress?.street || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="City">
                {customer?.billingAddress?.city || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="State">
                {customer?.billingAddress?.state || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Zip">
                {customer?.billingAddress?.zip || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Country" span={2}>
                {customer?.billingAddress?.country || "-"}
              </Descriptions.Item>
            </Descriptions>

            {/* Shipping Address */}
            <Descriptions
              title="Shipping Address"
              bordered
              column={2}
              style={{ marginTop: 24 }}
              labelStyle={{ fontWeight: 600, width: "25%" }}
            >
              <Descriptions.Item label="Street">
                {customer?.shippingAddress?.street || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="City">
                {customer?.shippingAddress?.city || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="State">
                {customer?.shippingAddress?.state || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Zip">
                {customer?.shippingAddress?.zip || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Country" span={2}>
                {customer?.shippingAddress?.country || "-"}
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Card>
    </div>
  );
};

export default CustomerView;
