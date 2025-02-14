import { Avatar } from "antd";
import React from "react";

const Header = () => {
  return (
    <>
      <div
        style={{
          width: "100vw",
          height: 60,
          backgroundColor: "rgba(0, 21, 41, 1)",
          display: "flex",
          padding: "0px 20px",
        }}
      >
        <div
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: "#fff",
            lineHeight: "60px",
            flex: 1,
          }}
        >
          Task Manage
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              color: "#fff",
            }}
          >
            <Avatar
              style={{
                backgroundColor: "#fde3cf",
                color: "#f56a00",
              }}
            >
              U
            </Avatar>
            <div
              style={{
                marginLeft: 5,
                fontSize: 14,
              }}
            >
              Riny
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
