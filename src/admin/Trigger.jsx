import React, { useEffect, useState } from "react";
import axios from "axios";
import { HiCursorClick } from "react-icons/hi";

const Trigger = () => {
  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch data from API
  const fetchTriggerData = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/trigger/manual");
      setResponseData(response.data);
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Handle Automate Data Ingestion button click
  const handleAutomateDataIngestion = () => {
    fetchTriggerData();
  };

  return (
    <div className="p-4">
      <div className="flex justify-center mt-4">
        <h1 className="text-xl font-bold mb-4">Trigger Synchronization</h1>
      </div>

      {/* Button to automate data ingestion */}
      <div className="flex justify-center mb-4">
        <button
          onClick={handleAutomateDataIngestion}
          className="px-4 py-2 bg-[#2f2f2f] text-white rounded-lg hover:bg-[#212121] transition flex items-center"
        >
          Automate Document Syncing
          <HiCursorClick className="ml-2" />
        </button>
      </div>

      {/* Loading Spinner */}
      {loading && (
        <div className="flex justify-center items-center min-h-screen">
          <div className="border-t-4 border-[#212121] border-solid w-16 h-16 rounded-full animate-spin"></div>
        </div>
      )}

      {error && <p className="text-red-500">{error}</p>}

      {/* Table Display */}
      {responseData && (
        <div>
          <h2 className="text-lg font-semibold">{responseData.message}</h2>
          {responseData.new_files?.length > 0 ? (
            <div className="overflow-x-auto mt-4">
              <table className="min-w-full table-auto border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2">
                      File Name
                    </th>
                    <th className="border border-gray-300 px-4 py-2">Path</th>
                    <th className="border border-gray-300 px-4 py-2">
                      Modified Time
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {responseData.new_files.map((file, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">
                        {file.name}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {file.path}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {file.modifiedTime}
                      </td>
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
