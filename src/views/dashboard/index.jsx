import { faCalendar, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Empty, Space } from "antd";
import dayjs from "dayjs";
import React, { useEffect, useMemo, useState } from "react";
import ModifyTask from "./components/ModifyTask";
import TaskItem from "./components/TaskItem";
import TeamChat from "../../components/TeamChat";
import Flow from "./components/TaskFlow";
import { fetchTasks, fetchTasksByUserId } from "../../api/task";

// assignees
// :
// [1]
// created_at
// :
// "2025-03-08T06:06:50.576104"
// dependencies
// :
// []
// description
// :
// "task a desc info"
// due_datetime
// :
// "2025-03-07T03:00:00"
// progress
// :
// "In Progress"
// start_datetime
// :
// "2025-03-07T01:00:00"
// status
// :
// "success"
// task_id
// :
// 1
// task_name
// :
// "Task A"

const DashBoard = () => {
  const [editTask, setEditTask] = useState(false);
  const [taskList, setTaskList] = useState([]);
  const [reload, setReload] = useState(false);

  const getTaskList = () => {
    let userId = localStorage.getItem("tf_user_id");
    if (userId) {
      // fetchTasksByUserId(userId)
      //   .then((res) => {
      //     console.log(res);
      //     if(res?.status ==='success'){
      //       setTaskList(res?.user_task ?? [])
      //     }
      //   })
      //   .catch(() => {})
      //   .finally(() => {
      //     // setReload(false);
      //   });

      fetchTasks()
        .then((res) => {
          if (res?.status === "success") {
            setTaskList(res?.user_tasks ?? []);
          }
        })
        .catch(() => {})
        .finally(() => {
          setReload(false);
        });
    }
  };

  useEffect(() => {
    getTaskList();
  }, []);

  useEffect(() => {
    if (reload) {
      getTaskList();
    }
  }, [reload]);

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
                  setEditTask(true);
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
                overflowX: "auto",
              }}
            >
              {taskList.length !== 0 ? (
                <Space>
                  {taskList.map((info, index) => {
                    return <TaskItem key={index} infos={info} />;
                  })}
                </Space>
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: 161,
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#fff",
                    borderRadius: 5,
                  }}
                >
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                </div>
              )}
            </div>
            {/* task view */}

            <div
              style={{
                flex: 1,
                marginTop: 25,
                borderRadius: 5,
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                }}
              >
                <Flow taskList={taskList} />
              </div>
            </div>
          </div>
          <div
            style={{
              display: "none",
              width: 300,
              height: "100%",
              borderRadius: 5,
              backgroundColor: "#fff",
              // display: "flex",
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

      <ModifyTask
        open={editTask}
        onCancel={() => {
          setEditTask(false);
          setReload(true);
        }}
      />
    </>
  );
};

export default DashBoard;
