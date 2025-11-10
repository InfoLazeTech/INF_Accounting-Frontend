import { Card, Form, Button, Row, Col, Spin, Typography } from "antd";
import CustomInput from "../../component/commonComponent/CustomInput";
import { useNavigate, useParams } from "react-router-dom";
import Icons from "../../assets/icon";
import { useDispatch, useSelector } from "react-redux";
import { addbank } from "../../redux/slice/bank/bankSlice";

const { Title } = Typography;

function AddNewAccount() {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { customerId } = useParams();
    const { companyId } = useSelector((state) => state.auth);
    const { postLoading } = useSelector((state) => state.bank);

    const onFinish = (values) => {
        const payload = {
            ...values,
            companyId,
        };

        dispatch(addbank(payload)).then((res) => {
            if (!res.error) navigate("/banking");
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
                            onClick={() => navigate("/banking")}
                            style={{ marginRight: 8 }}
                        />
                    </Col>
                    <Col>
                        <Title level={3} style={{ margin: 0 }}>
                            Add Bank Account
                        </Title>
                    </Col>
                </Row>

                {/* Form */}
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    className="min-h-[70vh] !px-2"
                >
                    {/* Basic Info */}
                    <Row gutter={16}>
                        <Col span={8}>
                            <CustomInput
                                type="text"
                                name="bankName"
                                label="Bank Name"
                                placeholder="Enter Bank Name"
                                rules={[{ required: true, message: "Please enter bank name" }]}
                            />
                        </Col>
                        <Col span={8}>
                            <CustomInput
                                type="number"
                                name="accountNumber"
                                label="Bank Account Number"
                                placeholder="Enter Account Number"
                                rules={[{ required: true, message: "Please enter Account Number" }]}
                            />
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={8}>
                            <CustomInput
                                type="number"
                                name="openingBalance"
                                label="Opening Balance"
                                placeholder="Enter Opening Balance"
                                // rules={[{ required: true, message: "Please enter Opening Balance" }]}
                            />
                        </Col>
                    </Row>
                </Form>
            </Card>

            {/* Bottom Action Bar */}
            <div className="flex items-center gap-5 py-4 px-12 border-t border-l border-gray-200 w-full bg-white fixed bottom-0 shadow-[0_-1px_10px_rgba(0,0,0,0.08)] z-10">
                <Button type="primary" onClick={() => form.submit()}>
                    {postLoading ? "Saving..." : "Save Bank Account"}
                </Button>
                <Button onClick={() => navigate("/banking")}>Cancel</Button>
            </div>
        </div>
    )
}

export default AddNewAccount