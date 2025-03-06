import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Input } from "antd";
import React from "react";
import TeamChat from "../../components/TeamChat";
import TaskStatusBox from "./components/TaskStatuBox";

const taskInfos = [
  {
    key: "wait",
    label: "Backlog",

    tasks: [
      {
        taskId: 1,
        name: "Task A",
        date: "2025-02-18 21:39:00",
        desc: "This is task desciption",
        users: [
          {
            userId: 1,
            name: "KL",
          },
          {
            userId: 2,
            name: "K",
          },
          {
            userId: 3,
            name: "E",
          },
        ],
      },
      {
        taskId: 2,
        name: "Task B",
        date: "2025-02-18 21:39:00",
        desc: "This is task desciption",
        users: [
          {
            userId: 1,
            name: "KL",
          },
          {
            userId: 2,
            name: "K",
          },
          {
            userId: 3,
            name: "E",
          },
        ],
      },
    ],
  },
  {
    key: "progress",
    label: "In Progress",

    tasks: [
      {
        taskId: 3,
        name: "Task C",
        date: "2025-02-18 21:39:00",
        desc: "This is task desciption",
        users: [
          {
            userId: 1,
            name: "KL",
          },
          {
            userId: 2,
            name: "K",
          },
          {
            userId: 3,
            name: "E",
          },
        ],
      },
    ],
  },
  {
    key: "review",
    label: "Review",
    tasks: [
      {
        taskId: 4,
        name: "Task D",
        date: "2025-02-18 21:39:00",
        desc: "This is task desciption",
        users: [
          {
            userId: 1,
            name: "KL",
          },
          {
            userId: 2,
            name: "K",
          },
          {
            userId: 3,
            name: "E",
          },
        ],
      },
    ],
  },
  {
    key: "done",
    label: "Done",
    tasks: [
      {
        taskId: 5,
        name: "Task E",
        date: "2025-02-18 21:39:00",
        desc: "This is task desciption",
        users: [
          {
            userId: 1,
            name: "KL",
          },
          {
            userId: 2,
            name: "K",
          },
          {
            userId: 3,
            name: "E",
          },
        ],
      },
    ],
  },
];

const Tasks = () => {
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
              width: 0,
              // marginRight: 15,
              borderRadius: 5,
              backgroundColor: "#fff",
              padding: 15,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* top */}
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  flex: 1,
                  color: "rgba(105, 91, 91, 1)",
                  fontSize: 20,
                  fontWeight: 600,
                }}
              >
                Task Board
              </div>
              <Input
                style={{
                  width: 180,
                }}
                prefix={<FontAwesomeIcon icon={faMagnifyingGlass} />}
                placeholder="Search"
              />
            </div>
            {/* task box */}
            <div
              style={{
                marginTop: 12,
                flex: 1,
                height: "100%",
                display: "flex",
                gap: 15,
              }}
            >
              {taskInfos.map((infos) => {
                return (
                  <TaskStatusBox
                    key={infos.key}
                    infos={infos}
                    status={infos.key}
                  />
                );
              })}
            </div>
          </div>
          {/* right */}
          <div
            style={{
              width: 300,
              height: "100%",
              borderRadius: 5,
              backgroundColor: "#fff",
              // display: "flex",
              display: "none",
              padding: 15,
              flexDirection: "column",
            }}
          >
            {/* top */}
            <div
              style={{
                flex: 1,
                width: "100%",
                backgroundColor: "var(--bgColor)",
                borderRadius: 5,
                marginBottom: 15,
              }}
            ></div>
            {/* team chat */}

            <TeamChat />
          </div>
        </div>
      </div>
    </>
  );
};

export default Tasks;
