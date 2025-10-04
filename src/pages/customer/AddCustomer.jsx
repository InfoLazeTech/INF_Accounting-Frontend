import { Card, Form, Button, Row, Col, message, Spin, Typography } from "antd";
import CustomInput from "../../component/commonComponent/CustomInput";
import { useNavigate, useParams } from "react-router-dom";
import Icons from "../../assets/icon";
import { useDispatch, useSelector } from "react-redux";
import {
  addCustomerVendor,
  getCustomerVendorById,
  updateCustomerVendor,
} from "../../redux/slice/customer/customerVendorSlice";
import { useEffect } from "react";

const { Title } = Typography;

const AddCustomer = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { customerId } = useParams();
  const { companyId } = useSelector((state) => state.auth);
  const { customer, loading, postLoading } = useSelector(
    (state) => state.customerVendor
  );

  useEffect(() => {
    if (customerId) {
      dispatch(getCustomerVendorById(customerId));
    }
  }, [customerId, dispatch]);

  useEffect(() => {
    if (customerId && customer) {
      form.setFieldsValue({
        type: customer.type?.isCustomer ? "customer" : "vendor",
        companyName: customer ? customer.companyName : "",
        contactPerson: customer ? customer.contactPerson : "",
        email: customer.email || "",
        phone: customer.phone || "",
        gstNumber: customer.gstNumber || "",
        creditLimit: customer.creditLimit || "",
        paymentTerms: customer.paymentTerms || "",
        status: customer.status || "Active",
        billingAddress: {
          street: customer.billingAddress?.street || "",
          city: customer.billingAddress?.city || "",
          state: customer.billingAddress?.state || "",
          zip: customer.billingAddress?.zip || "",
          country: customer.billingAddress?.country || "",
        },
        shippingAddress: {
          street: customer.shippingAddress?.street || "",
          city: customer.shippingAddress?.city || "",
          state: customer.shippingAddress?.state || "",
          zip: customer.shippingAddress?.zip || "",
          country: customer.shippingAddress?.country || "",
        },
      });
    } else {
      form.setFieldsValue({
        type: "customer",
        status: "Active",
      });
    }
  }, [customerId, customer, form]);

  const onFinish = async (values) => {
    const payload = {
      companyId,
      companyName: values.companyName || "",
      contactPerson: values.contactPerson || "",
      email: values.email || "",
      phone: values.phone || "",
      gstNumber: values.gstNumber || "",
      creditLimit: values.creditLimit || "",
      paymentTerms: values.paymentTerms || "",
      status: values.status || "Active",

      type:
        values.type === "customer"
          ? { isCustomer: true, isVendor: false }
          : { isCustomer: false, isVendor: true },
      billingAddress: {
        street: values.billingAddress?.street || "",
        city: values.billingAddress?.city || "",
        state: values.billingAddress?.state || "",
        zip: values.billingAddress?.zip || "",
        country: values.billingAddress?.country || "",
      },
      shippingAddress: {
        street: values.shippingAddress?.street || "",
        city: values.shippingAddress?.city || "",
        state: values.shippingAddress?.state || "",
        zip: values.shippingAddress?.zip || "",
        country: values.shippingAddress?.country || "",
      },
    };

    if (customerId) {
      await dispatch(
        updateCustomerVendor({ customerId, data: payload })
      ).unwrap();
      navigate("/customer");
    } else {
      await dispatch(addCustomerVendor(payload)).unwrap();
      navigate("/customer");
    }
  };

  const copyBillingToShipping = () => {
    const billing = form.getFieldValue("billingAddress") || {};
    form.setFieldsValue({
      shippingAddress: {
        ...billing,
      },
    });
  };

  return (
    <div className="!relative">
      <Card className="!p-3 !m-4 !pb-10">
        <Row align="middle" style={{ marginBottom: 24 }}>
          <Col>
            <Button
              type="text"
              icon={<Icons.ArrowLeftOutlined />}
              onClick={() => navigate("/customer")}
              style={{ marginRight: 8 }}
            />
          </Col>
          <Col>
            <Title level={3} style={{ margin: 0 }}>
              {customerId ? "Edit Customer" : "Add Customer"}
            </Title>
          </Col>
        </Row>

        {/* Form */}
        {loading && customerId ? (
          <div className="flex items-center justify-center h-[60vh]">
            <Spin tip="Loading..." />
          </div>
        ) : (
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            className="min-h-[70vh] !px-2"
          >
            {/* Customer / Vendor Selection */}
            <Row gutter={16}>
              <Col span={24}>
                <CustomInput
                  type="radio"
                  name="type"
                  label="Type"
                  options={[
                    { label: "Customer", value: "customer" },
                    { label: "Vendor", value: "vendor" },
                  ]}
                  rules={[{ required: true, message: "" }]}
                />
              </Col>
            </Row>

            {/* Basic Info */}
            <Row gutter={16}>
              <Col span={8}>
                <CustomInput
                  type="text"
                  name="companyName"
                  label="Enter Company Name"
                  placeholder="Enter name"
                  rules={[{ required: true, message: "Please enter name" }]}
                />
              </Col>
              <Col span={8}>
                <CustomInput
                  type="text"
                  name="contactPerson"
                  label="Contact Person"
                  placeholder="Enter contact person"
                  rules={[{ required: true, message: "Please enter name" }]}
                />
              </Col>
              <Col span={8}>
                <CustomInput
                  type="text"
                  name="email"
                  label="Email"
                  placeholder="Enter email address"
                  rules={[
                    { required: true, message: "Please enter email" },
                    { type: "email", message: "Please enter a valid email" },
                  ]}
                />
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={8}>
                <CustomInput
                  type="text"
                  name="phone"
                  label="Phone"
                  placeholder="Enter phone number"
                  maxLength={10}
                  rules={[
                    { required: true, message: "Please enter Phone number" },
                    {
                      pattern: /^[0-9]{10}$/,
                      message: "Phone number must be digits",
                    },
                  ]}
                />
              </Col>
              <Col span={8}>
                <CustomInput
                  type="text"
                  name="gstNumber"
                  label="GST Number"
                  placeholder="Enter GST number"
                  rules={[
                    { required: true, message: "Please enter GstNumber" },
                  ]}
                />
              </Col>
              <Col span={8}>
                <CustomInput
                  type="number"
                  name="creditLimit"
                  label="Credit Limit"
                  placeholder="Enter credit limit"
                />
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={8}>
                <CustomInput
                  type="select"
                  name="paymentTerms"
                  label="Payment Terms"
                  placeholder="Select payment terms"
                  options={[
                    { value: "Prepaid", label: "Prepaid" },
                    { value: "Net 15", label: "Net 15" },
                    { value: "Net 30", label: "Net 30" },
                    { value: "Custom", label: "Custom" },
                  ]}
                />
              </Col>
              <Col span={15}>
                <CustomInput
                  type="radio"
                  name="status"
                  label="Status"
                  options={[
                    { label: "Active", value: "Active" },
                    { label: "Inactive", value: "Inactive" },
                  ]}
                  default="Active"
                  rules={[{ required: true, message: "" }]}
                />
              </Col>
            </Row>

            {/* Billing Address */}
            <Title level={4}>Billing Address</Title>
            <Row gutter={16}>
              <Col span={12}>
                <CustomInput
                  type="text"
                  name={["billingAddress", "street"]}
                  label="Street"
                  placeholder="Enter street"
                  rules={[
                    { required: true, message: "Please enter Street Name" },
                  ]}
                />
              </Col>
              <Col span={12}>
                <CustomInput
                  type="text"
                  name={["billingAddress", "city"]}
                  label="City"
                  placeholder="Enter city"
                  rules={[
                    { required: true, message: "Please enter City Name" },
                  ]}
                />
              </Col>
              <Col span={8}>
                <CustomInput
                  type="text"
                  name={["billingAddress", "state"]}
                  label="State"
                  placeholder="Enter state"
                  rules={[
                    { required: true, message: "Please enter State Name" },
                  ]}
                />
              </Col>
              <Col span={8}>
                <CustomInput
                  type="text"
                  name={["billingAddress", "zip"]}
                  label="Zip"
                  placeholder="Enter ZIP"
                  rules={[
                    { required: true, message: "Please enter  Zip Name" },
                  ]}
                />
              </Col>
              <Col span={8}>
                <CustomInput
                  type="text"
                  name={["billingAddress", "country"]}
                  label="Country"
                  placeholder="Enter country"
                  rules={[
                    { required: true, message: "Please enter Country Name" },
                  ]}
                />
              </Col>
            </Row>

            {/* Shipping Address */}
            <Title level={4}>
              Shipping Address
              <Button
                type="link"
                style={{ marginLeft: 8 }}
                onClick={copyBillingToShipping}
              >
                Same as Billing
              </Button>
            </Title>

            <Row gutter={16}>
              <Col span={12}>
                <CustomInput
                  type="text"
                  name={["shippingAddress", "street"]}
                  label="Street"
                  placeholder="Enter street"
                  rules={[
                    { required: true, message: "Please enter  Street Name" },
                  ]}
                />
              </Col>
              <Col span={12}>
                <CustomInput
                  type="text"
                  name={["shippingAddress", "city"]}
                  label="City"
                  placeholder="Enter city"
                  rules={[
                    { required: true, message: "Please enter City Name" },
                  ]}
                />
              </Col>
              <Col span={8}>
                <CustomInput
                  type="text"
                  name={["shippingAddress", "state"]}
                  label="State"
                  placeholder="Enter state"
                  rules={[
                    { required: true, message: "Please enter State Name" },
                  ]}
                />
              </Col>
              <Col span={8}>
                <CustomInput
                  type="text"
                  name={["shippingAddress", "zip"]}
                  label="Zip"
                  placeholder="Enter ZIP"
                  rules={[
                    { required: true, message: "Please enter  Zip Name" },
                  ]}
                />
              </Col>
              <Col span={8}>
                <CustomInput
                  type="text"
                  name={["shippingAddress", "country"]}
                  label="Country"
                  placeholder="Enter country"
                  rules={[
                    { required: true, message: "Please enter Country Name" },
                  ]}
                />
              </Col>
            </Row>
          </Form>
        )}
      </Card>

      {/* Bottom Action Bar */}
      <div className="flex items-center gap-5 py-4 px-12 border-t border-l border-gray-200 w-full bg-white fixed bottom-0 shadow-[0_-1px_10px_rgba(0,0,0,0.08)] z-10">
        <Button type="primary" onClick={() => form.submit()}>
          {postLoading ? (
            <span>Loading...</span>
          ) : customerId ? (
            "Update Customer"
          ) : (
            "Save Customer"
          )}
        </Button>
        <Button onClick={() => navigate("/customer")}>Cancel</Button>
      </div>
    </div>
  );
};

export default AddCustomer;
