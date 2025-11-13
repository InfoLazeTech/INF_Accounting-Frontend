import { Card, Form, Button, Row, Col, message, Spin, Typography } from "antd";
import CustomInput from "../../component/commonComponent/CustomInput";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Icons from "../../assets/icon";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  addTransaction,
  getBankDropdown,
} from "../../redux/slice/bank/bankSlice";
import dayjs from "dayjs";
import {
  getCustomerDropdown,
  getVendorDropdown,
} from "../../redux/slice/customer/customerVendorSlice";

import { getAccounts } from "../../redux/slice/account/accountSlice";

const { Title } = Typography;

const AddTransaction = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { customerId } = useParams();
  const { bankId } = useParams();
  const location = useLocation();
  const selectedType = location.state?.type || "credit"; // default is credit
  const { companyId } = useSelector((state) => state.auth);
  const { bankDropdown, loading, postLoading } = useSelector(
    (state) => state.bank
  );
  const {
    dropdownCustomers,
    dropdownVendors,
    dropLoading,
    loading: customerLoading,
  } = useSelector((state) => state.customerVendor);

  const [transactionType, setTransactionType] = useState(selectedType);
  const { accounts } = useSelector((state) => state.account);

  const [parentOptions, setParentOptions] = useState([]);
  const [childOptions, setChildOptions] = useState([]);
  useEffect(() => {
    form.setFieldsValue({
      date: transactionDate,
      transactionType: selectedType,
      bankId: bankId,
    });
  }, [selectedType, bankId]);

  useEffect(() => {
    dispatch(getAccounts({ companyId }));
  }, [dispatch]);

  useEffect(() => {
    if (accounts?.length) {
      const parents = accounts.map((acc) => ({
        label: acc.parentType,
        value: acc.id,
        children: acc.children,
      }));
      setParentOptions(parents);
    }
  }, [accounts]);

  const handleParentChange = (value) => {
    const selectedParent = parentOptions.find((p) => p.value === value);
    if (selectedParent?.children?.length) {
      const children = selectedParent.children.map((c) => ({
        label: c.accountName,
        value: c.id,
      }));
      setChildOptions(children);
      form.setFieldsValue({ childAccount: undefined });
    } else {
      setChildOptions([]);
      form.setFieldsValue({ childAccount: undefined });
    }
  };

  useEffect(() => {
    if (companyId) {
      dispatch(getBankDropdown({ companyId }));
      if (transactionType === "credit") {
        dispatch(getCustomerDropdown({ companyId }));
      } else {
        dispatch(getVendorDropdown({ companyId }));
      }
    }
  }, [companyId, transactionType]);

  const handleCustomerVendorSelect = (value) => {
    const selectedList =
      transactionType === "credit" ? dropdownCustomers : dropdownVendors;
    const selected = selectedList.find((c) => c._id === value);
    if (!selected) return;
    form.setFieldsValue({
      customerName: selected.companyName,
    });
  };

  const onFinish = async (values) => {
    console.log("values", values);
    try {
      const payload = {
        bankId,
        amount: values.amount,
        description: values.description,
        date: values.transactionDate,
        type: values.transactionType,
        companyId,
        customerVendorId: values.customerId ,
        parentId:values.parentAccount,
        childrenId:values.childAccount,
      };

      await dispatch(addTransaction(payload)).unwrap();
      message.success("Transaction added successfully!");
      // navigate("/banking");
      form.resetFields();
      form.setFieldsValue({
        transactionType: selectedType,
        bankId: bankId,
      });
    } catch (err) {
      message.error(err || "Failed to add transaction");
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
              onClick={() => navigate("/banking")}
              style={{ marginRight: 8 }}
            />
          </Col>
          <Col>
            <Title level={3} style={{ margin: 0 }}>
              Add Transaction
            </Title>
          </Col>
        </Row>

        {/* Form */}
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            transactionDate: dayjs(),
          }}
          className="min-h-[70vh] !px-2"
        >
          {/* Basic Info */}
          <Row gutter={16}>
            <Col span={8}>
              <CustomInput
                type="radio"
                name="transactionType"
                label="Transaction Type"
                disabled
                options={[
                  { label: "Credit", value: "credit" },
                  { label: "Debit", value: "debit" },
                ]}
                default="Active"
                rules={[{ required: true, message: "" }]}
              />
            </Col>
            <Col span={8}>
              <CustomInput
                type="select"
                name="bankId"
                label="Select Bank"
                placeholder="Choose Bank"
                disabled
                options={bankDropdown?.map((bank) => ({
                  label: `${bank.bankName} (${bank.accountNumber})`,
                  value: bank._id,
                }))}
                loading={loading}
                rules={[{ required: true, message: "Please select a Bank" }]}
              />
            </Col>
            <Col span={8}>
              {transactionType === "credit" ? (
                <CustomInput
                  type="select"
                  name="customerId"
                  label="Customer Name"
                  placeholder="Select Customer"
                  options={dropdownCustomers.map((c) => ({
                    value: c._id,
                    label: c.companyName,
                  }))}
                  onChange={handleCustomerVendorSelect}
                  showSearch
                  optionFilterProp="label"
                  loading={dropLoading}
                />
              ) : (
                <CustomInput
                  type="select"
                  name="customerId"
                  label="Vendor Name"
                  placeholder="Select Vendor"
                  options={dropdownVendors.map((v) => ({
                    value: v._id,
                    label: v.companyName,
                  }))}
                  onChange={handleCustomerVendorSelect}
                  showSearch
                  optionFilterProp="label"
                  loading={dropLoading}
                />
              )}
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <CustomInput
                type="text"
                name="amount"
                label="Amount"
                placeholder="Enter Amount"
                rules={[{ required: true, message: "Please enter Amount" }]}
              />
            </Col>
            <Col span={8}>
              <CustomInput
                type="date"
                name="transactionDate"
                label="Transaction Date"
                placeholder="Select date"
                format="YYYY-MM-DD"
                rules={[
                  {
                    required: true,
                    message: "Please select a Transaction date",
                  },
                ]}
                defaultValue={dayjs()}
              />
            </Col>
              
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <CustomInput
                type="textarea"
                name="description"
                label="Description"
                placeholder="Enter Description"
                rules={[
                  { required: true, message: "Please enter Description" },
                ]}
              />
            </Col>
            <Col span={8}>
              <CustomInput
                type="select"
                name="parentAccount"
                label="Parent Account"
                placeholder="Select Parent"
                options={parentOptions}
                onChange={handleParentChange}
                showSearch
                optionFilterProp="label"
              />
            </Col>
            <Col span={8}>
             {childOptions.length > 0 && (
                <CustomInput
                  type="select"
                  name="childAccount"
                  label="Child Account"
                  placeholder="Select Child"
                  options={childOptions}
                  showSearch
                  optionFilterProp="label"
                />
              )}
            </Col>
          </Row>
        </Form>
      </Card>

      {/* Bottom Action Bar */}
      <div className="flex items-center gap-5 py-4 px-12 border-t border-l border-gray-200 w-full bg-white fixed bottom-0 shadow-[0_-1px_10px_rgba(0,0,0,0.08)] z-10">
        <Button type="primary" onClick={() => form.submit()}>
          {postLoading ? "Saving..." : "Save Transaction"}
        </Button>
        <Button onClick={() => navigate("/banking")}>Cancel</Button>
      </div>
    </div>
  );
};

export default AddTransaction;
