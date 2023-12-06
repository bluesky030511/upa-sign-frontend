import React from "react";
import DashboardLayout from "../../components/dashboard/layout";
import { Outlet } from "react-router-dom";

const Contract = () => {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
};

export default Contract;
