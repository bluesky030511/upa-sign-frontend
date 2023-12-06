import React from "react";
import { Outlet } from "react-router-dom";
import DashboardLayout from "../../../components/dashboard/layout";
const SettingRoot = () => {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
};

export default SettingRoot;
