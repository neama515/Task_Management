import { useParams, Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Profile_nav from "../Profile_nav/Profile_nav";
import { FaVideo, FaRegFolder, FaUsers, FaPlus, FaUser } from "react-icons/fa";
import { AiOutlineCalendar } from "react-icons/ai";
import axios from "axios";
import { toast } from "react-toastify";

export default function BoardNav() {
  const { projectId } = useParams();
  const location = useLocation();
  const [projectName, setProjectName] = useState("");
  const [members, setMembers] = useState([]);
  const [optionsOpen, setOptionsOpen] = useState(false); 
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [copiedCode, setCopiedCode] = useState(null);

  useEffect(() => {
    if (location.state?.projectName) {
      setProjectName(location.state.projectName);
    } else {
      setProjectName(localStorage.getItem("selectedProjectName") || "Unnamed Project");
    }

    fetchMembers();
  }, [location]);

  async function fetchMembers() {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:3000/api/projects/members/${projectId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMembers(response.data.members || []);
      
    } catch (err) {
      console.error("Error fetching members:", err.response?.data || err.message);
    }
  }

  const tabs = [
    { name: "Board", path: `/Board/${projectId}` },
    { name: "Teams", path: `/teams/${projectId}` },
  ];

  const toggleOptions = () => {
    setOptionsOpen(!optionsOpen);
  };

  const closeOptions = () => {
    setOptionsOpen(false);
  };

  const openInviteModal = () => {
    setInviteModalOpen(true);
    closeOptions();
  };

  const closeInviteModal = () => {
    setInviteModalOpen(false);
    setUserEmail("");
  };

  const inviteUserToProject = async () => {
    if (!userEmail.trim()) {
      toast.error("Please enter a valid email address.");
      return;
    }
  
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5017/api/Board/InviteUserTOProject",
        { projectId, userEmail },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      console.log("Response:", response.data);
      toast.success("User invited successfully!");
      closeInviteModal();
      fetchMembers();
    } catch (err) {
      console.error("Error inviting user:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Failed to invite user.");
    }
  };

  const handleCopyCode = (code) => {
    navigator.clipboard
      .writeText(code)
      .then(() => {
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 2000);
      })
      .catch((err) => console.error("Failed to copy:", err));
  };

  const getProjectCode = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:3000/api/projects/code/${projectId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const code = response.data;
      handleCopyCode(code);
      toast.success("Code copied to clipboard!");
    } catch (err) {
      console.error("Error fetching project code:", err.response?.data || err.message);
      toast.error("Failed to fetch project code. Please try again.");
    }
  };

  return (
    <>
      <Profile_nav />
      <nav className="flex justify-between items-center px-6 py-3 border-b bg-white shadow-sm">
        <div className="flex items-center gap-4">
          <div className="text-xl font-semibold text-gray-800">{projectName}</div>

          <div className="flex items-center">
            {members.slice(0, 3).map((member, index) => (
              <div key={member.id} className="relative group">
                {member.image ? (
                  <img
                    src={member.image}
                    alt={member.fullName}
                    className="w-8 h-8 rounded-full mr-2"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full mr-2 flex items-center justify-center bg-gray-200">
                    <FaUser className="w-4 h-4 text-gray-500" />
                  </div>
                )}
                <span className="absolute -top-7 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {member.fullName}
                </span>
              </div>
            ))}
            {members.length > 3 && (
              <div className="w-8 h-8 flex items-center justify-center bg-gray-300 text-gray-700 text-xs font-semibold rounded-full border-2 border-white -ml-2">
                +{members.length - 3}
              </div>
            )}

            <div className="relative">
              <button
                onClick={toggleOptions}
                className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
              >
                <FaPlus className="w-4 h-4 text-black" />
              </button>
              {optionsOpen && (
                <div className="absolute right-0 mt-2 w-28 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                  <button
                    className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                    onClick={() => {
                      getProjectCode();
                      closeOptions();
                    }}
                  >
                    Get Code
                  </button>
                 
                </div>
              )}
            </div>
          </div>
        </div>
        <ul className="flex gap-6 text-[1rem]">
          {tabs.map((tab) => (
            <li key={tab.name} className="relative">
              <Link
                to={tab.path}
                className={`font-medium transition-all duration-300 ${
                  location.pathname === tab.path
                    ? "text-black font-semibold border-b-2 border-[#93cee0]"
                    : "text-gray-500 hover:text-[#93cee0]"
                }`}
              >
                {tab.name}
              </Link>
            </li>
          ))}
        </ul>
        <ul className="flex items-center gap-6 text-xl">
          <li className="cursor-pointer">
            <Link to={`/members/${projectId}`}>
              <FaUsers />
            </Link>
          </li>
        </ul>
      </nav>

      {inviteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Invite User</h2>
            <input
              type="email"
              placeholder="Enter user email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              className="font-primary rounded-lg w-[300px] h-[38px] text-black bg-white border border-gray-200 text-base font-normal pl-3 mt-1 outline-none placeholder:text-gray-200 placeholder:text-sm hover:bg-gray-100 focus:bg-white focus:border-blue-300 focus:shadow-[0_0_5px_rgba(147,197,253,0.5)]"
            />
            <div className="flex justify-end mt-4">
              <button
                onClick={closeInviteModal}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md mr-2 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={inviteUserToProject}
                className="px-4 py-2 bg-[#639eb0] text-white rounded-md hover:bg-[#517f91]"
              >
                Invite
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}