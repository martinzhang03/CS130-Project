import frameImg from "@/assets/frame.png";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Checkbox, Col, Form, Input, Row } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  return (
    <>
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
                <Form.Item name="fullName">
                  <Input placeholder="Full Name" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="userName">
                  <Input placeholder="User Name" />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item name="email">
              <Input placeholder="Email address" />
            </Form.Item>
            <Form.Item name="pwd">
              <Input.Password placeholder="Password" />
            </Form.Item>
            <Form.Item name="confirmpwd">
              <Input.Password placeholder="Confirm Password" />
            </Form.Item>
            <Form.Item name="remember" valuePropName="checked">
              <Checkbox>
                Remember me <a href="">Terms of Services</a>
              </Checkbox>
            </Form.Item>
          </Form>
          <Button
            icon={<FontAwesomeIcon icon={faArrowRight} />}
            iconPosition="end"
            block
            type="primary"
          >
            Create Account
          </Button>
        </div>
      </div>
    </>
  );
};

export default Register;
