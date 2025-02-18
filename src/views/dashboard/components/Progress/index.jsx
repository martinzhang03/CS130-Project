import React from "react";

const Progress = ({ val = 30 }) => {
  return (
    <>
      <div
        style={{
          width: "100%",
          height: 32,
          position: "relative",
          backgroundColor: "#D9D9D9",
          borderRadius: 5,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${val}%`,
            height: "100%",
            backgroundColor: "#FFAEAE",
            borderRadius: 5,
          }}
        ></div>
        <div
          style={{
            fontSize: 16,
            color: "#fff",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translateX(-50%) translateY(-50%)",
          }}
        >
          {val == 0 ? "Wait" : val == 100 ? "Well Done" : `${val}%`}
        </div>
      </div>
    </>
  );
};

export default Progress;
