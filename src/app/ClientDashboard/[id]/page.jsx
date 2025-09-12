"use client";
import Header from "../../components/Header";
import ClientSidebar from "../../components/ClientSidebar";
import { useParams } from "next/navigation";
import SocialCard from "./SocialCard/page";

export default function ClientDashboard() {
  const params = useParams();
  const { id } = params; // executive ID from the URL

  return (
    <div className="h-screen flex flex-col">
      {/* <Header /> */}
      <div className="flex flex-1">
        {/* <ClientSidebar /> */}
        {/* Pass executive ID into MainContent so it can load executive-specific data */}
        <SocialCard executiveId={id} />
      </div>
    </div>
  );
}
