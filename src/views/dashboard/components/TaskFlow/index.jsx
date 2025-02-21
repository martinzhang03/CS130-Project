import { ReactFlow, useEdgesState, useNodesState } from "@xyflow/react";
import { useScroll, useSize } from "ahooks";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import CusNode from "./CusNode";
import './index.less'
import "@xyflow/react/dist/style.css";

const dateHeight = 32;

const nodeTypes = {
  CusNode: CusNode,
};

const Flow = () => {
  const wrapRef = useRef(null);
  const wrapSize = useSize(wrapRef);

  const timeRef = useRef(null);
  const timeScroll = useScroll(timeRef);
  const dateRef = useRef(null);
  const dateScroll = useScroll(dateRef);

  const [dateArr, setDateArr] = useState([
    "2025-02-01",
    "2025-02-02",
    "2025-02-03",
    "2025-02-04",
    "2025-02-05",
    "2025-02-06",
    "2025-02-07",
  ]);

  const [timeHeight, setTimeHeight] = useState(32);
  const [timeMaxTop, setTimeMaxTop] = useState(0);
  const [dateWidth, setDateWidth] = useState(120);
  const [dateMaxLeft, setDateMaxLeft] = useState(0);

  const [viewport, setViewPort] = useState({
    x: 0,
    y: 0,
    zoom: 1,
  });

  const [nodes, setNodes] = useNodesState([]);
  const [edges, setEdges] = useEdgesState([]);

  useEffect(() => {
    setNodes([
      {
        id: "1",
        type: "CusNode",
        data: {
          label: "Task A",
          width: dateWidth,
          height: timeHeight * 2,
          isStart: true,
        },
        position: { x: 60, y: dateHeight + timeHeight * 5 + timeHeight / 2 },
        sourcePosition: "right",
      },
      {
        id: "2",
        type: "CusNode",
        data: { label: "Task B", width: dateWidth, height: timeHeight * 1 },
        position: {
          x: 60 + dateWidth * 1,
          y: dateHeight + timeHeight * 8 + timeHeight / 2,
        },
        sourcePosition: "right",
        targetPosition: "left",
      },
      {
        id: "3",
        type: "CusNode",
        data: {
          label: "Task C",
          width: dateWidth,
          height: timeHeight * 4,
          isEnd: true,
        },
        position: {
          x: 60 + dateWidth * 3,
          y: dateHeight + timeHeight * 6 + timeHeight / 2,
        },
        targetPosition: "left",
      },
      {
        id: "4",
        type: "CusNode",
        data: {
          label: "Task D",
          width: dateWidth,
          height: timeHeight * 2,
          isEnd: true,
        },
        position: {
          x: 60 + dateWidth * 5,
          y: dateHeight + timeHeight * 10 + timeHeight / 2,
        },
        targetPosition: "left",
      },
    ]);

    setEdges([
      {
        id: "e1-2",
        source: "1",
        target: "2",
        animated: false,
        style: {
          stroke: "#81d076",
          strokeWidth: 2,
        },
      },
      {
        id: "e2a-3",
        source: "2",
        target: "3",
        animated: true,
        style: {
          stroke: "#82b4ff",
          strokeWidth: 2,
        },
      },
      {
        id: "e2b-4",
        source: "2",
        target: "4",
        animated: true,
        style: {
          stroke: "#82b4ff",
          strokeWidth: 2,
        },
      },
    ]);
  }, [dateHeight,timeHeight,dateWidth]);

  // calc time height
  useEffect(() => {
    if (wrapSize?.height) {
      let height = Math.ceil(wrapSize.height / 24);
      let val = height >= 32 ? height : 32;
      setTimeHeight(val);
      let top = val * 24 - wrapSize.height + dateHeight;
      setTimeMaxTop(top);
    }

    if (wrapSize?.width && dateArr.length) {
      let width = Math.ceil(wrapSize.width / dateArr.length);
      let val = width >= 120 ? width : 120;

      setDateWidth(val);
      let left = val * dateArr.length - wrapSize.width + 60;
      setDateMaxLeft(left);
    }
  }, [wrapSize, dateArr, dateHeight]);

  return (
    <>
      <div
        ref={wrapRef}
        style={{
          width: '100%',
          height: '100%',
          position: "relative",
          overflow: "hidden",
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        {/* date */}
        <div
          ref={dateRef}
          id="date"
          style={{
            width: "100%",
            height: dateHeight,
            backgroundColor: "#fff",
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 2,
            display: "flex",
            alignItems: "center",
            overflow: "hidden",
          }}
        >
          {/* empty box */}
          <div
            style={{
              flex: "none",
              width: 60,
              height: "100%",
            }}
          ></div>
          {/* date item */}
          {dateArr.map((val, index) => {
            return (
              <div
                style={{
                  flex: "none",
                  width: dateWidth,
                  textAlign: "center",
                  position: "relative",
                  height: "100%",
                  lineHeight: `${dateHeight}px`,
                  color: "#695B5B",
                  fontWeight: 600,
                }}
                key={index}
              >
                {dayjs(val).format("ddd. DD")}
              </div>
            );
          })}
        </div>
        {/* date cover */}
        <div
          style={{
            position: "absolute",
            zIndex: 12,
            top: 0,
            left: 0,
            width: 60,
            height: dateHeight,
            backgroundColor: "#fff",
          }}
        ></div>
        {/* date split */}
        {dateArr.map((_, index) => {
          return (
            <div
              key={`date_split_${index}`}
              style={{
                position: "absolute",
                top: dateHeight,
                left: `${
                  60 +
                  dateWidth * index -
                  (dateScroll?.left ? dateScroll?.left : 0)
                }px`,
                width: 1,
                height: wrapSize?.height ? wrapSize?.height - dateHeight : '100%',
                backgroundColor: "#B6B6B6",
              }}
            ></div>
          );
        })}
        {/* time */}
        <div
          ref={timeRef}
          id="time"
          style={{
            position: "absolute",
            backgroundColor: "#fff",
            height: `calc(100% - ${dateHeight}px)`,
            width: 60,
            left: 0,
            top: dateHeight,
            zIndex: 1,
            overflow: "hidden",
            color: "#695B5B",
          }}
        >
          {Array.from({ length: 24 }).map((_, index) => {
            return (
              <div
                key={index}
                style={{
                  textAlign: "center",
                  fontSize: 14,
                  fontWeight: 600,
                  width: "100%",
                  height: timeHeight,
                  lineHeight: `${timeHeight}px`,
                  position: "relative",
                }}
              >
                {`${index.toString().padStart(2, "0")}:00`}
              </div>
            );
          })}
        </div>
        {/* time spilt */}
        {Array.from({ length: 24 }).map((_, index) => {
          return (
            <div
              key={`time_split_${index}`}
              style={{
                position: "absolute",
                width: wrapSize?.width ? wrapSize?.width - 60 : '100%',
                height: 1,
                backgroundImage:
                  "linear-gradient(to right, #C1C0C099 50%, transparent 50%)",
                backgroundSize: "50px 100%",
                left: 60,
                top: `${
                  dateHeight +
                  timeHeight * index +
                  timeHeight / 2 -
                  (timeScroll?.top ? timeScroll?.top : 0)
                }px`,
              }}
            ></div>
          );
        })}
        {/* flow */}
        <div
          style={{
            width: "100%",
            height: "100%",
            position: "relative",
          }}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onViewportChange={(info) => {
              console.log(info);
              if (info.y <= 0 && Math.abs(info.y) <= timeMaxTop) {
                setViewPort(info);
                document.querySelector("#time")?.scrollTo(0, -info.y);
              }

              if (info.x <= 0 && Math.abs(info.x) <= dateMaxLeft) {
                setViewPort(info);
                document.querySelector("#date")?.scrollTo(-info.x, 0);
              }
            }}
            minZoom={1}
            maxZoom={1}
            viewport={viewport}
          ></ReactFlow>
        </div>
      </div>
    </>
  );
};

export default Flow;
