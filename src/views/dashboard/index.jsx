import { faCalendar, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "antd";
import dayjs from "dayjs";
import React, { useState } from "react";
import AddTask from "./components/AddTask";
import TaskItem from "./components/TaskItem";

const taskList = [
  {
    taskId: 1,
    name: "Task A This task foucus on the App design",
    desc: "This task foucus on the App design.",
    startTime: "2025-02-18",
    endTime: "",
    progress: "0",
    status: "wait",
    assgins: [
      {
        userId: 1,
        name: "A",
      },
      {
        userId: 2,
        name: "B",
      },
      {
        userId: 3,
        name: "C",
      },
      {
        userId: 4,
        name: "D",
      },
    ],
  },
  {
    taskId: 2,
    name: "Task B",
    desc: "This task foucus on the App design.",
    startTime: "2025-02-18",
    endTime: "",
    progress: "0",
    status: "wait",
    assgins: [
      {
        userId: 1,
        name: "A",
      },
      {
        userId: 2,
        name: "B",
      },
      {
        userId: 3,
        name: "C",
      },
      {
        userId: 4,
        name: "D",
      },
    ],
  },
  {
    taskId: 3,
    name: "Task C",
    desc: "This task foucus on the App design.",
    startTime: "2025-02-18",
    endTime: "",
    progress: "0",
    status: "wait",
    assgins: [
      {
        userId: 1,
        name: "A",
      },
      {
        userId: 2,
        name: "B",
      },
      {
        userId: 3,
        name: "C",
      },
      {
        userId: 4,
        name: "D",
      },
    ],
  },
];

const DashBoard = () => {
  const [addTask, setAddTask] = useState(false);

  return (
    <>
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "rgb(240,242,245)",
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
              borderRadius: 5,
              backgroundColor: "#fff",
              padding: 15,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* top */}
            <div
              style={{
                display: "flex",
                marginBottom: 15,
              }}
            >
              <div
                style={{
                  flex: 1,
                }}
              >
                <div
                  style={{
                    width: "max-content",
                    height: 32,
                    backgroundColor: "var(--bgColor)",
                    borderRadius: 5,
                    display: "flex",
                    alignItems: "center",
                    padding: "0px 15px",
                  }}
                >
                  <FontAwesomeIcon icon={faCalendar} />
                  <div
                    style={{
                      fontSize: 14,
                      marginLeft: 8,
                    }}
                  >
                    {dayjs().format("MMMM YYYY")}
                  </div>
                </div>
              </div>
              <Button
                onClick={() => {
                  setAddTask(true);
                }}
                icon={<FontAwesomeIcon icon={faPlus} />}
                type="primary"
              >
                Create Task
              </Button>
            </div>
            {/* task list */}
            <div
              style={{
                width: "100%",
                // height: 220,
                backgroundColor: "var(--bgColor)",
                borderRadius: 5,
                padding: 15,
              }}
            >
              <TaskItem infos={taskList[0]}></TaskItem>
            </div>
            {/* task view */}
            <div></div>
          </div>
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
