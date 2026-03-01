import React from "react";
import "./Admin.css";
import Sidebar from "../../Components/Sidebar/Sidebar";
import { Routes, Route, Navigate } from "react-router-dom";
import AddProduct  from "../../Components/AddProduct/AddProduct";
import ListProduct from "../../Components/ListProduct/ListProduct";
import Dashboard   from "../../Components/Dashboard/Dashboard";
import Orders      from "../Orders/Orders";
import Users       from "../Users/Users";
import Stats       from "../Stats/Stats";

const Admin = () => {
  return (
    <div className="admin">
      <Sidebar />
      <div className="admin-content">
        <Routes>
          <Route path="/"            element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard"   element={<Dashboard />} />
          <Route path="/addproduct"  element={<AddProduct />} />
          <Route path="/listproduct" element={<ListProduct />} />
          <Route path="/orders"      element={<Orders />} />
          <Route path="/users"       element={<Users />} />
          <Route path="/stats"       element={<Stats />} />
        </Routes>
      </div>
    </div>
  );
};

export default Admin;