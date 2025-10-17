import React, { useEffect, useState } from "react";
import { Card, Form, Row, Col, Button, Typography, message, Spin } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CustomInput from "../../component/commonComponent/CustomInput";
import Icons from "../../assets/icon";
import dayjs from "dayjs";
import {
  createPaymentReceived,
  getPaymentReceivedById,
  updatePaymentReceived,
} from "../../redux/slice/paymentreceived/paymentReceivedSlice";
import { getCustomerDropdown } from "../../redux/slice/customer/customerVendorSlice";


const { Title } = Typography;

const AddPaymentReceived = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { paymentId } = useParams();
  const dispatch = useDispatch();
  const { companyId } = useSelector((state) => state.auth);
  const { dropdownCustomers, dropLoading } = useSelector(
    (state) => state.customerVendor
  );
  const { payment, loading, postLoading } = useSelector(
    (state) => state.paymentReceived
  );

  // const calculateNetAmount = (amount, charges) => {
  //   return amount ? amount - charges : 0;
  // };

  useEffect(() => {
    if (companyId) {
      dispatch(
        getCustomerDropdown({
          companyId,
        })
      );
    }
  }, [companyId, dispatch]); 

  useEffect(() => {
    if (paymentId && companyId) {
      dispatch(getPaymentReceivedById({ paymentId, companyId }));
    }
  }, [paymentId, companyId, dispatch]);

  useEffect(() => {
    if (paymentId && payment) {
      form.setFieldsValue({
        partyId: payment.partyId?._id,
        referenceNumber: payment.referenceNumber,
        paymentDate: dayjs(payment.paymentDate),
        paymentMode: payment.paymentMode,
        amount: payment.amount,
        charges: payment.charges || 0,
        status: payment.status,
        notes: payment.notes,
      });
    } else {
      form.setFieldsValue({
        paymentDate: dayjs(),
        paymentMode: "bank",
        status: "completed",
        charges: 0,
      });
    }
  }, [paymentId, payment, form]);

  const onFinish = async (values) => {
    try {
      const payload = {
        companyId,
        paymentType: "paymentReceived",
        partyId: values.partyId,
        referenceNumber: values.referenceNumber || "",
        paymentDate: values.paymentDate.toDate(),
        amount: values.amount || 0,
        charges: values.charges || 0,
        paymentMode: values.paymentMode,
        status: values.status,
        notes: values.notes || "",
      };

      // payload.netAmount = calculateNetAmount(values.amount, values.charges);

      if (paymentId) {
        await dispatch(
          updatePaymentReceived({ paymentId, paymentData: payload })
        ).unwrap();
      } else {
        await dispatch(createPaymentReceived(payload)).unwrap();
      }
      navigate("/payment-received");
    } catch (error) {
      message.error(error?.message);
    }
  };

  return (
    <div className="!relative">
      <Card className="!p-3 !m-4 !pb-10">
     
        <Row align="middle" style={{ marginBottom: 24 }}>
          <Col>
            <Button
              type="text"
              icon={<Icons.ArrowLeftOutlined />}
              onClick={() => navigate("/payment-received")}
              style={{ marginRight: 8 }}
            />
          </Col>
          <Col>
            <Title level={3} style={{ margin: 0 }}>
              {paymentId ? "Edit Payment Received" : "Add Payment Received"}
            </Title>
          </Col>
        </Row>

        {loading && paymentId ? (
          <div className="flex items-center justify-center h-[60vh]">
            <Spin tip="Loading..." />
          </div>
        ) : (
          <Form
            id="paymentForm"
            form={form}
            layout="vertical"
            onFinish={onFinish}
            className="min-h-[70vh] !px-2"
          >
            <Title level={4}>Payment Information</Title>

            <Row gutter={16}>
              <Col span={8}>
                <CustomInput
                  type="select"
                  name="partyId"
                  label="Customer Name *" 
                  placeholder="select Customer" 
                  options={(dropdownCustomers || []).map((cust) => ({
                    label: cust.companyName || cust.name,
                    value: cust._id,
                  }))} 
                  showSearch={true}
                  filterOption={false}
                  loading={dropLoading}
                  rules={[
                    { required: true, message: "Please select a Customer" },
                  ]} 
                />
              </Col>
              <Col span={8}>
                <CustomInput
                  type="text"
                  name="referenceNumber"
                  label="Reference Number"
                  placeholder="Enter reference number "
                />
              </Col>
              <Col span={8}>
                <CustomInput
                  type="date"
                  name="paymentDate"
                  label="Payment Date *"
                  rules={[
                    { required: true, message: "Please select payment date" },
                  ]}
                />
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={8}>
                <CustomInput
                  type="select"
                  name="paymentMode"
                  label="Payment Mode *"
                  placeholder="Select payment mode"
                  options={[
                    { label: "Cash", value: "cash" },
                    { label: "Bank", value: "bank" },
                    { label: "Other", value: "other" },
                  ]}
                  rules={[
                    { required: true, message: "Please select payment mode" },
                  ]}
                />
              </Col>
              <Col span={8}>
                <CustomInput
                  type="number"
                  name="amount"
                  label="Amount *"
                  placeholder="Enter amount"
                  min={0}
                  precision={2}
                  rules={[{ required: true, message: "Please enter amount" }]}
                />
              </Col>
              <Col span={8}>
                <CustomInput
                  type="number"
                  name="charges"
                  label="Charges"
                  placeholder="Enter charges"
                  min={0}
                  precision={2}
                />
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={24}>
                <CustomInput
                  type="select"
                  name="status"
                  label="Status *"
                  placeholder="Select status"
                  options={[
                    { label: "Pending", value: "pending" },
                    { label: "Completed", value: "completed" },
                    { label: "Failed", value: "failed" },
                    { label: "Cancelled", value: "cancelled" },
                  ]}
                  rules={[{ required: true, message: "Please select status" }]}
                />
              </Col>
            </Row>

            <Row gutter={16} style={{ marginTop: 24 }}>
              <Col span={24}>
                <CustomInput
                  type="textarea"
                  name="notes"
                  label="Notes"
                  placeholder="Enter payment notes"
                  rows={3}
                />
              </Col>
            </Row>
          </Form>
        )}
      </Card>

      {/* Bottom Action Bar */}
      <div className="flex items-center gap-5 py-4 px-12 border-t border-l border-gray-200 w-full bg-white fixed bottom-0 shadow-[0_-1px_10px_rgba(0,0,0,0.08)] z-10">
        <Button
          type="primary"
          htmlType="submit"
          form="paymentForm"
          loading={postLoading}
        >
          {postLoading
            ? "Loading..."
            : paymentId
            ? "Update Payment Received"
            : "Save Payment Received"}
        </Button>
        <Button onClick={() => navigate("/payment-received")}>Cancel</Button>
      </div>
    </div>
  );
};

export default AddPaymentReceived;
