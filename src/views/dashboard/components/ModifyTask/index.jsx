import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
  Slider,
  TimePicker,
} from "antd";

import React, { useCallback, useEffect, useState } from "react";
import { fetchUsers } from "../../../../api/user";
import {
  fetchCreateTask,
  fetchTasks,
  fetchUpdateTask,
} from "../../../../api/task";
import dayjs from "dayjs";
import { faTruckRampBox } from "@fortawesome/free-solid-svg-icons";
const { TextArea } = Input;

const ModifyTask = ({ open = false, infos, onOk, onCancel }) => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);

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
        let info = {
          task_id: infos?.task_id,
          // task_id: 1,
          task_name: vals.task_name,
          start_date: dayjs(vals.startDate).format("YYYY-MM-DD"),
          start_time: dayjs(vals.startDate).format("HH:mm:ss"),
          due_date: dayjs(vals.endDate).format("YYYY-MM-DD"),
          due_time: dayjs(vals.endDate).format("HH:mm:ss"),
          dependencies: vals.dependencies ? [vals.dependencies] : [],
          assignees: vals.assignees,
          description: vals.description,
          progress: vals.progress,
          percentage: vals.percentage,
        };
        console.log(info);
        if (!infos) {
          fetchCreateTask(info)
            .then((res) => {
              if (res?.status === "success") {
                messageApi.success(res?.message ?? "Success");
                _onCancel();
              }
            })
            .catch(() => {});
        } else {
          fetchUpdateTask(info)
            .then((res) => {
              if (res?.status === "success") {
                messageApi.success(res?.message ?? "Success");
                _onOk();
              }
            })
            .catch(() => {});
        }

        // "task_id": 0,
        // "task_name": "string",
        // "start_date": "2025-03-04",
        // "start_time": "11:38:24.504Z",
        // "due_date": "2025-03-04",
        // "due_time": "11:38:24.504Z",
        // "dependencies": [],
        // "assignees": [],
        // "description": "string"
      })
      .catch(() => {});
  };

  useEffect(() => {
    const getUsers = () => {
      fetchUsers()
        .then((res) => {
          if (res?.status === "success") {
            setUsers(res?.user_list ?? []);
          }
        })
        .catch(() => {});
    };

    const getTasks = () => {
      fetchTasks()
        .then((res) => {
          console.log(res);
          if (res?.status === "success") {
            setTasks(res?.user_tasks ?? []);
          }
        })
        .catch(() => {});
    };
    if (open) {
      getUsers();
      getTasks();
    }
  }, [open]);

  useEffect(() => {
    if (infos) {
      console.log(infos);
      form.setFieldsValue({
        ...infos,
        dependencies: infos.dependencies?.[0],
        startDate: dayjs(infos.start_datetime),
        endDate: dayjs(infos.due_datetime),
      });
    }
  }, [infos]);
  return (
    <>
      {contextHolder}
      <Modal
        title={infos ? "Edit Task" : "Create Task"}
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
                {infos ? "Submit" : "Create"}
              </Button>
            </div>
          </>
        }
      >
        <Form form={form} layout="vertical" autoComplete="off">
          <Form.Item
            name="task_name"
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
            name="startDate"
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
            name="endDate"
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
            name="assignees"
            label="Assign this task to"
            rules={[
              {
                required: true,
                message: "Please Select Assion This Task To",
              },
            ]}
          >
            <Select
              options={users}
              mode="multiple"
              fieldNames={{
                label: "username",
                value: "id",
              }}
              placeholder="Assign this task to"
            />
          </Form.Item>
          <Form.Item
            name="dependencies"
            label="Dependency"
            rules={[
              {
                required: false,
                message: "Please Select Dependency Task",
              },
            ]}
          >
            <Select
              allowClear
              options={
                infos
                  ? tasks.filter((task) => task.task_id != infos.task_id)
                  : tasks
              }
              fieldNames={{
                label: "task_name",
                value: "task_id",
              }}
              placeholder="Dependency"
            />
          </Form.Item>
          {infos && (
            <Form.Item name="percentage" label="percentage">
              <Slider
                tooltip={{
                  formatter: (value) => `${value}%`,
                }}
              />
            </Form.Item>
          )}

          <Form.Item name="progress" label="progress" hidden={true}></Form.Item>
          <Form.Item name="description" label="Description">
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
