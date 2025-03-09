import { Form, message, Modal, Radio } from "antd";
import { useCallback } from "react";
import { fetchChangeProgress } from "../../../../api/task";

const ChangeProgress = ({ open = false, infos, onOk, onCancel }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const _onOk = useCallback(() => {
    onOk?.();
  }, [onOk]);
  const _onCancel = useCallback(() => {
    onCancel?.();
  }, [onCancel]);

  const handleSubmit = () => {
    form
      .validateFields()
      .then((vals) => {
        console.log(vals);
        fetchChangeProgress({
          task_id: infos.task_id,
          up: vals.direct == "prev" ? true : false,
          down: vals.direct == "next" ? true : false,
        }).then((res) => {
          if (res?.status === "success") {
            messageApi.success(res?.message ?? "Success");
            _onOk();
          }
        });
      })
      .catch(() => {});
  };
  return (
    <>
      {contextHolder}
      <Modal
        open={open}
        centered
        maskClosable={false}
        title={`Change ${infos?.task_name} Progress`}
        onCancel={_onCancel}
        onOk={handleSubmit}
      >
        <Form
          form={form}
          initialValues={{
            direct: "next",
          }}
        >
          <Form.Item name="direct" label="Change to">
            <Radio.Group
              options={[
                {
                  label: "Prev Progress",
                  value: "prev",
                },
                {
                  label: "Next Progress",
                  value: "next",
                },
              ]}
            ></Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ChangeProgress;
