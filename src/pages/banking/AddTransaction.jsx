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
const DEBIT_ACCOUNTS = new Set([
  "Current Assets",
  "Fixed Assets",
  "Investments",
  "Non Current Assets",
  "Purchase Account",
  "Direct Expense",
  "Indirect Expense",
]);

const CREDIT_ACCOUNTS = new Set([
  "Capital/Equity",
  "Non-Current Liabilities",
  "Current Liabilities",
  "Sales Account",
  "Direct Income",
  "Indirect Income",
]);

const getTransactionType = (parentType) => {
  if (DEBIT_ACCOUNTS.has(parentType)) return "debit";
  if (CREDIT_ACCOUNTS.has(parentType)) return "credit";
  return null; // unknown
};

const AddTransaction = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { customerId } = useParams();
  const { bankId } = useParams();
  const location = useLocation();
  const selectedType = location.state?.type || "credit"; // default is credit
  const { companyId } = useSelector((state) => state.auth);
  const {
    bankDropdown,
    loading: bankLoading,
    postLoading,
  } = useSelector((state) => state.bank);
  const {
    dropdownCustomers,
    dropdownVendors,
    dropLoading,
    loading: customerLoading,
  } = useSelector((state) => state.customerVendor);

  const [transactionType, setTransactionType] = useState("");
  const { accounts } = useSelector((state) => state.account);
  const [selectedBankId, setSelectedBankId] = useState("");

  const [parentOptions, setParentOptions] = useState([]);
  const [childOptions, setChildOptions] = useState([]);
  useEffect(() => {
    form.setFieldsValue({
      transactionDate: dayjs(),
      transactionType: selectedType,
      bankId: bankId,
    });

    if (bankId) {
      setSelectedBankId(bankId);
    }
  }, [selectedType, bankId]);
  useEffect(() => {
    if (companyId) {
      dispatch(getBankDropdown({ companyId }));
      dispatch(getAccounts({ companyId }));
      dispatch(getCustomerDropdown({ companyId }));
      dispatch(getVendorDropdown({ companyId }));
    }
  }, [dispatch, companyId]);

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

  const handleParentChange = (parentId) => {
    const selectedParent = parentOptions.find((p) => p.value === parentId);
    if (!selectedParent) return;

    // Set child options
    if (selectedParent.children?.length) {
      const children = selectedParent.children.map((c) => ({
        label: c.accountName,
        value: c.id,
      }));
      setChildOptions(children);
    } else {
      setChildOptions([]);
    }

    // Auto-set transaction type
    const type = getTransactionType(selectedParent.label);
    if (type) {
      setTransactionType(type);
      form.setFieldsValue({ transactionType: type });
    } else {
      setTransactionType("");
      form.setFieldsValue({ transactionType: undefined });
      message.warning(`Unknown account type: ${selectedParent.label}`);
    }

    form.setFieldsValue({ childAccount: undefined });
  };
  const onFinish = async (values) => {
    try {
      const payload = {
        bankId: selectedBankId,
        amount: values.amount,
        description: values.description,
        date: values.transactionDate,
        type: transactionType,
        companyId,
        customerVendorId: values.customerVendorId,
        parentId: values.parentAccount,
        childrenId: values.childAccount,
      };

      await dispatch(addTransaction(payload)).unwrap();
      message.success("Transaction added successfully!");
      form.resetFields();
      setSelectedBankId("");
      setTransactionType("");
      setChildOptions([]);
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

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ transactionDate: dayjs() }}
          className="min-h-[70vh] !px-2"
        >
          {/* Row 1 */}
          <Row gutter={16}>
            <Col span={8}>
              <CustomInput
                type="select"
                name="bankId"
                label="Select Bank"
                placeholder="Choose Bank"
                options={bankDropdown?.map((bank) => ({
                  label: `${bank.bankName} (${bank.accountNumber})`,
                  value: bank._id,
                }))}
                loading={bankLoading}
                disabled
                rules={[{ required: true, message: "Please select a Bank" }]}
                onChange={(val) => setSelectedBankId(val)}
              />
            </Col>

            <Col span={8}>
              <CustomInput
                type="select"
                name="parentAccount"
                label="Parent Account"
                placeholder="Select Parent Account"
                options={parentOptions}
                onChange={handleParentChange}
                showSearch
                optionFilterProp="label"
                rules={[
                  { required: true, message: "Please select Parent Account" },
                ]}
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

          {/* Row 2 */}
          <Row gutter={16}>
            <Col span={8}>
              <CustomInput
                type="select"
                name="customerVendorId"
                label="Customer / Vendor"
                placeholder="Search & select"
                options={[
                  ...dropdownCustomers.map((c) => ({
                    label: `[Customer] ${c.companyName}`,
                    value: c._id,
                  })),
                  ...dropdownVendors.map((v) => ({
                    label: `[Vendor] ${v.companyName}`,
                    value: v._id,
                  })),
                ]}
                showSearch
                optionFilterProp="label"
                loading={dropLoading}
              />
            </Col>

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
                format="YYYY-MM-DD"
                rules={[{ required: true, message: "Please select date" }]}
                defaultValue={dayjs()}
              />
            </Col>
          </Row>

          {/* Row 3 */}
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
              <Form.Item name="transactionType" noStyle>
                <input type="hidden" />
              </Form.Item>
              {transactionType && (
                <div style={{ marginTop: 8, fontWeight: 500 }}>
                  <strong>Transaction Type:</strong>{" "}
                  <span
                    style={{
                      color: transactionType === "credit" ? "green" : "red",
                    }}
                  >
                    {transactionType.toUpperCase()}
                  </span>
                </div>
              )}
            </Col>
          </Row>
        </Form>
      </Card>

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
