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

const ModifyTask = ({ open = false, onOk, onCancel }) => {
  const [form] = Form.useForm();

  const _onOk = useCallback(() => {
    onOk?.();
  }, [onOk]);
  const _onCancel = useCallback(() => {
    onCancel?.();
    form.resetFields();
  }, [onCancel]);

  const clickSubmit = () => {
    form
      .validateFields()
      .then((vals) => {
        console.log(vals);
      })
      .catch(() => {});
  };
  return (
    <>
      <Modal
        title="Create Task"
        centered
        open={open}
        width={600}
        onOk={_onOk}
        onCancel={_onCancel}
        footer={
          <>
            <div
              style={{
                textAlign: "center",
              }}
            >
              <Button type="primary" onClick={clickSubmit}>
                Create
              </Button>
            </div>
          </>
        }
      >
        <Form form={form} layout="vertical" autoComplete="off">
          <Form.Item
            name="taskName"
            label="Task Name"
            rules={[
              {
                required: true,
                message: "Please Enter Task Name",
              },
            ]}
          >
            <Input placeholder="Task Name" />
          </Form.Item>
          <Form.Item
            name="dependency"
            label="Dependency"
            rules={[
              {
                required: true,
                message: "Please Select Dependency Task",
              },
            ]}
          >
            <Select options={[]} placeholder="Dependency" />
          </Form.Item>
          <Form.Item
            name="startTime"
            label="Start Time"
            rules={[
              {
                required: true,
                message: "Please Pick Start Time",
              },
            ]}
          >
            <DatePicker
              format={"YYYY-MM-DD hh:mm"}
              showTime
              style={{
                width: "100%",
              }}
            />
          </Form.Item>
          <Form.Item
            name="endTime"
            label="End Time"
            rules={[
              {
                required: true,
                message: "Please Pick End Time",
              },
            ]}
          >
            <DatePicker
              format={"YYYY-MM-DD hh:mm"}
              showTime
              style={{
                width: "100%",
              }}
            />
          </Form.Item>
          <Form.Item
            name="assign"
            label="Assign this task to"
            rules={[
              {
                required: true,
                message: "Please Select Assion This Task To",
              },
            ]}
          >
            <Select options={[]} placeholder="Assign this task to" />
          </Form.Item>
          <Form.Item name="desc" label="Description">
            <TextArea
              autoSize={{ minRows: 4, maxRows: 4 }}
              placeholder="Description"
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ModifyTask;
