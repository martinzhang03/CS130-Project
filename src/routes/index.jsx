import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/Layout";

const Login = lazy(() => import("@/views/login"));
const Register = lazy(() => import("@/views/register"));
const DashBoard = lazy(() => import("@/views/dashboard"));
const Tasks = lazy(() => import("@/views/tasks"));
const Teams = lazy(() => import("@/views/teams"));
const Taskhistory = lazy(() => import("@/views/taskHistory"));
const UserInfo = lazy(() => import("@/views/userinfo"));

const routes = createBrowserRouter([
  {
    path: "/login",
    element: (
      <Suspense fallback={null}>
        <Login />
      </Suspense>
    ),
  },
  {
    path: "/register",
    element: (
      <Suspense fallback={null}>
        <Register />
      </Suspense>
    ),
  },
  {
    path: "/",
    element: (
      <Suspense fallback={null}>
        <Layout />
      </Suspense>
    ),
    children: [
      {
        path: "dashboard",
        element: <DashBoard />,
      },
      {
        path: "tasks",
        element: <Tasks />,
      },
      {
        path: "teams",
        element: <Teams />,
      },
      {
        path: "taskhistory",
        element: <Taskhistory />,
      },
      {
        path: "userinfo",
        element: <UserInfo />,
      },
    ],
  },
]);

export default routes;
