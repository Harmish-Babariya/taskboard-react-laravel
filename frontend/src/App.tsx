import { Routes, Route, Navigate } from "react-router-dom";

import AdminLayout from "layouts/admin";
import SignIn from "./views/auth/SignIn";
import SignUp from "views/auth/SignUp";
import Profile from "views/auth/Profile";

const App = () => {
  return (
    <Routes>
      <Route path="auth/sign-in" element={<SignIn />} />
      <Route path="auth/sign-up" element={<SignUp />} />
      <Route path="admin/*" element={<AdminLayout />} />
      <Route path="/" element={<Navigate to="auth/sign-in" replace />} />
      <Route path="auth/profile" element={<Profile />} />
    </Routes>
  );
};

export default App;
