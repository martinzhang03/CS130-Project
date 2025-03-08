import { faAddressCard } from "@fortawesome/free-regular-svg-icons";
import {
  faArrowRightFromBracket,
  faClockRotateLeft,
  faGaugeHigh,
  faListCheck,
  faPeopleGroup,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Menu } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import Header from "../Header";

import helpImg from "@/assets/help.png";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { atom, useAtom } from "jotai";
import { fetchUsers } from "../../api/user";

export const userListAtom = atom([]);

export const userInofsAtom = atom((get) => {
  let list = get(userListAtom) ?? [];
  let obj = {};
  list.map(({ id, username }) => {
    obj[id] = username;
  });

  return obj;
});

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [, setUserList] = useAtom(userListAtom);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const items = [
    {
      label: "Dash Board",
      key: "dashboard",
      icon: <FontAwesomeIcon icon={faGaugeHigh} />,
    },
    {
      label: "My Tasks",
      key: "tasks",
      icon: <FontAwesomeIcon icon={faListCheck} />,
    },
    // {
    //   label: "My Team",
    //   key: "teams",
    //   icon: <FontAwesomeIcon icon={faPeopleGroup} />,
    // },
    // {
    //   label: "Task History",
    //   key: "taskhistory",
    //   icon: <FontAwesomeIcon icon={faClockRotateLeft} />,
    // },
    // {
    //   label: "My Info",
    //   key: "userinfo",
    //   icon: <FontAwesomeIcon icon={faAddressCard} />,
    // },
  ];

  const clickMenu = (path) => {
    navigate(path);
  };

  useEffect(() => {
    if (location) {
      console.log(location);
      let path = location.pathname.split("/").pop();
      setSelectedKeys([path]);
    }
  }, [location]);

  useEffect(() => {
    if (location && location.pathname === "/") {
      navigate("/dashboard");
    }
  }, [location]);

  useEffect(() => {
    const initUserList = () => {
      fetchUsers()
        .then((res) => {
          console.log(res);
          if (res?.status === "success") {
            setUserList(res?.user_list ?? []);
          }
        })
        .catch(() => {});
    };
    initUserList();
  }, []);
  return (
    <>
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "rgb(240,242,245)",
        }}
      >
        <Header />
        {/* body */}
        <div
          style={{
            flex: 1,
            width: "100vw",
            display: "flex",
          }}
        >
          {/* left */}
          <div
            style={{
              width: 300,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              backgroundColor: "#fff",
            }}
          >
            <div
              style={{
                flex: 1,
              }}
            >
              <Menu
                items={items}
                selectedKeys={selectedKeys}
                style={{
                  borderRight: 0,
                }}
                onClick={(ev) => {
                  clickMenu(`/${ev.key}`);
                }}
              ></Menu>
            </div>
            {/* help box */}
            <div
              style={{
                width: 300,
                padding: 20,
                position: "relative",
                display: "none",
              }}
            >
              {/* icon box */}
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  transform: "translateX(-50%)",
                  top: -10,
                  width: 58,
                  height: 58,
                  backgroundColor: "rgba(255, 196, 196, 1)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "2px 4px 10px rgba(197, 102, 102, 0.25)",
                }}
              >
                <img
                  style={{
                    width: 36,
                  }}
                  src={helpImg}
                  alt=""
                />
              </div>
              <div
                style={{
                  backgroundColor: "rgba(227, 227, 227, 1)",
                  padding: 20,
                  textAlign: "center",
                  borderRadius: 10,
                  userSelect: "none",
                }}
              >
                <div
                  style={{
                    color: "rgba(105, 91, 91, 1)",
                    fontSize: 16,
                    fontWeight: 700,
                    marginTop: 30,
                  }}
                >
                  Help Center
                </div>

                <div
                  style={{
                    color: "rgba(105, 91, 91, 1)",
                    width: 140,
                    margin: "0 auto",
                    lineHeight: "22px",
                    marginTop: 20,
                    marginBottom: 40,
                  }}
                >
                  <div style={{}}>Have problem in process?</div>
                  <div>Please contact us for help.</div>
                </div>
                <Button block type="primary">
                  Go To Help Center
                </Button>
              </div>
            </div>
            <div
              style={{
                padding: 20,
                paddingTop: 0,
              }}
            >
              <Button
                block
                icon={<FontAwesomeIcon icon={faArrowRightFromBracket} />}
                onClick={() => {
                  localStorage.removeItem("tf_token");
                  navigate("/login");
                }}
              >
                Log out
              </Button>
            </div>
          </div>
          {/* right */}
          <div
            style={{
              flex: 1,
            }}
          >
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default Layout;
