import { Handle, Position } from "@xyflow/react";
import React from "react";

/**
 * label
 * width
 * height
 * isStart
 * isEnd
 * @param {*} param0
 * @returns
 */
const CusNode = ({ data }) => {
  return (
    <>
      <div
        style={{
          padding: "10px 20px",
          width: data.width,
          height: data.height,
          backgroundColor: "rgba(227, 227, 227, 0.65)",
          borderRadius: 8,
          position: "relative",
          fontSize: 16,
          fontWeight: 600,
          color: "#695B5B",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 4,
            height: "60%",
            borderRadius: 2,
            backgroundColor: "rgba(203, 194, 93, 0.65)",
            top: "50%",
            left: 0,
            transform: "translateY(-50%)",
            zIndex: 999,
          }}
        ></div>
        <div
          style={{
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}
        >
          {data.label}
        </div>
      </div>

      {!data?.isStart && <Handle type="target" position={Position.Left} />}
      {!data?.isEnd && <Handle type="source" position={Position.Right} />}
    </>
  );
};

export default CusNode;
