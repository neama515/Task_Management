import React, { useContext, useEffect } from "react";
import { usercontext } from "../../Components/UserContext/UserContext";
import axios from "axios";
import { Button } from "flowbite-react";
import styles from "../../CSS/Profile.module.scss";
import Profile_nav from "../../Components/Profile_nav/Profile_nav";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, Dropdown } from "flowbite-react";
import {  Label, Modal } from "flowbite-react";
import { useState } from "react";
export default function Projects() {
  const [copiedCode, setCopiedCode] = useState(null);

  const name = localStorage.getItem("name");
  let navigate = useNavigate();
  const [selectedProject, setSelectedProject] = useState({
    id: "",
    name: "",
    type: "",
    description: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [str1, setStr1] = useState("");
  const [flag, setFlag] = useState(false);
  const [obj, setObj] = useState("");
  const [code, setCode] = useState("");
  let { setToken } = useContext(usercontext);
  let token = localStorage.getItem("token");
  const [openModal, setOpenModal] = useState(false);
  const [openModal1, setOpenModal1] = useState(false);
  const [openModal2, setOpenModal2] = useState(false);
  const [openModal3, setOpenModal3] = useState(false);
  const location = useLocation();
  console.log("====================================");
  console.log(obj);
  console.log("====================================");
  const [formDataa, setFormDataa] = useState({
    name: "",
    type: "",
    description: "",
    createdBy: "",
    id: "",
  });
  if (obj.length > 0) {
    localStorage.setItem("proj1", obj[0]?.name || "Create your first project");
    if (obj.length > 1)
      localStorage.setItem(
        "proj2",
        obj[1].name || "Create Your second project"
      );
  }
  const handleCopyCode = (code) => {
    navigator.clipboard
      .writeText(code)
      .then(() => {
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 2000); // Reset after 2 seconds
      })
      .catch((err) => console.error("Failed to copy:", err));
  };
  function handleEditClick(project) {
    selectedProject.id = project ? project.id : null;
    selectedProject.description = project ? project.description : "";
    selectedProject.createdBy = project ? project.createdBy : "";
    selectedProject.name = project ? project.name : "";
    selectedProject.type = project ? project.type : "";

    setOpenModal1(true); // Open the modal
  }
  function handleChange(e) {
    setFormDataa({ ...formDataa, [e.target.name]: e.target.value });
  }
  function createProject(formDataa) {
    console.log("================prrrrrr====================");
    console.log(formDataa);
    console.log("====================================");
    if (!formDataa || !formDataa.name) {
      console.error("formData is undefined or missing required fields");
      return;
    }
    const form = new FormData(); // Use FormData correctly
    form.append("name", formDataa.name);
    form.append("type", formDataa.type);
    form.append("description", formDataa.description);

    axios
      .post(
        "http://localhost:3000/api/projects?sort=asc",
        {
          name: formDataa.name,
          type: formDataa.type,
          description: formDataa.description,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        setToken(token);
        setObj((form) => [...form, res.data]);
        getProjects();
        console.log("====================================");
        console.log(res.data);
        console.log("====================================");
      })
      .catch((err) => {
        if (err.response) {
          console.error("Response Data:", err.response.data);
        }
      });
    setOpenModal(false);
    if (obj.length > 0) {
      localStorage.setItem(
        "proj1",
        obj[0]?.name || "Create your first project"
      );
      if (obj.length > 1)
        localStorage.setItem(
          "proj2",
          obj[1].name || "Create Your second project"
        );
    }
  }
  async function getProjects() {
    axios
      .get(
        `http://localhost:3000/api/projects/my-projects?sort=asc
`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        setToken(token);

        const sortedProjects = res.data.sort((a, b) => a.id - b.id);
        setObj(sortedProjects);
        console.log("======ggggggggg==============================");
        console.log(res.data);
        console.log("====================================");
      })
      .catch((res) => {
        console.log(res);
      });
    if (obj.length > 0) {
      localStorage.setItem(
        "proj1",
        obj[0]?.name || "Create your first project"
      );
      if (obj.length > 1)
        localStorage.setItem(
          "proj2",
          obj[1].name || "Create Your second project"
        );
    }
  }
  async function getProjectById(id) {
    axios
      .post(`http://localhost:3000/api/projects/join-by-code`,{Code:id} ,{
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setFlag(true);
        setStr1("You joined successfully");
        setOpenModal2(false);
        setToken(token);
        getProjects();
        alert("✅ You joined the project successfully!");
      })
      .catch((err) => {
        console.error("Error updating project:", err.response?.data || err);
        if (err.response?.data?.errors) {
          console.error("Validation Errors:", err.response.data.errors);
        }
        alert(err.response?.data || err);
      });
    setOpenModal2(false);
    if (obj.length > 0) {
      localStorage.setItem(
        "proj1",
        obj[0]?.name || "Create your first project"
      );
      if (obj.length > 1)
        localStorage.setItem(
          "proj2",
          obj[1].name || "Create Your second project"
        );
    }
  }
  async function getProjectCode(id) {
    handleCopyCode(id);
    setOpenModal3(true);
    axios
      .get(
        `http://localhost:3000/api/projects/code/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        setToken(token);
        setCode(res.data.code);
        alert("Code is Copied");
      })
      .catch((err) => {
        console.error("Error updating project:", err.response?.data || err);
        if (err.response?.data?.errors) {
          console.error("Validation Errors:", err.response.data.errors);
        }
      });
    if (obj.length > 0) {
      localStorage.setItem(
        "proj1",
        obj[0]?.name || "Create your first project"
      );
      if (obj.length > 1)
        localStorage.setItem(
          "proj2",
          obj[1].name || "Create Your second project"
        );
    }
  }

  function deleteProject(projectId) {
    axios
      .delete(
        `http://localhost:3000/api/projects/${projectId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        setObj((obj) => obj.filter((p) => p.id !== projectId));
      })
      .catch((err) => {
        console.error("Error deleting project:", err.response?.data || err);
      });
    if (obj.length > 0) {
      localStorage.setItem(
        "proj1",
        obj[0]?.name || "Create your first project"
      );
      if (obj.length > 1)
        localStorage.setItem(
          "proj2",
          obj[1].name || "Create Your second project"
        );
    }
  }
  function leaveProject(projectId) {
    axios
      .delete(
        `http://localhost:3000/api/projects/leave/${projectId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        setObj((obj) => obj.filter((p) => p.id !== projectId));
      })
      .catch((err) => {
        console.error("Error deleting project:", err.response?.data || err);
      });
    if (obj.length > 0) {
      localStorage.setItem(
        "proj1",
        obj[0]?.name || "Create your first project"
      );
      if (obj.length > 1)
        localStorage.setItem(
          "proj2",
          obj[1].name || "Create Your second project"
        );
    }
  }
 



  function goBoard(id, name, createdBy) {
    axios
      .get(
        `http://localhost:3000/api/sections/getAll/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        console.log("====================================");
        console.log(res);
        console.log("====================================");

        localStorage.setItem("selectedProjectName", name);
        localStorage.setItem("createdBy", createdBy);

        navigate(`/board/${id}`, { state: { projectName: name } });
      })
      .catch((err) => {
        console.error("Error fetching project:", err.response?.data || err);
        alert(err.response?.data || err);
      });
  }

  useEffect(() => {
    getProjects();
    if (obj.length > 0) {
      localStorage.setItem(
        "proj1",
        obj[0]?.name || "Create your first project"
      );
      if (obj.length > 1)
        localStorage.setItem(
          "proj2",
          obj[1]?.name || "Create Your second project"
        );
    }
    console.log("====================================");
    console.log(obj);
    console.log("====================================");
  }, []);

  return (
    <>
      <Profile_nav location={location} />
      <section className="p-5 text-center">
      

        <div
          href="#"
          className="w-[99%] mx-auto mt-4 h-auto shadow-[#93cee0] shadow-sm border rounded-md px-2 py-4 border-[#93cee0]"
        >
          <div className="flex justify-self-end pr-10 items-center ">
            <Button
              onClick={() => setOpenModal(true)}
              pill
              className={`place-self-center items-center mx-2 ${styles.profile_Button}`}
            >
              New Project <i class="fa-solid fa-plus pl-2 self-center"></i>
            </Button>
            <Modal show={openModal} onClose={() => setOpenModal(false)}>
              <Modal.Header />
              <Modal.Body>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    createProject(formDataa);
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
                        value={formDataa.name}
                        placeholder="Enter project name"
                        className="rounded-full w-full border-[#93cee0]  focus:ring-0 focus:border-[#93cee0] focus:shadow-[#93cee0] focus:shadow-md  focus:outline-none"
                        required
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="mb-2  col-span-1 px-2 mt-0">
                    <div className=" col-span-1  mt-0">
                      <div>
                        <Label htmlFor="projectType" value="Project Type" />
                        <input
                          value={formDataa.type}
                          name="type"
                          type="text"
                          placeholder="Enter project type"
                          className="rounded-full w-full border-[#93cee0]  focus:ring-0 focus:border-[#93cee0] focus:shadow-[#93cee0] focus:shadow-md  focus:outline-none"
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="Info" value="Information about project" />
                      <input
                        value={formDataa.description}
                        name="description"
                        placeholder="Enter Information about project"
                        type="text"
                        required
                        className="rounded-full w-full  border-[#93cee0]  focus:ring-0 focus:border-[#93cee0] focus:shadow-[#93cee0] focus:shadow-md  focus:outline-none"
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className=" place-self-end">
                    <Button
                      type="submit"
                      className={`place-self-center rounded-full w-38 mx-2 ${styles.profile_Button}`}
                    >
                      Create Project
                    </Button>
                  </div>
                </form>
              </Modal.Body>
            </Modal>

            <Button
              pill
              className={`place-self-center w-32 mx-2 ${styles.profile_Button}`}
              onClick={() => {
                setOpenModal2(true), setFlag(false);
              }}
            >
              Join Project
            </Button>
            <Modal show={openModal2} onClose={() => setOpenModal2(false)}>
              <Modal.Header />
              <Modal.Body>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    getProjectById(formDataa.id);
                  }}
                >
                  <div className=" grid grid-cols-1 ">
                    <div className="mb-2  col-span-1 px-2">
                      <div>
                        <Label htmlFor="project_id" value="Project Id" />
                      </div>
                      <input
                        name="id"
                        type="text"
                        value={formDataa.id}
                        placeholder="Enter project id"
                        className="rounded-full w-full border-[#93cee0]  focus:ring-0 focus:border-[#93cee0] focus:shadow-[#93cee0] focus:shadow-md  focus:outline-none"
                        required
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="mb-2  col-span-1 px-2 mt-0"></div>
                  <div className=" place-self-end">
                    <Button
                      type="submit"
                      className={`place-self-center rounded-full w-38 mx-2 ${styles.profile_Button}`}
                    >
                      Join Project
                    </Button>
                  </div>
                </form>
              </Modal.Body>
            </Modal>
          </div>
          <div className="grid grid-cols-3 px-5 py-3 place-content-center">
            {obj.length > 0 ? (
              obj.map((ob, index) => (
                <Card
                  key={index}
                  className={`h-56 w-11/12 mx-auto col-span-1 my-2  py-6`}
                >
                  <div className="flex h-full relative">
                    <div
                      className={` w-5 rounded-full h-full  mr-3 ${
                        index % 2 == 0 ? "bg-[#93cee0]" : "bg-slate-400"
                      } `}
                    ></div>
                    <div className="mr-6 ">
                      <h3 className="w-fit py-1">{ob.name}</h3>
                      <p className="w-fit py-1">{ob.type}</p>
                      <p className="w-fit py-1 text-gray-500">
                        {ob.description}
                      </p>
                      <span className="w-fit py-1 text-gray-500">
                        Created By {ob.createdBy}
                      </span>
                    </div>
                    <Dropdown
                      label=""
                      dismissOnClick={false}
                      renderTrigger={() => (
                        <i className="fa-solid fa-ellipsis absolute top-1 right-3 place-self-stretch cursor-pointer"></i>
                      )}
                    >
                      <Dropdown.Item
                        onClick={() => {
                          getProjectCode(ob.id);
                        }}
                      >
                        Get Code
                      </Dropdown.Item>
                     
                      {ob.createdBy == name ? (
                        <Dropdown.Item onClick={() => deleteProject(ob.id)}>
                          Delete
                        </Dropdown.Item>
                      ) : (
                        <Dropdown.Item onClick={() => leaveProject(ob.id)}>
                          Leave
                        </Dropdown.Item>
                      )}
                    </Dropdown>
                  </div>
                  <Button
                    onClick={() => goBoard(ob.id, ob.name, ob.createdBy)}
                    className={`place-self-center ${styles.profile_Button}`}
                  >
                    Go to Board
                  </Button>
                </Card>
              ))
            ) : (
              <span className="text-center w-full col-span-3 font-semibold">
                Create your first project
              </span>
            )}
          </div>
          <Modal show={openModal1} onClose={() => setOpenModal1(false)}>
            <Modal.Header />
            <Modal.Body>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  updateProject(selectedProject);
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
                <div className="mb-2  col-span-1 px-2 mt-0">
                  <div className=" col-span-1  mt-0">
                    <div>
                      <Label htmlFor="projectType" value="Project Type" />
                      <input
                        value={selectedProject?.type || ""}
                        name="type"
                        type="text"
                        required
                        placeholder="Enter project type"
                        className="rounded-full w-full border-[#93cee0]  focus:ring-0 focus:border-[#93cee0] focus:shadow-[#93cee0] focus:shadow-md  focus:outline-none"
                        onChange={(e) =>
                          setSelectedProject({
                            ...selectedProject,
                            type: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="Info" value="Information about project" />
                    <input
                      value={selectedProject?.description || ""}
                      name="description"
                      placeholder="Enter Information about project"
                      type="text"
                      required
                      className="rounded-full w-full  border-[#93cee0]  focus:ring-0 focus:border-[#93cee0] focus:shadow-[#93cee0] focus:shadow-md  focus:outline-none"
                      onChange={(e) =>
                        setSelectedProject({
                          ...selectedProject,
                          description: e.target.value,
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
                    Edit Project
                  </Button>
                </div>
              </form>
            </Modal.Body>
          </Modal>
          {/* <Modal show={openModal3} onClose={() => setOpenModal3(false)}>
            <Modal.Header />
            <Modal.Body>
              <p className="w-full text-center">Project Code: {code}</p>
            </Modal.Body>
          </Modal> */}
        </div>
      </section>{" "}
    </>
  );
}
