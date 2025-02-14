import { Button } from "antd";
import React, { useState } from "react";
import AddTask from "./components/AddTask";

const DashBoard = () => {
  const [addTask, setAddTask] = useState(false);

  return (
    <>
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "#999",
          padding: 15,
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
          }}
        >
          {/* content */}
          <div
            style={{
              flex: 1,
              marginRight: 15,
              borderRadius: 10,
              backgroundColor: "#fff",
              padding: 15,
            }}
          >
            <Button
              onClick={() => {
                setAddTask(true);
              }}
            >
              Add Task
            </Button>
          </div>
          {/* right */}
          <div
            style={{
              width: 300,
              height: "100%",
              borderRadius: 10,
              backgroundColor: "#fff",
            }}
          ></div>
        </div>
      </div>

      <AddTask
        open={addTask}
        onCancel={() => {
          setAddTask(false);
        }}
      />
    </>
  );
};

export default DashBoard;
