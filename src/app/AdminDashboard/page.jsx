'use client'
import React, { useEffect, useState } from 'react';
import AdminHome from '../components/AdminHome'; // Ensure you have these components correctly imported
import ContributorHome from '../components/ContributorHome'; // Ensure you have these components correctly imported

const HomePage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  const [errorAnalytics, setErrorAnalytics] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(''); // State to store user role
  const [currentPage, setCurrentPage] = useState('home'); // State for current page
  const API_BASE = process.env.NEXT_PUBLIC_API_DOMAIN;

  // Get user from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("authUser");
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setRole(userData.role); // Set user role
      }
    }
  }, []);

  // Fetch analytics after user is fetched
  useEffect(() => {
    if (!user) return;
    console.log("Fetching analytics for user:", user);

    const fetchAnalytics = async () => {
      setLoadingAnalytics(true);
      setErrorAnalytics("");

      try {
        const token = localStorage.getItem("authToken");
        const res = await fetch(`${API_BASE}/api/executives/analytics/summary/`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`, // Authorization token from localStorage
          },
        });

        const json = await res.json();
        if (!res.ok || json.status_code !== 200) {
          throw new Error(json?.message || "Failed to load analytics");
        }

        setAnalytics(json.data);
      } catch (err) {
        setErrorAnalytics(err.message);
      } finally {
        setLoadingAnalytics(false);
      }
    };

    fetchAnalytics();
  }, [user]);

  const renderContent = () => {
    if (role === "admin") {
      return <AdminHome analytics={analytics} loading={loadingAnalytics} error={errorAnalytics} />;
    } else if (role === "contributor") {
      return <ContributorHome contributorId={user?.id} analytics={analytics} loading={loadingAnalytics} error={errorAnalytics} />;
    } else {
      return <div>Loading...</div>; // A fallback in case the role is not defined
    }
  };

  return (
    <div>
      {renderContent()}
    </div>
  );
};

export default HomePage;
