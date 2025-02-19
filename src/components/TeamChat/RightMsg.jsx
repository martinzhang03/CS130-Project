import { Avatar } from "antd";
import React from "react";

const RightMsg = () => {
  return (
    <>
      <div
        style={{
          width: "100%",
          display: "flex",
        }}
      >
        {/* msg */}
        <div
          style={{
            flex: 1,
            marginRight: 8,
            height: 60,
            backgroundColor: "#fff",
            borderTopLeftRadius: 8,
            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 8,
          }}
        ></div>
        {/* avatar */}
        <Avatar>E</Avatar>
      </div>
    </>
  );
};

export default RightMsg;
