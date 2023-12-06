import React from "react";
import { Outlet } from "react-router-dom";
import DashboardLayout from "../../../components/dashboard/layout";

const DocumentRoot = () => {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
};

export default DocumentRoot;
