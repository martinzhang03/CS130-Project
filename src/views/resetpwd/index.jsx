import { useNavigate } from "react-router-dom";
import React from "react";
import { Button, Checkbox, Col, Form, Input, message, Row, Space } from "antd";
import frameImg from "@/assets/frame.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { fetchResetPwd, fetchSendCode } from "../../api/user";

const ResetPwd = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const clickSubmit = () => {
    form
      .validateFields()
      .then((vals) => {
        console.log(vals);
        fetchResetPwd({ ...vals })
          .then((res) => {
            if (res.status === "success") {
              messageApi.success(res.message ?? "Success").then(() => {
                navigate("/login");
              });
            }
          })
          .catch(() => {});
      })
      .catch(() => {});
  };

  const sendResetCode = () => {
    let email = form.getFieldValue("email");
    if (email) {
      fetchSendCode({ email })
        .then((res) => {
          console.log(res);
          if (res.status === "success") {
            messageApi.success(res.message ?? "Success");
          }
        })
        .catch(() => {});
    } else {
      // form.setFieldValue()
      form.setFields([
        {
          name: "email",
          errors: ["Please Enter Email"],
        },
      ]);
    }
  };
  return (
    <>
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
                  Reset Your Password
                </div>
                <div
                  style={{
                    fontSize: 14,
                    color: "rgba(94, 102, 112, 1)",
                  }}
                >
                  Enter your registered email
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
              <Form.Item noStyle>
                <Form.Item
                  name="email"
                  style={{
                    display: "inline-block",
                    width: "calc(70% - 8px)",
                  }}
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
                  //   noStyle
                  style={{
                    display: "inline-block",
                    width: "calc(30% - 8px)",
                    margin: "0 8px",
                  }}
                >
                  <Button
                    style={{
                      width: "100%",
                    }}
                    type="primary"
                    onClick={sendResetCode}
                  >
                    Send Code
                  </Button>
                </Form.Item>
              </Form.Item>
              <Form.Item
                name="confirm_code"
                rules={[
                  {
                    required: true,
                    message: "Please Enter Verify Code",
                  },
                ]}
              >
                <Input placeholder="Verify Code" />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Please Enter New Password",
                  },
                ]}
              >
                <Input.Password placeholder="New Password" />
              </Form.Item>
            </Form>
            <Button
              //   icon={<FontAwesomeIcon icon={faArrowRight} />}
              //   iconPosition="end"
              block
              type="primary"
              onClick={clickSubmit}
            >
              Submit To Reset Password
            </Button>
            <Button
              style={{
                marginTop: 20,
              }}
              block
              onClick={() => {
                navigate("/login");
              }}
            >
              Back To Log In
            </Button>
          </div>
        </div>
      </>
    </>
  );
};

export default ResetPwd;
