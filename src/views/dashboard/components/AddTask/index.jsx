import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Row,
  Select,
  TimePicker,
} from "antd";

import React, { useCallback, useEffect } from "react";
const { TextArea } = Input;

const AddTask = ({ open = false, onOk, onCancel }) => {
  const [form] = Form.useForm();

  const _onOk = useCallback(() => {
    onOk?.();
  }, [onOk]);
  const _onCancel = useCallback(() => {
    onCancel?.();
  }, [onCancel]);
  return (
    <>
      <Modal
        title="Create Task"
        centered
        open={open}
        onOk={_onOk}
        onCancel={_onCancel}
        footer={
          <>
            <div
              style={{
                textAlign: "center",
              }}
            >
              <Button type="primary">Create</Button>
            </div>
          </>
        }
      >
        <Form form={form} layout="vertical" autoComplete="off">
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item name="taskName" label="Task Name">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="dependency" label="Dependency">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item name="date" label="Due Date">
                <DatePicker
                  style={{
                    width: "100%",
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="time" label="Due Time">
                <TimePicker
                  style={{
                    width: "100%",
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="assign" label="Assign this task to">
            <Select options={[]} />
          </Form.Item>
          <Form.Item name="desc" label="Description">
            <TextArea autoSize={{ minRows: 4, maxRows: 4 }} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AddTask;
