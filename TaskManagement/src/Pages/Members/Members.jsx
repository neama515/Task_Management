import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { CiCircleRemove } from "react-icons/ci";
import { usercontext } from "../../Components/UserContext/UserContext";
import { useNavigate, useParams } from "react-router-dom";
import BoardNav from "../../Components/BoardNav/BoardNav";
import person from '../../Images/image.png'

export default function Members() {
  const navigate = useNavigate(); 
  const { setToken } = useContext(usercontext);
  const token = localStorage.getItem("token");
  const { projectId } = useParams();
  const { user } = useContext(usercontext);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [projectOwner, setProjectOwner] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  

  async function fetchMembers() {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/projects/members/${projectId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (Array.isArray(response.data)) {
        setMembers(response.data);
      } else {
        console.error("Unexpected API response format:", response.data);
        setMembers([]);
      }

      setLoading(false);
    } catch (err) {
      console.error("Error fetching members:", err.response?.data || err);
      setLoading(false);
    }
  }

  useEffect(() => {
    if (token) fetchMembers();
  }, [projectId, token]);
  

  return (
    <>
      <BoardNav />
      <div className="max-w-4xl mx-auto mt-6 p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Project Members</h2>

        {loading ? (
          <div className="flex flex-col space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="h-14 bg-gray-200 animate-pulse rounded-md"></div>
            ))}
          </div>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : members.length === 0 ? (
          <div className="flex flex-col items-center mt-6">
           <img src={person} alt="No members" className="w-32 h-32" />
            <p className="text-gray-500 text-lg mt-2">No members found.</p>
           
          </div>
        ) : (
          <div className="space-y-4">
  {members.map((member) => (
    <div key={member.id} className="flex items-center justify-between p-4 bg-gray-100 rounded-lg shadow-sm">
      <div className="flex items-center space-x-4">
        <img
          className="w-12 h-12 rounded-full border border-gray-300 cursor-pointer"
          src={member.image || person}
          alt={member.fullName}
          onError={(e) => (e.target.src = person)}
          onClick={() => navigate(`/profile/${member.id}`)}
        />
        <p className="text-lg font-medium text-gray-800">{member.fullName}</p>
      </div>

      {user?.fullName?.trim().toLowerCase() === projectOwner?.trim().toLowerCase() &&
        user?.id !== member.id && ( 
          <CiCircleRemove
            className="text-2xl text-red-500 cursor-pointer hover:text-red-700"
            onClick={() => handleRemoveClick(member.id)}
          />
      )}
    </div>
  ))}
</div>

        )}
      </div>
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-semibold text-red-600 mb-3">Remove Member?</h2>
            <p className="text-gray-600 mb-4">Are you sure you want to remove this member? This action cannot be undone.</p>
            <div className="flex justify-end">
              <button onClick={() => setShowConfirm(false)} className="mr-3 px-4 py-2 bg-gray-300 rounded">
                Cancel
              </button>
              
              {user?.fullName?.trim().toLowerCase() === projectOwner?.trim().toLowerCase() &&
  user?.id !== member.id && ( 
    <CiCircleRemove
      className="text-2xl text-red-500 cursor-pointer hover:text-red-700"
      onClick={() => handleRemoveClick(member.id)}
    />
)}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
