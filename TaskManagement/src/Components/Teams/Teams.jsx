import React, { useContext, useEffect, useState } from "react";
import BoardNav from "../BoardNav/BoardNav";
import { Button, Label, Modal } from "flowbite-react";
import styles from "../../CSS/Profile.module.scss";
import { useNavigate, useParams } from "react-router-dom";
import { usercontext } from "../UserContext/UserContext";
import axios from "axios";
import { Card, Dropdown } from "flowbite-react";
import profile from "../../Images/download.jpg";

export default function Teams() {
  const navigate = useNavigate();

  const { projectId } = useParams();
  let { setToken } = useContext(usercontext);
  let token = localStorage.getItem("token");
  const [obj, setObj] = useState("");
  const [members, setMembers] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTermMembers, setSearchTermMembers] = useState("");
  const [searchTermMembers2, setSearchTermMembers2] = useState("");
  const [searchTeamMembers, setSearchTeamMembers] = useState([]);
  const [searchMembers, setSearchMembers] = useState([]);
  const createdBy = localStorage.getItem("createdBy");
  const name = localStorage.getItem("name");

  const [openModal, setOpenModal] = useState(false);
  const [openModal1, setOpenModal1] = useState(false);
  const [openModal2, setOpenModal2] = useState(false);
  const [openModal3, setOpenModal3] = useState(false);
  const [flag, setFlag] = useState(false);
  const [flag1, setFlag1] = useState(false);

  const [formDataa, setFormDataa] = useState({
    name: "",
    projectId: projectId,
  });
  function handleChange(e) {
    setFormDataa({ ...formDataa, [e.target.name]: e.target.value });
  }
  const [selectedProject, setSelectedProject] = useState({
    id: "",
    name: "",
    chatId: "",
  });
  const [selectedTeamId, setSelectedTeamId] = useState("");
  function handleEditClick(project) {
    selectedProject.id = project ? project.id : null;
    selectedProject.name = project ? project.name : "";
    selectedProject.chatId = project ? project.chatId : "";

    setOpenModal1(true); // Open the modal
  }

  function createTeam(formDataa) {
    const form = {
      projectId: formDataa.projectId,
      name: formDataa.name,
    };
    console.log(form);

    axios
      .post(
        "http://localhost:3000/api/teams/create",
        {
          name: form.name,
          projectId: form.projectId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        setToken(token);
        setObj(res.data);

        setOpenModal(false);
        getTeams(projectId);
      })
      .catch((err) => {
        console.error("Error", err.response?.data || err);
        if (err.response?.data?.errors) {
          console.error("Validation Errors:", err.response.data.errors);
        }
      });
  }
  async function getTeams(projectId) {
    axios
      .get(`http://localhost:3000/api/teams/get-teams/${projectId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        setToken(token);

        setObj(res.data);
      })
      .catch((err) => {
        console.error("Error", err.response?.data || err);
        if (err.response?.data?.errors) {
          console.error("Validation Errors:", err.response.data.errors);
        }
      });
  }
  async function fetchMembers() {
    console.log("====================================");
    console.log("from fetch");
    console.log("====================================");
    try {
      const response = await axios.get(
        `http://localhost:3000/api/projects/members/${projectId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (flag1 == false) {
        console.log("off");

        if (Array.isArray(response.data.members)) {
          if (members.length == 0) {
            setMembers(response.data.members);
          } else {
            setMembers(
              (prevMembers) =>
                Array.isArray(prevMembers)
                  ? prevMembers.filter((p) => p.id !== response.data.members.id)
                  : [] // If prevMembers is not an array, reset to empty array
            );
          }
        } else {
          console.error("Unexpected API response format:", response.data);
          setMembers(response.data);
        }
      } else {
        console.log("here");

        setMembers(searchMembers);
      }

      // setLoading(false);
    } catch (err) {
      console.error("Error fetching members:", err.response?.data || err);
      // setLoading(false);
    }
  }
  function deleteTeam(namee) {
    axios
      .delete(`http://localhost:3000/api/teams/${selectedTeamId}`, {
        data: {
          name: namee,
          projectId: formDataa.projectId,
        },
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        setObj((obj) => obj?.filter((p) => p.name !== namee));
        getTeams(projectId);
      })
      .catch((err) => {
        console.error("Error", err.response?.data || err);
        if (err.response?.data?.errors) {
          console.error("Validation Errors:", err.response.data.errors);
        }
      });
  }

  function addMembers(memberId, teamId) {
    const form = {
      memberId: memberId,
      teamId: teamId,
      projectId: formDataa.projectId,
    };
    console.log(selectedTeamId);

    axios
      .post(
        "http://localhost:3000/api/teams/add-member",
        {
          teamId: selectedTeamId,
          userId: memberId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        setToken(token);
        setMembers((member) => member?.filter((p) => p.id !== memberId));

        setOpenModal2(false);
        alert("Member is added succesfully");
        getTeams(projectId);
      })
      .catch((err) => {
        console.error("Error", err.response?.data || err);
        if (err.response?.data?.errors) {
          console.error("Validation Errors:", err.response.data.errors);
        }
      });
  }
  async function getMembers(projectId, teamId) {
    console.log("====================================");
    console.log(selectedTeamId);
    console.log("====================================");
    axios
      .get(`http://localhost:3000/api/teams/${selectedTeamId}/members`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        setToken(token);
        if (flag == false) {
          setTeamMembers(res.data);
        } else {
          setTeamMembers(searchTeamMembers);
        }
      })
      .catch((err) => {
        console.error("Error", err.response?.data || err);
        if (err.response?.data?.errors) {
          console.error("Validation Errors:", err.response.data.errors);
        }
      });
  }
  function deleteMember(memberId, teamId, member) {
    axios
      .delete(`http://localhost:5017/api/Teams/RemoveMember`, {
        data: {
          memberId,
          teamId,
          projectId,
        },
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        setTeamMembers((teamMembers) =>
          teamMembers?.filter((p) => p.id !== memberId)
        );

        getTeams(projectId);
        setOpenModal3(false);
        alert("Member is removed");
      })
      .catch((err) => {
        console.error("Error", err.response?.data || err);
        if (err.response?.data?.errors) {
          console.error("Validation Errors:", err.response.data.errors);
        }
      });
  }
  function handleSearchChange(event) {
    const value = event.target.value;
    setSearchTerm(value);
    searchTeams(value);
  }
  function handleSearchChangeMembers(event) {
    const value = event.target.value;
    setSearchTermMembers(value);
    searchTeamsMembers(value);
  }
  function handleSearchChangeMembers2(event) {
    const value = event.target.value;
    setSearchTermMembers2(value);
    searchTeamsMembers2(value);
  }
  function searchTeams(searchTerm) {
    const encodedSearchTerm = encodeURIComponent(searchTerm);

    axios
      .get(
        `http://localhost:5017/api/Teams/SearchForTeam?projectId=${projectId}&teamName=${encodedSearchTerm}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        setObj(res.data);
      })
      .catch((err) => {
        getTeams(projectId);

        console.error("Error updating project:", err.response?.data || err);
        if (err.response?.data?.errors) {
          console.error("Validation Errors:", err.response.data.errors);
        }
        alert(err.response?.data || err);
      });
  }
  function searchTeamsMembers2(searchTermMembers) {
    const encodedSearchTermm = encodeURIComponent(searchTermMembers);

    axios
      .get(
        `http://localhost:5017/api/Teams/SearchForMemberInTeam?teamId=${selectedTeamId}&memberName=${encodedSearchTermm}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        setSearchTeamMembers(res.data); // Set new values
        setFlag(true);
        console.log(res.data);
      })
      .catch((err) => {
        getTeams(projectId);

        console.error("Error updating project:", err.response?.data || err);
        if (err.response?.data?.errors) {
          console.error("Validation Errors:", err.response.data.errors);
        }
        alert(err.response?.data || err);
      });
  }

  useEffect(() => {
    console.log("Updated searchTeamMembers:", searchTeamMembers);
    if (selectedTeamId) {
      getMembers(projectId, selectedTeamId);
    } else {
      console.warn("Skipping getMembers: selectedTeamId is undefined or empty");
    }
  }, [searchTeamMembers]);
  useEffect(() => {
    console.log("Updated searchTeamMembers:", searchMembers);
    fetchMembers(projectId);
  }, [searchMembers]);
  function searchTeamsMembers(searchTermMembers) {
    const encodedSearchTermm = encodeURIComponent(searchTermMembers);

    axios
      .get(
        `http://localhost:5017/api/Teams/SearchForMemberInProject?ProjectId=${projectId}&memberName=${encodedSearchTermm}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        console.log("res");
        console.log(res.data);

        setSearchMembers(res.data);
        console.log("memafter");
        setFlag1(true);
      })
      .catch((err) => {
        getTeams(projectId);

        console.error("Error updating project:", err.response?.data || err);
        if (err.response?.data?.errors) {
          console.error("Validation Errors:", err.response.data.errors);
        }
        alert(err.response?.data || err);
      });
  }
  useEffect(() => {
    getTeams(projectId);
  }, []);
  return (
    <>
      <BoardNav />
      <div className="p-4 flex justify-self-end pr-10 items-center ">
        <Button
          onClick={() => setOpenModal(true)}
          pill
          className={`place-self-center items-center mx-2 ${styles.profile_Button}`}
        >
          New Team <i class="fa-solid fa-plus pl-2 self-center"></i>
        </Button>
        <Modal show={openModal} onClose={() => setOpenModal(false)}>
          <Modal.Header />
          <Modal.Body>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                createTeam(formDataa);
              }}
            >
              <div className=" grid grid-cols-1 ">
                <div className="mb-2  col-span-1 px-2">
                  <div>
                    <Label htmlFor="project_name" value="Team Name" />
                  </div>
                  <input
                    name="name"
                    type="text"
                    value={formDataa.name}
                    placeholder="Enter Team name"
                    className="rounded-full w-full border-[#93cee0]  focus:ring-0 focus:border-[#93cee0] focus:shadow-[#93cee0] focus:shadow-md  focus:outline-none"
                    required
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className=" place-self-end">
                <Button
                  type="submit"
                  className={`place-self-center rounded-full w-38 mx-2 ${styles.profile_Button}`}
                >
                  Create Team
                </Button>
              </div>
            </form>
          </Modal.Body>
        </Modal>
      </div>
      <div className="w-[60%] mx-auto shadow-md shadow-[#93cee0] rounded-md  p-3 text-center">
        <div className="grid grid-cols-2 text-center   place-content-center place-items-center">
          {obj.length > 0 ? (
            obj.map((ob, index) => (
              <Card
                key={index}
                className={`h-fit flex justify-between w-11/12   col-span-1 my-2  py-1`}
              >
                <div className="flex h-[30px] justify-between relative p-0 m-0">
                  <div className="flex">
                    <div
                      className={` w-2 rounded-full h-full  mr-3 ${
                        index % 2 == 0 ? "bg-[#93cee0]" : "bg-slate-400"
                      } `}
                    ></div>
                    <div className="mr-6 ">
                      <h3 className="w-fit py-1">{ob.name}</h3>
                    </div>
                  </div>
                  {name == createdBy ? (
                    <Dropdown
                      label=""
                      dismissOnClick={false}
                      renderTrigger={() => (
                        <i className="fa-solid fa-ellipsis absolute top-1 right-3 place-self-stretch cursor-pointer "></i>
                      )}
                    >
                      <Dropdown.Item
                        onClick={() => {
                          setOpenModal2(true),
                            fetchMembers(),
                            setSelectedTeamId(ob.id);
                        }}
                      >
                        {" "}
                        <i class="fa-solid fa-plus  self-center cursor-pointer px-1"></i>
                        Add Members
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          getMembers(projectId, ob.id),
                            setOpenModal3(true),
                            setSelectedTeamId(ob.id);
                        }}
                      >
                        <i class="fa-solid fa-users cursor-pointer px-1"></i>
                        Members of Team
                      </Dropdown.Item>

                      <Dropdown.Item onClick={() => deleteTeam(ob.name)}>
                        <i className="fa-solid fa-trash text-red-600 cursor-pointer px-1"></i>{" "}
                        Delete
                      </Dropdown.Item>
                    </Dropdown>
                  ) : (
                    <Dropdown
                      label=""
                      dismissOnClick={false}
                      renderTrigger={() => (
                        <i className="fa-solid fa-ellipsis absolute top-1 right-3 place-self-stretch cursor-pointer "></i>
                      )}
                    >
                      <Dropdown.Item
                        onClick={() => {
                          getMembers(projectId, ob.id),
                            setOpenModal3(true),
                            setSelectedTeamId(ob.id);
                        }}
                      >
                        <i class="fa-solid fa-users cursor-pointer px-1"></i>
                        Members of Team
                      </Dropdown.Item>
                    </Dropdown>
                  )}

                  <ul className="flex ">
                    <li className="px-1">
                      <i className="fa-regular fa-comment"></i>{" "}
                    </li>
                    <li className="px-1">
                      <i className="fa-solid fa-video"></i>
                    </li>
                    <li className="px-1"></li>
                    <li className="px-1"></li>

                    <li className="px-1"></li>
                    <li className="px-1"></li>
                  </ul>
                </div>
              </Card>
            ))
          ) : (
            <span className="text-center w-full col-span-3 font-semibold">
              Create Teams
            </span>
          )}
        </div>
      </div>
      <Modal show={openModal1} onClose={() => setOpenModal1(false)}>
        <Modal.Header />
        <Modal.Body>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              editTeam(selectedProject);
            }}
          >
            <div className=" grid grid-cols-1 ">
              <div className="mb-2  col-span-1 px-2">
                <div>
                  <Label htmlFor="project_name" value="Project Name" />
                </div>
                <input
                  name="name"
                  type="text"
                  value={selectedProject?.name || ""}
                  placeholder="Enter project name"
                  className="rounded-full w-full border-[#93cee0]  focus:ring-0 focus:border-[#93cee0] focus:shadow-[#93cee0] focus:shadow-md  focus:outline-none"
                  required
                  onChange={(e) =>
                    setSelectedProject({
                      ...selectedProject,
                      name: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className=" place-self-end">
              <Button
                type="submit"
                className={`place-self-center rounded-full w-38 mx-2 ${styles.profile_Button}`}
              >
                Edit Team Name
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
      <Modal show={openModal2} onClose={() => setOpenModal2(false)}>
        <Modal.Header />
        <Modal.Body>
          {Array.isArray(members) && members.length > 0 ? (
            members?.map((member, index) => {
              if (members.length == 1 && member.fullName === createdBy) {
                return (
                  <div className="text-center" key={member.id}>
                    There is no members
                  </div>
                );
              }

              if (member.fullName === createdBy) {
                return <div className="text-center" key={member.id}></div>;
              }

              return (
                <div
                  key={`${member.id}-${index}`}
                  className="flex items-center justify-between p-2 my-2 bg-gray-100 rounded-lg shadow-sm"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      className="w-12 h-12 rounded-full border border-gray-300 cursor-pointer"
                      src={member.image || profile}
                      alt={member.fullName}
                      onClick={() => navigate(`/profile/${member.id}`)}
                    />
                    <p className="text-lg font-medium text-gray-800">
                      {member.fullName}
                    </p>
                  </div>
                  <i
                    onClick={() => {
                      addMembers(member.id, selectedTeamId);
                      setMembers(
                        (members) =>
                          Array.isArray(members)
                            ? members.filter((p) => p.id !== member.id) // Remove the clicked member by id
                            : [] // If prevMembers is not an array, reset to empty array
                      );
                    }}
                    class="fa-solid fa-plus p-2 self-center cursor-pointer"
                  ></i>
                </div>
              );
            })
          ) : (
            <div className="text-center">There is no member</div>
          )}
        </Modal.Body>
      </Modal>
      <Modal show={openModal3} onClose={() => setOpenModal3(false)}>
        <Modal.Header />
        <Modal.Body>
          {Array.isArray(teamMembers) && teamMembers.length > 0 ? (
            teamMembers?.map((member) => {
              if (teamMembers.length == 1 && member.fullName === createdBy) {
                return (
                  <div className="text-center" key={member.id}>
                    There is no members
                  </div>
                );
              }
              if (member.fullName === createdBy) {
                return <div className="text-center" key={member.id}></div>;
              }

              return (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-2 my-2 bg-gray-100 rounded-lg shadow-sm"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      className="w-12 h-12 rounded-full border border-gray-300 cursor-pointer"
                      src={member.image || profile}
                      alt={member.fullName}
                      onClick={() => navigate(`/profile/${member.id}`)}
                    />
                    <p className="text-lg font-medium text-gray-800">
                      {member.fullName}
                    </p>
                  </div>
                  <i
                    onClick={() => {
                      deleteMember(member.id, selectedTeamId, member),
                        setMembers((prevMembers) => [...prevMembers, member]);
                    }}
                    class="fa-solid fa-user-minus px-2 cursor-pointer"
                  ></i>
                </div>
              );
            })
          ) : (
            <div className="text-center">There is no members</div>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}
