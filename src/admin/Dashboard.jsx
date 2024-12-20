import React, { useState, useEffect } from "react";
import axios from "axios";

const Dashboard = () => {
  const [totalMembers, setTotalMembers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/members`,
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        }
      );
      setTotalMembers(response.data.members.length);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen font-bold">
        <div class="border-t-4 border-[#212121] border-solid w-16 h-16 rounded-full animate-spin"></div>
        {/* Loading... */}
      </div>
    );
  }

  if (error) {
    return <div>Error fetching data: {error.message}</div>;
  }

  return (
    <div className="flex">
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Total Members</h2>
            <p className="text-3xl font-bold text-blue-600">{totalMembers}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
