import { ReactFlow, useEdgesState, useNodesState } from "@xyflow/react";
import { useScroll, useSize } from "ahooks";
import dayjs from "dayjs";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import CusNode from "./CusNode";
import "./index.less";
import "@xyflow/react/dist/style.css";
import { useAtomValue } from "jotai";
import { taskListsAtom } from "../../../../components/Layout";

const nodeTypes = {
  CusNode: CusNode,
};
const Flow = () => {
  const taskList = useAtomValue(taskListsAtom);
  const wrapRef = useRef(null);
  const wrapSize = useSize(wrapRef);

  const timeRef = useRef(null);
  const timeScroll = useScroll(timeRef);
  const dateRef = useRef(null);
  const dateScroll = useScroll(dateRef);

  const [dateArr, setDateArr] = useState([]);
  const [startDate, setStartDate] = useState();

  const timeWidth = 60;
  const dateHeight = 32;
  const [timeHeight, setTimeHeight] = useState(32);
  const [dateWidth, setDateWidth] = useState(120);

  const [isDrag, setIsDrag] = useState(false);

  const [viewport, setViewPort] = useState({
    x: 0,
    y: 0,
    zoom: 1,
  });

  const onMouseDown = useCallback((evt) => {
    setIsDrag(true);
  }, []);

  const onMouseUp = useCallback((evt) => {
    setIsDrag(false);
  }, []);

  const onMouseMove = useCallback(
    (evt) => {
      if (isDrag) {
        if (evt.movementX) {
          document
            .querySelector("#date")
            ?.scrollTo(dateScroll.left - evt.movementX, 0);
        }

        if (evt.movementY) {
          document
            .querySelector("#time")
            ?.scrollTo(0, timeScroll.top - evt.movementY);
        }
      }
    },
    [isDrag, timeScroll, dateScroll]
  );

  useEffect(() => {
    setViewPort({
      x: dateScroll?.left ? -dateScroll?.left : 0,
      y: timeScroll?.top ? -timeScroll?.top : 0,
      zoom: 1,
    });
  }, [timeScroll, dateScroll]);

  const [nodes, setNodes] = useNodesState([]);
  const [edges, setEdges] = useEdgesState([]);

  const calcSize = useCallback(
    (infos) => {
      let x = 0,
        y = 0,
        width = dateWidth,
        height = timeHeight;
      x =
        dayjs(infos.startTime).diff(dayjs(startDate), "day") * dateWidth +
        timeWidth;
      y = dayjs(infos.startTime).hour() * timeHeight + dateHeight;
      if (infos.startTime && infos.endTime) {
        let dayLen = dayjs(infos.endTime).diff(dayjs(infos.startTime), "day");
        if (dayLen === 0) {
          height =
            dayjs(infos.endTime).diff(dayjs(infos.startTime), "hour") *
            timeHeight;
        } else {
          width = dayLen * dateWidth;
          height = timeHeight * 2;
        }
      }

      return { x, y, width, height };
    },
    [dateWidth, timeHeight, startDate, timeWidth, dateHeight]
  );

  const getAllParentIds = (list) => {
    let arr = [];
    list.map((item) => {
      if (item.dependency) {
        arr.push(item.dependency);
      }
    });
    return arr;
  };

  useEffect(() => {
    let nodes = [],
      edges = [];
    if (taskList.length) {
      let parents = getAllParentIds(taskList);
      taskList.map((task) => {
        let info = calcSize(task);
        let isStart = !task.dependency ? true : false;
        nodes.push({
          id: task.taskId,
          type: "CusNode",
          data: {
            label: task.taskName,
            width: info.width,
            height: info.height,
            isStart,
            isEnd: parents.includes(task.taskId) ? false : true,
          },
          position: { x: info.x, y: info.y },
        });
        if (!isStart) {
          edges.push({
            id: `edge${task.dependency}_${task.taskId}`,
            source: task.dependency,
            target: task.taskId,
            animated: task.progress === "done" ? false : true,
            style: {
              stroke: "#81d076",
              strokeWidth: 2,
            },
          });
        }
      });
    }
    setNodes(nodes);
    setEdges(edges);
  }, [taskList, calcSize]);

  // calc time height
  useEffect(() => {
    if (wrapSize?.height) {
      let height = Math.ceil(wrapSize.height / 24);
      let val = height >= 32 ? height : 32;
      setTimeHeight(val);
    }

    if (wrapSize?.width && dateArr.length) {
      let width = Math.ceil(wrapSize.width / dateArr.length);
      let val = width >= 120 ? width : 120;

      setDateWidth(val);
    }
  }, [wrapSize, dateArr, dateHeight]);

  const getDateArr = (startDate, endDate) => {
    let arr = [],
      len = dayjs(endDate).diff(dayjs(startDate), "day");
    for (let i = 0; i < len; i++) {
      arr.push(dayjs(startDate).add(i, "day").format("YYYY-MM-DD"));
    }
    return arr;
  };

  const getDateRange = (list) => {
    let start = "",
      end = "";
    list.map((info) => {
      if (info.startTime) {
        if (!start) {
          start = info.startTime;
        } else if (dayjs(info.startTime).diff(dayjs(start)) < 0) {
          start = info.startTime;
        }
      }

      if (info.endTime) {
        if (!end) {
          end = info.endTime;
        } else if (dayjs(info.endTime).diff(dayjs(end)) > 0) {
          end = info.endTime;
        }
      }
    });
    if (start && end && dayjs(end).diff(dayjs(start), "day") >= 7) {
      return getDateArr(start, end);
    } else {
      return getDateArr(start, dayjs(start).add(8, "day"));
    }
  };

  useEffect(() => {
    let dates = [];
    if (taskList.length) {
      dates = getDateRange(taskList);
    } else {
      dates = getDateArr(dayjs(), dayjs().add(8, "day"));
    }
    setDateArr(dates);
    setStartDate(dates[0]);
  }, [taskList]);

  return (
    <>
      <div
        ref={wrapRef}
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          overflow: "hidden",
          userSelect: "none",
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
            zIndex: 200,
            display: "flex",
            alignItems: "center",
            overflow: "hidden",
            paddingLeft: timeWidth,
          }}
        >
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
        {/* date split */}
        {dateArr.map((_, index) => {
          return (
            <div
              key={`date_split_${index}`}
              style={{
                position: "absolute",
                top: dateHeight,
                left: `${
                  timeWidth +
                  dateWidth * index -
                  (dateScroll?.left ? dateScroll?.left : 0)
                }px`,
                width: 1,
                height: wrapSize?.height
                  ? wrapSize?.height - dateHeight
                  : "100%",
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
            width: timeWidth,
            left: 0,
            top: dateHeight,
            zIndex: 199,
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
                width: wrapSize?.width ? wrapSize?.width - timeWidth : "100%",
                height: 1,
                backgroundImage:
                  "linear-gradient(to right, #C1C0C099 50%, transparent 50%)",
                backgroundSize: "50px 100%",
                left: timeWidth,
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
          {/* drag box */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              zIndex: 99,
              opacity: 0.5,
              cursor: isDrag ? "grabbing" : "grab",
            }}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
          ></div>
          {nodes.length && (
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              minZoom={1}
              maxZoom={1}
              viewport={viewport}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Flow;
