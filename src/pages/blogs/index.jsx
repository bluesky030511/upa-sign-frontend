import React from "react";
import { Outlet } from "react-router-dom";

import Footer from "../../components/footer";

const Blogs = () => {
  return (
    <>
      <Outlet />
      <Footer />
    </>
  );
};

export default Blogs;
