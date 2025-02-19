import { faEllipsis, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar, Button, Dropdown } from "antd";
import dayjs from "dayjs";
import React from "react";

const TaskItem = ({
  infos = {
    name: "",
    date: "",
    desc: "",
    users: [],
  },
}) => {
  return (
    <>
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
              {infos.name}
            </div>
          </div>
          <Button
            type="text"
            danger
            icon={<FontAwesomeIcon icon={faTrashCan} />}
          ></Button>
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
          title={infos.desc}
        >
          {infos.desc}
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
            {dayjs(infos.date).format("MMM. MM-DD")}
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
            {infos.users.map((user) => {
              return (
                <Avatar size={"small"} key={user.userId}>
                  {user.name}
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
