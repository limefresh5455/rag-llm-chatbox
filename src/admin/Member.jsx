import React, { useEffect, useState } from "react";
import axios from "axios";

const Member = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));
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
            Authorization: `Bearer ${user.token}`,
            "ngrok-skip-browser-warning": "true",
          },
        }
      );
      setMembers(response.data.members);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (email) => {
    setSelectedEmail(email);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEmail(null);
  };

  const deleteMember = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/delete_member`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "ngrok-skip-browser-warning": "true",
        },
        data: { email: selectedEmail },
      });
      alert("Member deleted successfully!");
      fetchMembers();
      closeModal();
    } catch (error) {
      alert("Failed to delete member. Please try again.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching data: {error.message}</div>;
  }

  return (
    <div className="flex">
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Member</h1>
        </div>
        <div className="overflow-x-auto bg-white p-6 rounded-lg shadow-lg">
          {/* <h2 className="text-2xl font-semibold mb-4">Members</h2> */}
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="px-4 py-2 border">ID</th>
                <th className="px-4 py-2 border">Email</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">{member.id}</td>
                  <td className="px-4 py-2 border">{member.email}</td>
                  <td className="px-4 py-2 border text-left">
                    {/* <button className="text-blue-500 hover:text-blue-700">
                      Edit
                    </button> */}
                    <button
                      onClick={() => openModal(member.email)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
            <p className="mb-6">
              Are you sure you want to delete member with email: {selectedEmail}
              ?
            </p>
            <div className="flex justify-end">
              <button
                onClick={closeModal}
                className="px-4 py-2 mr-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={deleteMember}
                className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Member;
