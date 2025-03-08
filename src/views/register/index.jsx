import frameImg from "@/assets/frame.png";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Checkbox, Col, Form, Input, message, Row } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import { fetchRegister } from "../../api/user";

const Register = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const clickSubmit = () => {
    form
      .validateFields()
      .then((vals) => {
        fetchRegister({
          first_name: vals.first_name,
          user_name: vals.user_name,
          email: vals.email,
          password: vals.password,
        })
          .then((res) => {
            messageApi.success("Success");
            if (res.status === "success") {
              localStorage.setItem("tf_token", res.jwt_token);
              localStorage.setItem("tf_user_id", res.user_id);
              localStorage.setItem("tf_user_name", res.user_name);
              navigate("/dashboard");
            }
          })
          .catch(() => {});
      })
      .catch(() => {});
  };

  return (
    <>
      {contextHolder}
      <div
        style={{
          width: "100vw",
          height: "100vh",
          position: "relative",
        }}
      >
        {/* Logo */}
        <div
          style={{
            position: "absolute",
            top: 20,
            left: 30,
            fontSize: 32,
            fontWeight: 700,
          }}
        >
          TaskFlow
        </div>

        {/* form box */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translateX(-50%) translateY(-50%)",
            width: "30%",
            maxWidth: 680,
            border: "1px solid rgba(208, 148, 148, 0.4)",
            boxShadow: "2px 2px 4px 0px rgba(0, 0, 0, 0.25)",
            borderRadius: 10,
            padding: 30,
            paddingBottom: 40,
            paddingTop: 40,
          }}
        >
          <div
            style={{
              display: "flex",
              marginBottom: 30,
            }}
          >
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  color: "rgba(24, 25, 28, 1)",
                  fontSize: 32,
                }}
              >
                Create Account
              </div>
              <div
                style={{
                  fontSize: 14,
                  color: "rgba(94, 102, 112, 1)",
                }}
              >
                Already have account?{" "}
                <a
                  onClick={() => {
                    navigate("/login");
                  }}
                >
                  Log In
                </a>
              </div>
            </div>
            <img
              style={{
                width: 80,
              }}
              src={frameImg}
              alt=""
            />
          </div>

          <Form form={form} autoComplete="off">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="first_name"
                  rules={[
                    {
                      required: true,
                      message: "Please Enter First Name",
                    },
                  ]}
                >
                  <Input placeholder="First Name" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="user_name"
                  rules={[
                    {
                      required: true,
                      message: "Please Enter User Name",
                    },
                  ]}
                >
                  <Input placeholder="User Name" />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please Enter Email",
                },
              ]}
            >
              <Input placeholder="Email address" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please Enter Password",
                },
              ]}
            >
              <Input.Password placeholder="Password" />
            </Form.Item>
            <Form.Item
              name="confirmpwd"
              dependencies={["password"]}
              rules={[
                {
                  required: true,
                  message: "Please Enter Confirm Password",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(
                        "The new password that you entered do not match!"
                      )
                    );
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Confirm Password" />
            </Form.Item>
            <Form.Item
              name="remember"
              valuePropName="checked"
              rules={[
                {
                  required: true,
                  message: "Please read the 'Terms of services'",
                },
              ]}
            >
              <Checkbox>
                I've read and agree with your <a>Terms of Services</a>
              </Checkbox>
            </Form.Item>
          </Form>
          <Button
            icon={<FontAwesomeIcon icon={faArrowRight} />}
            iconPosition="end"
            block
            type="primary"
            onClick={clickSubmit}
          >
            Create Account And Log In
          </Button>
        </div>
      </div>
    </>
  );
};

export default Register;
