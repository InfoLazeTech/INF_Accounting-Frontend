import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Card,
  Statistic,
  Progress,
  Typography,
  List,
  Avatar,
  DatePicker,
  Space,
  Button,
} from "antd";
import {
  ShoppingCartOutlined,
  UserOutlined,
  DollarOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { Line } from "@ant-design/charts";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { getDashboardData } from "../redux/slice/reports/customerReportSlice";
import { filteredURLParams } from "../utlis/services";
import { useSearchParams } from "react-router-dom";
import Icons from "../assets/icon";

const { Title } = Typography;
const { RangePicker } = DatePicker;

const Home = () => {
  const dispatch = useDispatch();
  const { companyId } = useSelector((state) => state.auth);
  const { dashboars, loading } = useSelector((state) => state.customerReport);
  console.log("Dashboard Data:", dashboars);
  const [searchParams, setSearchParams] = useSearchParams();

  const [filter, setFilter] = useState({
    search: searchParams.get("search") || "",
    customerId: searchParams.get("customerId") || "",
    startDate: searchParams.get("startDate") || "",
    endDate: searchParams.get("endDate") || "",
  });


  useEffect(() => {
    if (companyId) {
      const startDate = dayjs().startOf("month").format("YYYY-MM-DD");
      const endDate = dayjs().endOf("month").format("YYYY-MM-DD");

      dispatch(getDashboardData({ companyId, startDate, endDate }));
    }
  }, [dispatch, companyId]);

  const updateUrlParams = (newParams) => {
    const params = new URLSearchParams(searchParams);
    const filterParams = filteredURLParams(params, newParams);
    setSearchParams(filterParams);
  };

  const handleDateChange = (dates) => {
    if (dates && dates[0] && dates[1]) {
      setFilter({
        ...filter,
        startDate: dates[0].format("YYYY-MM-DD"),
        endDate: dates[1].format("YYYY-MM-DD"),
      });
    } else {
      setFilter({ ...filter, startDate: "", endDate: "" });
    }
  };
  const handleSearch = () => {
    const searchValue = filter.search ? String(filter.search) : "";

    // update URL params
    updateUrlParams({
      companyId,
      search: searchValue,
      customerId: filter.customerId,
      startDate: filter.startDate,
      endDate: filter.endDate,
    });

    dispatch(
      getDashboardData({
        companyId,
        startDate: filter.startDate || dayjs().startOf("month").format("YYYY-MM-DD"),
        endDate: filter.endDate || dayjs().endOf("month").format("YYYY-MM-DD"),
      })
    );
  };


  const handleClear = () => {
    const startDate = dayjs().startOf("month").format("YYYY-MM-DD");
    const endDate = dayjs().endOf("month").format("YYYY-MM-DD");

    setFilter({
      search: "",
      customerId: "",
      startDate: startDate,
      endDate: endDate,
    });

    updateUrlParams({
      search: "",
      customerId: "",
      startDate,
      endDate,
    });

    dispatch(
      getDashboardData({
        companyId,
        startDate,
        endDate,
      })
    );
  };


  const salesData = [
    { month: "Jan", sales: 1200 },
    { month: "Feb", sales: 1500 },
    { month: "Mar", sales: 1800 },
    { month: "Apr", sales: 2000 },
    { month: "May", sales: 2200 },
    { month: "Jun", sales: 2500 },
  ];

  const recentActivities = [
    { title: "New customer added", time: "2 hours ago" },
    { title: "Order #1023 completed", time: "5 hours ago" },
    { title: "Stock for Item A updated", time: "1 day ago" },
    { title: "Invoice #512 generated", time: "2 days ago" },
  ];

  // Chart configuration
  const config = {
    data: salesData,
    xField: "month",
    yField: "sales",
    smooth: true,
    point: { size: 5, shape: "diamond" },
    tooltip: { showCrosshairs: true, shared: true },
    height: 250,
    color: "#1890ff",
  };

  return (
    <div style={{ padding: 24, minHeight: "100vh" }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 20 }}>
        <Col>
          <Title level={2} style={{ margin: 0 }}>Dashboard</Title>
        </Col>

        <Col>
          <Space>
            <RangePicker
              value={
                filter.startDate
                  ? [dayjs(filter.startDate), dayjs(filter.endDate)]
                  : null
              }
              onChange={handleDateChange}
              format="YYYY-MM-DD"
            />
            <Button icon={<Icons.ClearOutlined />} onClick={handleClear}>
              Clear
            </Button>
            <Button type="primary" icon={<Icons.FilterOutlined />} onClick={handleSearch}>
              Apply
            </Button>
          </Space>
        </Col>
      </Row>

      {/* Top Stats */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Total Customers"
              value={dashboars?.totalCustomer || 0}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Total Sales"
              value={dashboars?.totalSalesCount || 0}
              prefix={<ShoppingCartOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Sales Revenue"
              value={dashboars?.totalSales || 0}
              prefix={<span style={{ fontWeight: "bold" }}>₹</span>}
              precision={2}
            />
          </Card>
        </Col>
        {/* <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title="Stock Level" value={78} suffix="%" />
            <Progress percent={78} status="active" />
          </Card>
        </Col> */}
      </Row>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Total Vendor"
              value={dashboars?.totalVendor || 0}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Total Purchase"
              value={dashboars?.totalPurchaseCount || 0}
              prefix={<ShoppingCartOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Purchase Revenue"
              value={dashboars?.totalSales || 0}
              prefix={<span style={{ fontWeight: "bold" }}>₹</span>}
              precision={2}
            />
          </Card>
        </Col>
        {/* <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title="Stock Level" value={78} suffix="%" />
            <Progress percent={78} status="active" />
          </Card>
        </Col> */}
      </Row>

      {/* Sales Chart & Top Items */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} md={16}>
          <Card title="Sales Overview">
            <Line {...config} />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card title="Top Selling Items">
            <List
              itemLayout="horizontal"
              dataSource={[
                "Item A - 250 sold",
                "Item B - 200 sold",
                "Item C - 180 sold",
                "Item D - 150 sold",
                "Item E - 120 sold",
              ]}
              renderItem={(item) => <List.Item>{item}</List.Item>}
            />
          </Card>
        </Col>
      </Row>

      {/* Recent Activities */}
      {/* <Row gutter={16}>
        <Col xs={24} md={12}>
          <Card title="Recent Activities">
            <List
              itemLayout="horizontal"
              dataSource={recentActivities}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon={<ClockCircleOutlined />} />}
                    title={item.title}
                    description={item.time}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card title="Goals">
            <div style={{ marginBottom: 16 }}>
              <Statistic title="Monthly Sales Target" value={3000} />
              <Progress percent={(2500 / 3000) * 100} status="active" />
            </div>
            <div style={{ marginBottom: 16 }}>
              <Statistic title="Customer Growth Target" value={500} />
              <Progress percent={(1200 / 1500) * 100} status="active" />
            </div>
          </Card>
        </Col>
      </Row> */}
    </div>
  );
};

export default Home;
