import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Form, Input, message, Modal, Space } from "antd";
import { use, useCallback, useEffect, useState } from "react";
import { fetchUpdateUserInfo, fetchUserInfo } from "../../api/user";
import { useAtom } from "jotai";
import { updateNameAtom } from "../Header";

const UserInfo = ({ open = false, onOk, onCancel }) => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [, setUpdateName] = useAtom(updateNameAtom);
  const [isEdit, setIsEdit] = useState(false);

  const _onOk = useCallback(() => {
    onOk?.();
  }, [onOk]);

  const _onCancel = useCallback(() => {
    onCancel?.();
    setIsEdit(false);
    form.resetFields();
  }, [onCancel]);

  const handleSubmit = () => {
    form
      .validateFields()
      .then((val) => {
        fetchUpdateUserInfo({
          ...val,
          user_id: localStorage.getItem("tf_user_id"),
        }).then((res) => {
          if (res?.status === "success") {
            messageApi.success("Success");
            setIsEdit(false);
            localStorage.setItem("tf_user_name", val.user_name);
            setUpdateName(true);
            _onCancel();
          }
        });
      })
      .catch(() => {});
  };

  useEffect(() => {
    const fetchInfo = (id) => {
      fetchUserInfo(id)
        .then((res) => {
          console.log(res);
          if (res.status === "success") {
            let infos = res.user ?? {};
            form.setFieldsValue({
              first_name: infos.firstname,
              user_name: infos.username,
              email: infos.email,
            });
          }
        })
        .catch(() => {});
    };
    const getUserInfo = () => {
      let userId = localStorage.getItem("tf_user_id");
      if (userId) {
        fetchInfo(userId);
      }
    };
    if (open) getUserInfo();
  }, [open]);
  return (
    <>
      {contextHolder}
      <Modal
        maskClosable={false}
        title="My Info"
        open={open}
        centered
        onOk={_onOk}
        onCancel={_onCancel}
        footer={
          <div
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            {isEdit ? (
              <Space>
                <Button
                  onClick={() => {
                    setIsEdit(false);
                  }}
                >
                  Cancel
                </Button>
                <Button type="primary" onClick={handleSubmit}>
                  Submit
                </Button>
              </Space>
            ) : (
              <Space>
                <Button
                  icon={<FontAwesomeIcon icon={faPenToSquare} />}
                  onClick={() => {
                    setIsEdit(true);
                  }}
                >
                  Edit
                </Button>
              </Space>
            )}
          </div>
        }
      >
        <Form form={form} labelCol={{ span: 5 }} requiredMark={isEdit}>
          <Form.Item
            name="first_name"
            label="First Name"
            rules={[
              {
                required: true,
                message: "Please Enter First Name",
              },
            ]}
          >
            <Input disabled={!isEdit} placeholder="First Name" />
          </Form.Item>
          <Form.Item
            name="user_name"
            label="User Name"
            rules={[
              {
                required: true,
                message: "Please Enter User Name",
              },
            ]}
          >
            <Input disabled={!isEdit} placeholder="User Name" />
          </Form.Item>
          <Form.Item name="email" label="Email">
            <Input disabled={true} placeholder="Email" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default UserInfo;
