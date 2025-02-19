import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Input } from "antd";
import React from "react";
import LeftMsg from "./LeftMsg";
import RightMsg from "./RightMsg";

const TeamChat = () => {
  return (
    <>
      <div
        style={{
          width: "100%",
          backgroundColor: "var(--bgColor)",
          borderRadius: 5,
        }}
      >
        <div
          style={{
            width: "100%",
            height: 220,
            overflowY: "auto",
            padding: "12px 7px 0px 12px",
          }}
          className="scroll-box"
        >
          <LeftMsg />
          <RightMsg />
        </div>
        <div
          style={{
            padding: 12,
            paddingTop: 5,
          }}
        >
          <Input
            suffix={
              <Button
                type="text"
                style={{
                  marginRight: -5,
                }}
                icon={<FontAwesomeIcon icon={faPaperPlane} />}
                onClick={() => {
                  console.log("send msg");
                }}
              ></Button>
            }
            placeholder="Work hard,paly harder"
          />
        </div>
      </div>
    </>
  );
};

export default TeamChat;
