import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Sidebar from "./admin/Sidebar";
import SidebarMember from "./member/SidebarMember";
import ChatBox from "./components/ChatBox";
import Login from "./auth/Login";
import ForgetPassword from "./auth/ForgetPassword";
import Dashboard from "./admin/Dashboard";
import Member from "./admin/Member";
import AddMember from "./admin/AddMember";
import ChangePassword from "./admin/ChangePassword";
import Trigger from "./admin/Trigger";
import NotFound from "./NotFound";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <div className="App">
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginRedirect />} />
          <Route path="/login" element={<LoginRedirect />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route
            path="/chat"
            element={
              <PrivateRoute allowedRoles={["member", "admin"]}>
                <LayoutWithSidebar>
                  <ChatBox />
                </LayoutWithSidebar>
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <LayoutWithSidebar>
                  <Dashboard />
                </LayoutWithSidebar>
              </PrivateRoute>
            }
          />
          <Route
            path="/members"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <LayoutWithSidebar>
                  <Member />
                </LayoutWithSidebar>
              </PrivateRoute>
            }
          />
          <Route
            path="/members/new"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <LayoutWithSidebar>
                  <AddMember />
                </LayoutWithSidebar>
              </PrivateRoute>
            }
          />
          <Route
            path="/changepassword"
            element={
              <PrivateRoute allowedRoles={["member", "admin"]}>
                <LayoutWithSidebar>
                  <ChangePassword />
                </LayoutWithSidebar>
              </PrivateRoute>
            }
          />

          <Route
            path="/trigger"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <LayoutWithSidebar>
                  <Trigger />
                </LayoutWithSidebar>
              </PrivateRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

const LayoutWithSidebar = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  return (
    <div className="flex">
      {role === "member" ? <SidebarMember /> : <Sidebar />}
      <div className="flex-1">{children}</div>
    </div>
  );
};

const PrivateRoute = ({ children, allowedRoles }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      navigate("/login");
    } else if (allowedRoles && !allowedRoles.includes(user.role)) {
      navigate("/chat");
    }
  }, [navigate, allowedRoles]);

  return children;
};

const LoginRedirect = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      navigate("/dashboard");
    }
  }, [navigate]);
  return <Login />;
};

export default App;
