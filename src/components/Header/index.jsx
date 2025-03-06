import { faUser } from "@fortawesome/free-regular-svg-icons";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar, Dropdown } from "antd";
import React, { useState } from "react";
import UserInfo from "../UserInfo";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [editInfo, setEditInfo] = useState(false);
  const navigate = useNavigate();
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
          Task Flow
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Dropdown
            menu={{
              items: [
                {
                  key: "userInfo",
                  label: "My Info",
                  icon: <FontAwesomeIcon icon={faUser} />,
                },
                {
                  key: "logout",
                  label: "Log Out",
                  icon: <FontAwesomeIcon icon={faArrowRightFromBracket} />,
                },
              ],
              onClick: ({ key }) => {
                console.log(key);
                if (key === "userInfo") {
                  setEditInfo(true);
                } else {
                  localStorage.removeItem("tf_token");
                  navigate("/login");
                }
              },
            }}
          >
            <Avatar
              style={{
                backgroundColor: "#fde3cf",
                color: "#f56a00",
                cursor: "pointer",
              }}
            >
              Riny
            </Avatar>
          </Dropdown>
        </div>
      </div>

      <UserInfo
        open={editInfo}
        onCancel={() => {
          setEditInfo(false);
        }}
      />
    </>
  );
};

export default Header;
