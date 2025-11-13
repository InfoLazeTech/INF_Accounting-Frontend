import React from "react";
import { Modal, Form, Button, Spin, Space, Typography } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  addAccount,
  updateAccount,
  getAccounts,
} from "../../../redux/slice/account/accountSlice";
import PARENT_TYPES from "../../../utlis/accountTypes";
import CustomInput from "../../../component/commonComponent/CustomInput";
import { useEffect } from "react";

const { Text } = Typography;

const AddAccount = ({
  visible,
  onCancel,
  companyId,
  editMode = false,
  accountData = null,
}) => {
  const dispatch = useDispatch();
  const { postLoading, updateLoading } = useSelector((s) => s.account);
  const [form] = Form.useForm();
  console.log("accountData", accountData);

  useEffect(() => {
    if (editMode && accountData) {
      form.setFieldsValue({
        parenttype: accountData.parenttype,
        accountname: accountData.accountname,
        accountcode: accountData.accountcode,
        description: accountData.description || "",
      });
    } else {
      form.resetFields();
    }
  }, [editMode, accountData, form]);
  const onFinish = async (values) => {
    let payload;
    let result;

    if (editMode) {
      payload = {
        parenttype: values.parenttype || "",
        accountname: values.accountname || "",
        accountcode: values.accountcode || "",
        description: values.description || "",
      };

      result = await dispatch(
        updateAccount({ accountId: accountData._id, data: payload })
      );
    } else {
      payload = {
        parenttype: values.parenttype || "",
        accountname: values.accountname || "",
        accountcode: values.accountcode || "",
        description: values.description || "",
        companyId: companyId,
      };

      result = await dispatch(addAccount(payload));
    }
    const isFulfilled = editMode
      ? updateAccount.fulfilled.match(result)
      : addAccount.fulfilled.match(result);

    if (isFulfilled) {
      form.resetFields();
      onCancel();
      dispatch(getAccounts({ companyId, page: 1, limit: 10 }));
    }
  };

  return (
    <Modal
      title={editMode ? "Edit Account" : "Add New Account"}
      open={visible}
      onCancel={onCancel}
      footer={null}
      destroyOnClose
      width={600}
    >
      <Spin spinning={editMode ? updateLoading : postLoading}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <CustomInput
            type="select"
            name="parenttype"
            label="Parent Type"
            placeholder="Select parent type"
            options={PARENT_TYPES.map((type) => ({
              label: type,
              value: type,
            }))}
            disabled={editMode}
            rules={[{ required: true, message: "Please select parent type" }]}
          />

          <CustomInput
            type="text"
            name="accountname"
            label="Account Name"
            placeholder="Enter account name"
            rules={[{ required: true, message: "Please enter account name" }]}
          />

          <CustomInput
            type="text"
            name="accountcode"
            label="Account Code"
            placeholder="Enter account code"
          />
          <CustomInput
            type="textarea"
            name="description"
            label="Description"
            placeholder="Enter description"
          />

          <Form.Item className="text-right mb-0">
            <Space>
              <Button onClick={onCancel} disabled={postLoading}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={postLoading}>
                {editMode ? "Update" : "Save"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};

export default AddAccount;
