import { Space } from "antd";
import React from "react";
import TaskItem from "../TaskItem";

const bgColorMap = {
  wait: "#e3e3e3",
  progress: "#108ee9b8",
  review: "#2db7f5b8",
  done: "#87d068b8",
};

const TaskStatusBox = ({ infos, status = "wait" }) => {
  return (
    <>
      <div
        style={{
          flex: 1,
          height: "100%",
          // backgroundColor: "var(--bgColor)",
          borderRadius: 5,
          display: "flex",
          flexDirection: "column",
          backgroundColor: bgColorMap[status],
        }}
      >
        <div
          style={{
            fontSize: 14,
            color: "#fff",
            fontWeight: 500,
            textAlign: "center",
            padding: 8,
          }}
        >
          {infos.label}
        </div>
        <div
          style={{
            flex: 1,
            height: 0,
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              overflowY: "auto",
              top: 0,
              left: 0,
              padding: 12,
              paddingTop: 0,
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
              }}
            >
              <Space
                direction="vertical"
                style={{
                  width: "100%",
                }}
                size={16}
              >
                {infos.tasks.map((task) => {
                  return <TaskItem key={task.task_id} infos={task} />;
                })}
              </Space>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TaskStatusBox;
