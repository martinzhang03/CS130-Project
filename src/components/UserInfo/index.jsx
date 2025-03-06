import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Form, Input, Modal, Space } from "antd";
import { useCallback, useState } from "react";

const UserInfo = ({ open = false, onOk, onCancel }) => {
  const [form] = Form.useForm();

  const [isEdit, setIsEdit] = useState(false);

  const _onOk = useCallback(() => {
    onOk?.();
  }, [onOk]);
  const _onCancel = useCallback(() => {
    onCancel?.();
    setIsEdit(false);
    form.resetFields();
  }, [onCancel]);
  return (
    <>
      <Modal
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
                <Button type="primary">Submit</Button>
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
