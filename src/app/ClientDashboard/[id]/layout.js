// src/app/ClientDashboard/layout.js
"use client";
import Header from "../../components/Header";            // note: path goes up then into components
import ClientSidebar from "../../components/ClientSidebar";

export default function ClientDashboardLayout({ children }) {
  return (
    <div className="h-screen flex flex-col">
      <Header />                                      {/* remove Header from global layout if duplicated */}
      <div className="flex flex-1">
        <ClientSidebar />
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  );
}
