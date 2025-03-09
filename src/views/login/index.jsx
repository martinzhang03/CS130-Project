import frameImg from "@/assets/frame.png";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Checkbox, Flex, Form, Input, message } from "antd";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchLogin } from "../../api/user";

const Login = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const clickLogin = () => {
    form
      .validateFields()
      .then((vals) => {
        console.log(vals);
        if (vals.remember) {
          localStorage.setItem("tf_email", vals.email);
          localStorage.setItem("tf_pwd", vals.password);
        } else {
          localStorage.removeItem("tf_email");
          localStorage.removeItem("tf_pwd");
        }
        fetchLogin({
          email: vals.email,
          password: vals.password,
        })
          .then((res) => {
            messageApi.success("Success");
            if (res.status === "success") {
              localStorage.setItem("tf_token", res.jwt_token);
              localStorage.setItem("tf_user_id", res.user_id);
              navigate("/dashboard");
            }
          })
          .catch(() => {});
      })
      .catch(() => {});
  };

  useEffect(() => {
    const getLoginInfo = () => {
      let email = localStorage.getItem("tf_email");
      let pwd = localStorage.getItem("tf_pwd");
      if (email && pwd) {
        form.setFieldsValue({
          email: email,
          password: pwd,
          remember: true,
        });
      }
    };
    if (form) getLoginInfo();
  }, [form]);

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
              fontSize: 0,
              textAlign: "center",
            }}
          >
            <img
              style={{
                width: 80,
              }}
              src={frameImg}
              alt=""
            />
          </div>
          <div
            style={{
              marginBottom: 24,
              color: "rgba(24, 25, 28, 1)",
              fontSize: 32,
              textAlign: "center",
              marginTop: 30,
            }}
          >
            Sign in to TaskFlow
          </div>
          <div
            style={{
              color: "rgba(94, 102, 112, 1)",
              fontSize: 16,
              fontWeight: 500,
              textAlign: "center",
              marginBottom: 24,
            }}
          >
            Don’t have account
            <a
              style={{
                marginLeft: 5,
              }}
              onClick={() => {
                navigate("/register");
              }}
            >
              Create Account
            </a>
          </div>

          <Form form={form} autoComplete="off">
            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please Enter Your Email Address",
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
                  message: "Please Enter Your Password",
                },
              ]}
            >
              <Input.Password placeholder="Password" />
            </Form.Item>
            <Form.Item>
              <Flex justify="space-between" align="center">
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>Remember me</Checkbox>
                </Form.Item>
                <Button
                  type="link"
                  onClick={() => {
                    navigate("/resetpwd");
                  }}
                >
                  Forgot password
                </Button>
              </Flex>
            </Form.Item>
          </Form>
          <Button
            icon={<FontAwesomeIcon icon={faArrowRight} />}
            iconPosition="end"
            block
            type="primary"
            onClick={clickLogin}
          >
            Sign In
          </Button>
        </div>
      </div>
    </>
  );
};

export default Login;
