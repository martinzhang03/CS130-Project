import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Input } from "antd";
import React, { useEffect, useState } from "react";
import TeamChat from "../../components/TeamChat";
import TaskStatusBox from "./components/TaskStatuBox";
import { fetchTasks } from "../../api/task";
import { atom, useAtom } from "jotai";

const taskInfos1 = [
  {
    key: "wait",
    label: "Backlog",

    tasks: [
      {
        task_id: 1,
        task_name: "Task A",
        start_datetime: "2025-02-18 21:39:00",
        due_datetime: "2025-02-18 23:39:00",
        description: "This is task desciption",
        assignees: [1],
      },
    ],
  },
  {
    key: "progress",
    label: "In Progress",

    tasks: [],
  },
  {
    key: "review",
    label: "Review",
    tasks: [],
  },
  {
    key: "done",
    label: "Done",
    tasks: [],
  },
];

export const reloadTaskAtom = atom(false);

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [taskInfos, setTaskInfos] = useState([]);
  const [reload, setReload] = useAtom(reloadTaskAtom);

  const getTaskInfo = () => {
    fetchTasks()
      .then((res) => {
        if (res?.status === "success") {
          setTasks(res?.user_tasks ?? []);
        }
      })
      .catch(() => {})
      .finally(() => {
        setReload(false);
      });
  };
  useEffect(() => {
    getTaskInfo();
  }, []);

  useEffect(() => {
    getTaskInfo();
  }, [reload]);

  useEffect(() => {
    if (tasks.length) {
      console.log(tasks);
      let waitArr = [],
        progressArr = [],
        reviewArr = [],
        doneArr = [];
      tasks.map((task) => {
        if (task.progress !== "Done") {
          waitArr.push(task);
        }
        if (task.progress === "In Progress") {
          progressArr.push(task);
        } else if (task.progress === "In Review") {
          reviewArr.push(task);
        } else if (task.progress === "Done") {
          doneArr.push(task);
        }
      });
      setTaskInfos([
        {
          key: "wait",
          label: "Backlog",
          tasks: waitArr,
        },
        {
          key: "progress",
          label: "In Progress",
          tasks: progressArr,
        },
        {
          key: "review",
          label: "Review",
          tasks: reviewArr,
        },
        {
          key: "done",
          label: "Done",
          tasks: doneArr,
        },
      ]);
    } else {
      setTaskInfos([
        {
          key: "wait",
          label: "Backlog",
          tasks: [],
        },
        {
          key: "progress",
          label: "In Progress",
          tasks: [],
        },
        {
          key: "review",
          label: "Review",
          tasks: [],
        },
        {
          key: "done",
          label: "Done",
          tasks: [],
        },
      ]);
    }
  }, [tasks]);
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
                  display: "none",
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
