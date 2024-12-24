import React, { useEffect, useState } from "react";
import axios from "axios";
import { HiCursorClick } from "react-icons/hi";

const Trigger = () => {
  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const fetchTriggerData = async () => {
    setLoading(true);
    try {
      const payload = { action: "sync" };
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/trigger/manual`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
            "ngrok-skip-browser-warning": "true",
          },
        }
      );
      setResponseData(response.data);
    } catch (err) {
      if (err.response) {
        setError(
          `Error: ${err.response.status} - ${err.response.data.message}`
        );
      } else if (err.request) {
        setError("No response received from the server.");
      } else {
        setError(`Error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAutomateDataIngestion = () => {
    fetchTriggerData();
  };

  return (
    <div className="p-4">
      <div className="flex justify-center mt-4">
        <h1 className="text-xl font-bold mb-4">Trigger Synchronization</h1>
      </div>
      <div className="flex justify-center mb-4">
        <button
          onClick={handleAutomateDataIngestion}
          className="px-4 py-2 bg-[#2f2f2f] text-white rounded-lg hover:bg-[#212121] transition flex items-center"
        >
          Automate Document Syncing
          <HiCursorClick className="ml-2" />
        </button>
      </div>
      {loading && (
        <div className="flex justify-center items-center min-h-screen">
          <div className="border-t-4 border-[#212121] border-solid w-16 h-16 rounded-full animate-spin"></div>
        </div>
      )}
      {error && <p className="text-red-500">{error}</p>}
      {responseData && (
        <div>
          <h2 className="flex justify-center text-lg font-semibold">
            {responseData.message}
          </h2>
          {responseData.new_files?.length > 0 ? (
            <div className="overflow-x-auto bg-white p-6 rounded-lg shadow-lg">
              {/* <h2 className="text-2xl font-semibold mb-4">Files</h2> */}
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-gray-200 text-left">
                    <th className="px-4 py-2 border">No</th>
                    <th className="px-4 py-2 border">File Name</th>
                    <th className="px-4 py-2 border">Path</th>
                    <th className="px-4 py-2 border">Modified Time</th>
                  </tr>
                </thead>
                <tbody>
                  {responseData.new_files.map((file, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border">{index + 1}</td>
                      <td className="px-4 py-2 border">{file.name}</td>
                      <td className="px-4 py-2 border">{file.path}</td>
                      <td className="px-4 py-2 border">{file.modifiedTime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex justify-center mt-4">
              <p className="text-gray-500">No new files found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Trigger;
