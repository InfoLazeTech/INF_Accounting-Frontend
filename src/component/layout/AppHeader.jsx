import Icons from "../../assets/icon";
import {
  Avatar,
  Button,
  Dropdown,
  Layout,
  Menu,
  Tooltip,
  Typography,
} from "antd";
import { NavLink, useNavigate } from "react-router-dom";
import { colorPalette } from "../../utlis/theme";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../redux/slice/auth/authSlice";
const { Header } = Layout;
const { Text } = Typography;

const AppHeader = ({ collapsed, toggleSidebar }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login", { replace: true });
  };

  const menu = (
    <Menu>
      <Menu.Item key="1" icon={<Icons.UserOutlined />}>
        <NavLink to="/profile">My Profile</NavLink>
      </Menu.Item>
      <Menu.Item key="2" icon={<Icons.BarChartOutlined />}>
        <NavLink to="/account">Chart of Accounts</NavLink>
      </Menu.Item>
      <Menu.Item
        key="3"
        icon={<Icons.PoweroffOutlined />}
        danger
        onClick={handleLogout}
      >
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <Header className="bg-white !px-4 !sm:px-6 flex items-center justify-between sticky top-0 z-20 w-full shadow-sm border-b border-gray-200 h-16">
        <div className="flex items-center">
          <Button
            type="text"
            icon={
              collapsed ? (
                <Icons.MenuUnfoldOutlined />
              ) : (
                <Icons.MenuFoldOutlined />
              )
            }
            onClick={toggleSidebar}
            className="text-xl no-hover"
            style={{
              fontSize: 17,
              width: 40,
              height: 40,
              background: "transparent",
              border: "none",
            }}
          />
          <style jsx global>{`
            .no-hover:hover,
            .no-hover:focus,
            .no-hover:active {
              background: transparent !important;
              border: none !important;
              box-shadow: none !important;
            }
          `}</style>
          <div className="">
            <Text className="!text-base !text-gray-600">
              Welcome back,{" "}
              <Text className="font-bold !text-base">{user.name}</Text>
            </Text>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Tooltip title="Click here to sync your data!">
            <Button
              type="default"
              icon={<Icons.SyncOutlined />}
              onClick={() => window.location.reload()}
              className="sm:flex items-center"
            />
          </Tooltip>
          {/* <Button
            type="default"
            icon={<Icons.SettingOutlined />}
            onClick={() => navigate("/setting?tab=profile")}
          /> */}
          <Dropdown overlay={menu} trigger={["click"]}>
            <div className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-100 transition-colors min-w-0">
              <Avatar
                className="flex-shrink-0"
                style={{
                  background: colorPalette.primary[500],
                  color: "#fff",
                }}
              >
                <Icons.UserOutlined />
              </Avatar>
              <div className="hidden lg:flex flex-col items-start min-w-0 flex-1">
                <Text
                  className={`!font-semibold !text-sm truncate max-w-[120px]`}
                >
                  {user?.name}
                </Text>
                <Text className="!text-xs !text-gray-500 truncate max-w-[120px]">
                  {user?.company?.companyName}
                </Text>
              </div>
            </div>
          </Dropdown>
        </div>
      </Header>
    </>
  );
};

export default AppHeader;
