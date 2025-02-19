import { Avatar } from "antd";
import React from "react";

const LeftMsg = () => {
  return (
    <>
      <div
        style={{
          width: "100%",
          display: "flex",
          marginBottom: 12,
        }}
      >
        {/* avatar */}
        <Avatar>K</Avatar>
        {/* msg */}
        <div
          style={{
            flex: 1,
            marginLeft: 8,
            height: 60,
            backgroundColor: "#fff",
            borderTopRightRadius: 8,
            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 8,
          }}
        ></div>
      </div>
    </>
  );
};

export default LeftMsg;
