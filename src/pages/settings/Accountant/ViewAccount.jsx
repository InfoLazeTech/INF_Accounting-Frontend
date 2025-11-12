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
} from "antd";
import Icons from "../../../assets/icon";
import Title from "antd/es/skeleton/Title";
import CustomTable from "../../../component/commonComponent/CustomTable";
import AddAccountModal from "../Accountant/AddAccount";
import { getAccounts } from "../../../redux/slice/account/accountSlice";
import { selectAccountTree } from "../Accountant/selectors";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { useEffect } from "react";
const { Text } = Typography;

const ViewAccount = () => {
  const dispatch = useDispatch();
  const { accounts, pagination, loading } = useSelector((s) => s.account);
  const treeData = useSelector(selectAccountTree);
  const [modalVisible, setModalVisible] = useState(false);
  const { companyId } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getAccounts({ companyId, page: 1, limit: 100 }));
  }, [dispatch, companyId]);

  const columns = [
    {
      title: "Account Name",
      dataIndex: "accontname",
      key: "accountname",
      render: (_, record) => (
        <div style={{ paddingLeft: `${record.depth * 20}px` }}>
          {record.accountname}
        </div>
      ),
    
    },
    {
      title: "Account Code",
      dataIndex: "accountcode",
      key: "accountcode",
      
    },

   {
  title: "Parent Type",
  dataIndex: "parenttype",
  key: "parenttype",
  render: (type) => <Text type="secondary">{type || "-"}</Text>,
},
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
  ];
  const flatten = (nodes, depth = 0, parentName = null) =>
    nodes.reduce((arr, node) => {
      const flat = {
        ...node,
        depth,
        parentName,
        key: node._id,
      };
      arr.push(flat);
      if (node.children?.length) {
        arr.push(...flatten(node.children, depth + 1, node.accountname));
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
              onClick={() => setModalVisible(true)}
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
          pagination={false}   // tree view – no pagination needed
        />
      </Spin>
      <AddAccountModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        companyId={companyId}
      />
    </Card>
  );
};

export default ViewAccount;
