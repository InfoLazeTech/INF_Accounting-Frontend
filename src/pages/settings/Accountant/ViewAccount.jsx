import React from "react";
import {
  Card,
  Row,
  Col,
  Form,
  Input,
  Button,
  Typography,
  message,
  Spin,
  Upload,
  Space,
  Popconfirm,
} from "antd";
import Icons from "../../../assets/icon";
import Title from "antd/es/skeleton/Title";
import CustomTable from "../../../component/commonComponent/CustomTable";
import AddAccountModal from "../Accountant/AddAccount";
import {
  getAccounts,
  removeAccount,
} from "../../../redux/slice/account/accountSlice";
import { selectAccountTree } from "../Accountant/selectors";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { useEffect } from "react";
const { Text } = Typography;

const ViewAccount = () => {
  const dispatch = useDispatch();
  const { loading, deleteLoading } = useSelector((s) => s.account);
  const treeData = useSelector(selectAccountTree);
  const { companyId } = useSelector((state) => state.auth);

  const [modal, setModal] = useState({
    visible: false,
    editMode: false,
    record: null,
  });

  useEffect(() => {
    dispatch(getAccounts({ companyId, page: 1, limit: 100 }));
  }, [dispatch, companyId]);

  const openAddModal = () => {
    setModal({ visible: true, editMode: false, record: null });
  };

  const openEditModal = (record) => {
    setModal({ visible: true, editMode: true, record });
  };
  const handleDelete = async (accountId) => {
    const result = await dispatch(removeAccount(accountId));
    if (removeAccount.fulfilled.match(result)) {
      message.success("Account deleted successfully");
      dispatch(getAccounts({ companyId, page: 1, limit: 100 }));
    }
  };
  const closeModal = () => {
    setModal({ visible: false, editMode: false, record: null });
  };
  const columns = [
    {
      title: "Account Name",
      key: "account",
      render: (_, record) => (
        <div
          style={{
            paddingLeft: `${record.depth * 20}px`,
            fontWeight: record.isGroup ? "bold" : "normal",
            color: record.isGroup ? "#1785b6" : "inherit",
          }}
        >
          {record.accountname}
        </div>
      ),
    },
    {
      title: "Account Code",
      dataIndex: "accountcode",
      key: "accountcode",
      render: (type) =>
        type ? (
          <Text>{type}</Text>
        ) : (
          <Text className="italic" type="secondary">
            N/A
          </Text>
        ),
    },

    {
      title: "Parent Account",
      dataIndex: "parenttype",
      key: "parenttype",
      render: (type) =>
        type ? (
          <Text>{type}</Text>
        ) : (
          <Text className="italic" type="secondary">
            Root Account
          </Text>
        ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (type) =>
        type ? (
          <Text>{type}</Text>
        ) : (
          <Text className="italic" type="secondary">
            N/A
          </Text>
        ),
    },
    {
      title: "Action",
      key: "action",
      width: 120,
      align: "center",
      render: (_, record) => {
        // Don't allow edit/delete on group accounts
        if (record.isGroup) return null;

        return (
          <Space size="small">
            <Button
              type="primary"
              icon={<Icons.EditOutlined />}
              onClick={() => openEditModal(record)}
              title="Edit"
            />
            <Popconfirm
              title="Delete this account?"
              onConfirm={() => handleDelete(record._id)}
              okText="Yes"
              cancelText="No"
              placement="left"
            >
              <Button type="default" danger icon={<Icons.DeleteOutlined />} />
            </Popconfirm>
          </Space>
        );
      },
    },
  ];
  const flatten = (nodes, depth = 0) =>
    nodes.reduce((arr, node) => {
      const { children, ...rest } = node;
      const flat = {
        ...rest,
        depth,
        key: node.isGroup ? `group-${node.accountname}` : node._id,
      };
      arr.push(flat);
      if (node.children?.length) {
        arr.push(...flatten(node.children, depth + 1));
      }
      return arr;
    }, []);

  const tableData = flatten(treeData);
  return (
    <Card className="!m-4 !p-3">
      <Row
        justify="space-between"
        align="middle"
        className="border-b border-gray-200 pb-4"
      >
        <Col>
          <div className="text-xl font-semibold"> Chart of Accounts</div>
        </Col>
        <Col className="!space-x-2">
          <Space size="middle">
            <Button
              type="primary"
              icon={<Icons.PlusCircleOutlined />}
              onClick={openAddModal}
            >
              Add Account
            </Button>
          </Space>
        </Col>
      </Row>
      <Spin spinning={loading}>
        <CustomTable
          tableId="accountId"
          columns={columns}
          data={tableData}
          pagination={false}
          expandable={undefined}
          rowKey="key"
          showHeader={true}
        />
      </Spin>
      <AddAccountModal
        visible={modal.visible}
        onCancel={closeModal}
        companyId={companyId}
        editMode={modal.editMode}
        accountData={modal.record}
      />
    </Card>
  );
};

export default ViewAccount;
