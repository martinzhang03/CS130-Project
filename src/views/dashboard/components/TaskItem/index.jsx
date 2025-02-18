import { Avatar } from "antd";
import dayjs from "dayjs";
import React from "react";
import Progress from "../Progress";

const TaskItem = ({ infos = {} }) => {
  return (
    <>
      <div
        style={{
          width: 300,
          backgroundColor: "#fff",
          borderRadius: 5,
          padding: 10,
          paddingLeft: 16,
          position: "relative",
        }}
      >
        {/* header */}
        <div
          style={{
            display: "flex",
          }}
        >
          {/* task name */}
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
                fontSize: 16,
                fontWeight: 700,
                color: "#695B5B",
              }}
            >
              {infos.name}
            </div>
          </div>
          <div
            style={{
              color: "#AFAFAF",
            }}
          >
            {dayjs(infos.startTime).format("MMM. MM-DD")}
          </div>
        </div>
        {/* desc */}
        <div
          style={{
            width: "100%",
            marginTop: 12,
            fontSize: 13,
            color: "#695B5B",
            padding: 5,
            paddingBottom: 0,
            height: 58,
          }}
          className="multi-line-ellipsis"
          title={infos.desc}
        >
          {infos.desc}
        </div>
        {/* line */}
        <div
          style={{
            width: "100%",
            height: 1,
            backgroundColor: "#B1B1B1",
            marginTop: 10,
            marginBottom: 10,
          }}
        ></div>
        {/* footer */}
        <div
          style={{
            width: "100%",
            display: "flex",
          }}
        >
          <div
            style={{
              flex: 1,
              marginRight: 20,
            }}
          >
            <Progress />
          </div>
          <Avatar.Group
            max={{
              count: 2,
              style: {
                color: "#f56a00",
                backgroundColor: "#fde3cf",
              },
            }}
          >
            {infos.assgins.map((user) => {
              return <Avatar key={user.userid}>{user.name}</Avatar>;
            })}
          </Avatar.Group>
        </div>

        {/* color bar */}
        <div
          style={{
            width: 5,
            height: "75%",
            backgroundColor: "#F8EC72",
            position: "absolute",
            top: "50%",
            left: 0,
            transform: "translateY(-50%)",
            borderRadius: 1,
          }}
        ></div>
      </div>
    </>
  );
};

export default TaskItem;
