
import React from "react";
import { Modal, Form, Input, Button, Select, Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { addAccount, getAccounts } from "../../../redux/slice/account/accountSlice";
import PARENT_TYPES from "../../../utlis/accountTypes"; 

const { Option } = Select;

const AddAccount = ({ visible, onCancel, companyId }) => {
  const dispatch = useDispatch();
  const { postLoading, accounts } = useSelector((s) => s.account);
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    const payload = { ...values, companyId };
    const result = await dispatch(addAccount(payload));
    if (addAccount.fulfilled.match(result)) {
      form.resetFields();
      onCancel();
      dispatch(
        getAccounts({ companyId, page: 1, limit: 10 })
      );
    }
  };

  return (
    <Modal
      title="Add New Account"
      open={visible}
      onCancel={onCancel}
      footer={null}
      destroyOnClose
    >
      <Spin spinning={postLoading}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="accountname"
            label="Account Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="accountcode" label="Account Code">
            <Input />
          </Form.Item>

         <Form.Item name="parenttype" label="Parent Type" rules={[{ required: true }]}>
            <Select placeholder="Select parent type">
              {PARENT_TYPES.map((type) => (
                <Option key={type} value={type}>
                  {type}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item className="text-right mb-0">
            <Button onClick={onCancel}>Cancel</Button>
            <Button type="primary" htmlType="submit" className="ml-2">
              Save
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};

export default AddAccount;