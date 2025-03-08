import { faEllipsis, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar, Button, Dropdown, message } from "antd";
import dayjs from "dayjs";
import { useAtom, useAtomValue } from "jotai";
import React from "react";
import { userInofsAtom } from "../../../../components/Layout";
import { fetchDelTasks } from "../../../../api/task";
import { reloadTaskAtom } from "../..";

const TaskItem = ({
  infos = {
    task_name: "",
    start_datetime: "",
    description: "",
    assignees: [],
  },
}) => {
  const [messageApi, contextHolder] = message.useMessage();
  const userInfoMap = useAtomValue(userInofsAtom);
  const [, setReload] = useAtom(reloadTaskAtom);

  const clickDelTask = (id) => {
    fetchDelTasks(id)
      .then((res) => {
        if (res?.status === "success") {
          messageApi.success("Success");
          setReload(true);
        }
      })
      .catch(() => {});
  };
  return (
    <>
      {contextHolder}
      <div
        style={{
          width: "100%",
          padding: "6px 12px",
          paddingRight: 6,
          backgroundColor: "#fff",
          borderRadius: 5,
        }}
      >
        {/* header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <div
            style={{
              flex: 1,
              width: 0,
              marginRight: 20,
            }}
          >
            <div
              className="single-line-ellipsis"
              style={{
                fontSize: 14,
                fontWeight: 500,
                color: "rgba(105, 91, 91, 1)",
              }}
            >
              {infos.task_name}
            </div>
          </div>
          <Dropdown
            menu={{
              items: [
                {
                  key: "edit",
                  label: "Edit",
                },
                {
                  key: "status",
                  label: "Change Status",
                },
                {
                  key: "delete",
                  label: "Delete",
                },
              ],
              onClick: ({ key }) => {
                if (key === "delete") {
                  clickDelTask(infos.task_id);
                }
              },
            }}
          >
            <Button icon={<FontAwesomeIcon icon={faEllipsis} />} />
          </Dropdown>
        </div>
        {/* desc */}
        <div
          style={{
            width: "100%",
            marginTop: 6,
            fontSize: 13,
            color: "#695B5B",

            height: 58,
          }}
          className="multi-line-ellipsis"
          title={infos.description}
        >
          {infos.description}
        </div>
        {/* footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <div
            style={{
              flex: 1,
              fontSize: 13,
              color: "rgba(105, 91, 91, 1)",
            }}
          >
            {dayjs(infos.start_datetime).format("MMM. MM-DD")}
          </div>
          <Avatar.Group
            max={{
              count: 2,
              style: {
                color: "#f56a00",
                backgroundColor: "#fde3cf",
              },
            }}
            size={"small"}
          >
            {infos.assignees.map((userId) => {
              return (
                <Avatar size={"small"} key={userId}>
                  {userInfoMap[userId]}
                </Avatar>
              );
            })}
          </Avatar.Group>
        </div>
      </div>
    </>
  );
};

export default TaskItem;
