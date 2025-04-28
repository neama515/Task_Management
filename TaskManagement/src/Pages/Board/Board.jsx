import React, { useState, useEffect } from "react";
import axios from "axios";
import style from "../../CSS/Board/Board.module.scss";
import {
  FaEllipsisV,
  FaEllipsisH,
  FaUser,
  FaCheckCircle,
  FaTrash,
} from "react-icons/fa";
import { useParams } from "react-router-dom";
import BoardNav from "../../Components/BoardNav/BoardNav";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { toast } from "react-toastify";
import person from "../../Images/image.png";

export default function Board() {
  const { projectId } = useParams();
  const [sections, setSections] = useState([]);
  const [newTasks, setNewTasks] = useState({});
  const [editingSection, setEditingSection] = useState(null);
  const [updatedSectionName, setUpdatedSectionName] = useState("");
  const [showAddTaskInput, setShowAddTaskInput] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showAddSubTaskInput, setShowAddSubTaskInput] = useState(false);
  const [newSubTaskName, setNewSubTaskName] = useState("");
  const [editingSubTaskId, setEditingSubTaskId] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [taskDropdownOpen, setTaskDropdownOpen] = useState(null);
  const [newSectionName, setNewSectionName] = useState("");
  const [showAddSectionModal, setShowAddSectionModal] = useState(false);
  const [members, setMembers] = useState([]);
  const [showSubTaskModal, setShowSubTaskModal] = useState(false);
  const [selectedSubTask, setSelectedSubTask] = useState(null);
  const [tempSelectedMembers, setTempSelectedMembers] = useState([]);

  useEffect(() => {
    fetchSections();
    fetchMembers();
  }, [projectId]);

  // Fetch all sections
  async function fetchSections() {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `http://localhost:3000/api/sections/getAll/${projectId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const apiSections = response.data || [];
      setSections(apiSections);
    } catch (err) {
      console.error("Error fetching tasks:", err.response?.data || err.message);
    }
  }

  // Drag and Drop Logic
  const onDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceSection = sections.find((sec) => sec.id === source.droppableId);
    const destinationSection = sections.find(
      (sec) => sec.id === destination.droppableId
    );

    const [movedTask] = sourceSection.tasks.splice(source.index, 1);

    const isTaskCompleted = destinationSection.name.toLowerCase() === "done";

    movedTask.isCompleted = isTaskCompleted;

    destinationSection.tasks.splice(destination.index, 0, movedTask);

    setSections((prevSections) =>
      prevSections.map((section) =>
        section.id === sourceSection.id
          ? { ...section, tasks: sourceSection.tasks }
          : section.id === destinationSection.id
          ? { ...section, tasks: destinationSection.tasks }
          : section
      )
    );

    console.log(
      `Moving Task ${movedTask.id} to section ${destinationSection.name}, isCompleted: ${isTaskCompleted}`
    );

    await updateTaskSection(
      movedTask.id,
      destinationSection.id,
      isTaskCompleted
    );
  };

  // Toggle dropdown for sections
  const toggleDropdown = (sectionId) => {
    setDropdownOpen(dropdownOpen === sectionId ? null : sectionId);
  };

  // Close dropdown
  const closeDropdown = () => {
    setDropdownOpen(null);
  };

  // Toggle dropdown for tasks
  const toggleTaskDropdown = (taskId) => {
    setTaskDropdownOpen(taskDropdownOpen === taskId ? null : taskId);
  };

  // Close dropdowns
  const closeDropdowns = () => {
    setDropdownOpen(null);
    setTaskDropdownOpen(null);
  };

  // Add a new section
  async function addSection(sectionData) {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found. Please login first.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/api/sections/add",
        {
          name: sectionData.name,
          projectId: sectionData.projectId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Section added successfully:", response.data);
      return response.data;
    } catch (err) {
      console.error("Error adding section:", err.response?.data || err.message);
      throw err;
    }
  }

  // Handle adding a new section
  const handleAddSection = async () => {
    if (!newSectionName || newSectionName.trim() === "") {
      toast.error("Section name is required.");
      return;
    }

    const newSection = {
      id: `section-${Date.now()}`,
      projectId: projectId,
      name: newSectionName.trim(),
      tasks: [],
    };

    try {
      const addedSection = await addSection(newSection);
      setSections([...sections, addedSection]);
      setNewSectionName(""); // Clear the input field
      setShowAddSectionModal(false); // Close the modal
      toast.success("Section added successfully!");
    } catch (err) {
      console.error("Failed to add section:", err);
      toast.error("Failed to add section. Please try again.");
    }
  };

  // Edit a section
  async function editSection(sectionId, updatedSectionData) {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        "http://localhost:3000/api/sections/edit",
        { id: sectionId, name: updatedSectionData.name, ...updatedSectionData },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setSections((prevSections) =>
        prevSections.map((section) =>
          section.id === sectionId
            ? { ...section, ...updatedSectionData }
            : section
        )
      );

      setEditingSection(null);
    } catch (err) {
      console.error(
        "Error editing section:",
        err.response?.data || err.message
      );
      alert("Failed to edit section. Please try again.");
    }
  }

  // Delete a section
  async function handleDeleteSection(sectionId) {
    try {
      await axios.delete(`http://localhost:3000/api/sections/${sectionId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      setSections((prevSections) =>
        prevSections.filter((section) => section.id !== sectionId)
      );
    } catch (err) {
      console.error(
        "Error deleting section:",
        err.response?.data || err.message
      );
      alert("Failed to delete section. Please try again.");
    }
  }

  // Add a new task
  async function addTask(sectionId, taskName) {
    if (!taskName || taskName.trim() === "") {
      alert("Task name is required.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found. Please login first.");
      return;
    }

    const section = sections.find((sec) => sec.id === sectionId);
    if (!section) {
      console.error("Section not found:", sectionId);
      alert("Section not found!");
      return;
    }

    const today = new Date();
    const dueDate = new Date(today);
    dueDate.setDate(dueDate.getDate() + 7); // Set due date a week later
    const isTaskCompleted = section.name.toLowerCase() === "done";

    const newTaskData = {
      sectionId: section.id,
      name: taskName.trim(),
      description: "Task description",
      startDate: new Date().toISOString().split("T")[0],
      dueDate: new Date().toISOString().split("T")[0],
      isCompleted: isTaskCompleted, // ✅ Set flag correctly
      projectId: projectId,
    };

    // console.log("New Task Data Before API Call:", newTaskData); // Now it's safe to log the data
    console.log(newTaskData);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/tasks/add",
        {
          title: newTaskData.name,
          sectionId: newTaskData.sectionId,
          projectId: newTaskData.projectId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // console.log("New Task API Response:", response.data); // Debugging API Response

      if (!response.data) {
        throw new Error("Task creation failed, response data is empty.");
      }

      const addedTask = response.data;

      setSections((prevSections) =>
        prevSections.map((sec) =>
          sec.id === section.id
            ? { ...sec, tasks: [...sec.tasks, addedTask] }
            : sec
        )
      );

      //  Reset input fields
      setNewTasks((prevTasks) => ({ ...prevTasks, [sectionId]: "" }));
      setShowAddTaskInput((prev) => ({ ...prev, [sectionId]: false }));

      toast.success("Task added successfully!");
    } catch (err) {
      console.error("Error adding task:", err.response?.data || err.message);
      alert("Failed to add task. Please try again.");
    }
  }

  const handleSaveTask = async () => {
    // Ensure the state is updated before sending
    const updatedTask = {
      ...selectedTask,
      startDate: selectedTask.startDate
        ? new Date(selectedTask.startDate).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      dueDate: selectedTask.dueDate
        ? new Date(selectedTask.dueDate).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
    };

    console.log("Final Updated Task Before API Call:", updatedTask); // Debugging

    await editTask(updatedTask.id, updatedTask);
  };

  // Task edit
  async function editTask(taskId, updatedTaskData) {
    console.log("ediiiiiiiiiiiiiiit");

    if (!taskId) {
      console.error("Error: Task ID is missing.");
      toast.error("Task ID is missing.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      //  Ensure `assigneeUsers` is correctly set before sending the request
      const formattedAssignees =
        updatedTaskData.assigneeUsers?.map((user) => ({
          UserId: user.userId || user.id,
          image: user.image || "",
        })) || [];

      const formattedTaskData = {
        id: taskId,
        name: updatedTaskData.name,
        description: updatedTaskData.description || "",
        startDate: updatedTaskData.startDate,
        dueDate: updatedTaskData.dueDate,
        isCompleted: updatedTaskData.isCompleted,
        subTasks: updatedTaskData.subTasks || [],
        assigneeUsers: formattedAssignees, //  Ensure this is always included
      };

      console.log("Final API Payload:", formattedTaskData.assigneeUsers); // Debugging

      const response = await axios.post(
        "http://localhost:3000/api/tasks/edit",
        {
          id: formattedTaskData.id,
          name: formattedTaskData.name,
          isCompleted: formattedTaskData.isCompleted,
          description: formattedTaskData.description || "",
          startDate: formattedTaskData.startDate,
          dueDate: formattedTaskData.dueDate,
          assigneeUsers: formattedTaskData.assigneeUsers,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);

      if (response.status === 200) {
        toast.success("Task updated successfully!");
      } else {
        console.error("Unexpected API response:", response);
        toast.error("Failed to update task.");
      }
    } catch (err) {
      console.error("Error editing task:", err.response?.data || err.message);
      toast.error("Failed to edit task. Please try again.");
    }
  }

  // Assign task to members
  const assignTaskToMembers = async (taskId, memberIds) => {
    console.log("====================================");
    console.log("assign");
    console.log("====================================");
    try {
      const token = localStorage.getItem("token");
      const task = await fetchTaskById(taskId);

      if (!task) {
        console.error("Task not found.");
        return;
      }
      console.log("====================================");
      console.log(memberIds);
      console.log("====================================");
      const updatedAssignees = memberIds.map((memberId) => {
        const member = members.find((m) => m.id === memberId);
        return {
          userId: member.id,
          fullName: member.fullName,
          image: member?.image?.startsWith("http")
            ? member.image
            : `http://localhost:5017/${member.image}`,
        };
      });

      console.log("Updated Assigned Members:", updatedAssignees); //  Log assigned members before API call

      const updatedTaskData = {
        ...task,
        assigneeUsers: updatedAssignees,
      };

      setSelectedTask(updatedTaskData);

      console.log("Final Task Data After Assigning Members:", updatedTaskData); // Log final task data
    } catch (err) {
      console.error("Error assigning task:", err.response?.data || err.message);
      toast.error("Failed to assign task. Please try again.");
    }
  };

  // Fetch task by ID
  async function fetchTaskById(taskId) {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found. Please login first.");
        return;
      }

      const response = await axios.get(
        `http://localhost:3000/api/tasks/${taskId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return response.data;
    } catch (err) {
      console.error(
        "Error fetching task by ID:",
        err.response?.data || err.message
      );
    }
  }

  // Delete a task
  const handleDeleteTask = async (taskId) => {
    console.log("====================================");
    console.log(taskId);
    console.log("====================================");
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSections((prevSections) =>
        prevSections.map((section) => ({
          ...section,
          tasks: section.tasks.filter((task) => task.id !== taskId),
        }))
      );
      toast.success("Task deleted successfully!");
    } catch (err) {
      console.error("Error deleting task:", err.response?.data || err.message);
      toast.error("Failed to delete task. Please try again.");
    }
  };

  // Handle task click to open modal
  const handleTaskClick = async (taskId) => {
    console.log("====================================");
    console.log("taskcliick");
    console.log("====================================");
    const task = await fetchTaskById(taskId);
    console.log("====================================");
    console.log(task);
    console.log("====================================");
    if (task) {
      console.log("====================================");
      console.log(task.assigneeUsers);
      console.log("====================================");
      const updatedAssignees = task?.assigneeUsers?.slice(1).map((user) => {
        const foundMember = members.find((m) => m.id === user.userId);

        // Check if user.image is a valid string before calling startsWith
        const imageUrl =
          user.image &&
          typeof user.image === "string" &&
          user.image.startsWith("http")
            ? user.image
            : user.image
            ? `http://localhost:5017/${user.image.replace("\\", "/")}` // Handle path and replace slashes
            : person; // Fallback to 'person' image if user.image is null or invalid

        return {
          ...user,
          fullName: foundMember
            ? foundMember.fullName
            : user.fullName || "Unknown User",
          image: imageUrl, // Use the constructed image URL
        };
      });

      setSelectedTask({
        ...task,
        assigneeUsers: updatedAssignees,
        startDate: task.startDate
          ? new Date(task.startDate).toISOString().split("T")[0]
          : "",
        dueDate: task.dueDate
          ? new Date(task.dueDate).toISOString().split("T")[0]
          : "",
      });

      console.log("Updated Assigned Members:", updatedAssignees);
      setTempSelectedMembers(updatedAssignees?.map((m) => m.userId));
      setShowModal(true);
      console.log(showModal);
    }
  };

  // Mark task as completed and move it to the "Done" section
  const markTaskAsCompleted = async (taskId) => {
    try {
      const token = localStorage.getItem("token");

      const doneSection = sections.find((section) => section.name === "Done");
      const currentSection = sections.find((section) =>
        section.tasks.some((task) => task.id === taskId)
      );

      if (!doneSection || !currentSection) {
        alert("No 'Done' section found.");
        return;
      }

      if (currentSection.id === doneSection.id) {
        // If the task is already in the "Done" section, move it back to its original section
        const taskToMove = doneSection.tasks.find((task) => task.id === taskId);
        const originalSectionId = taskToMove.originalSectionId;

        if (!originalSectionId) {
          alert("Original section not found.");
          return;
        }

        // Update the task's section in the database
        await axios.post("http://localhost:3000/api/tasks/move", null, {
          params: {
            TaskId: taskId,
            SectionId: originalSectionId,
          },
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        // Update the task's section in the frontend
        setSections((prevSections) => {
          const updatedSections = prevSections.map((section) => {
            if (section.id === doneSection.id) {
              // Remove the task from the "Done" section
              return {
                ...section,
                tasks: section.tasks.filter((task) => task.id !== taskId),
              };
            }
            if (section.id === originalSectionId) {
              // Add the task to the original section
              return {
                ...section,
                tasks: [...section.tasks, taskToMove],
              };
            }
            return section;
          });

          return updatedSections;
        });

        toast.success("Task moved back to its original section!");
      } else {
        // Move the task to the "Done" section
        const taskToMove = currentSection.tasks.find(
          (task) => task.id === taskId
        );

        // Update the task's section in the database
        await axios.post("http://localhost:3000/api/tasks/move", null, {
          params: {
            TaskId: taskId,
            SectionId: doneSection.id,
          },
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        // Update the task's section in the frontend
        setSections((prevSections) => {
          const updatedSections = prevSections.map((section) => {
            if (section.id === currentSection.id) {
              // Remove the task from the current section
              return {
                ...section,
                tasks: section.tasks.filter((task) => task.id !== taskId),
              };
            }
            if (section.id === doneSection.id) {
              // Add the task to the "Done" section
              return {
                ...section,
                tasks: [
                  ...section.tasks,
                  { ...taskToMove, originalSectionId: currentSection.id },
                ],
              };
            }
            return section;
          });

          return updatedSections;
        });

        toast.success("Task marked as completed and moved to Done!");
      }
    } catch (err) {
      console.error("Error moving task:", err.response?.data || err.message);
      toast.error("Task does not move");
    }
  };

  const updateTaskSection = async (taskId, newSectionId, isTaskCompleted) => {
    try {
      const token = localStorage.getItem("token");

      // Correct API request with query parameters
      const response = await axios.post(
        `http://localhost:3000/api/tasks/move`,
        {
          taskId: taskId,
          newSectionId: newSectionId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("====================================");
      console.log(response);
      console.log("====================================");
      toast.success("Task section updated successfully!");
    } catch (err) {
      console.error(
        "Error updating task section:",
        err.response?.data || err.message
      );
      toast.error("Failed to update task section. Please try again.");
    }
  };

  // Fetch members of the project
  async function fetchMembers() {
    console.log("fetch");
    console.log("====================================");
    console.log(projectId);
    console.log("====================================");
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:3000/api/projects/members/${projectId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMembers(response.data || []);
      console.log(response.data);

      // console.log("Members fetched:", response.data.members);
    } catch (err) {
      console.error(
        "Error fetching members:",
        err.response?.data || err.message
      );
    }
  }

  return (
    <>
      <BoardNav />
      <DragDropContext onDragEnd={onDragEnd}>
        <div className={`${style.boardListContainer} flex-wrap`}>
          <div className={style.boardList}>
            {sections.map((section) => (
              <Droppable key={section.id} droppableId={section.id}>
                {(provided) => (
                  <div
                    className={`${style.boardSection}`}
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    <div className="flex justify-between mb-2">
                      {editingSection === section.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            className={style.inputField_pass}
                            value={updatedSectionName}
                            onChange={(e) =>
                              setUpdatedSectionName(e.target.value)
                            }
                            autoFocus
                          />
                          <button
                            className="text-sm text-[#639eb0] font-semibold"
                            onClick={() => {
                              editSection(section.id, {
                                name: updatedSectionName,
                              });
                              setEditingSection(null);
                            }}
                          >
                            OK
                          </button>
                        </div>
                      ) : (
                        <h2 className="w-[95%]">{section.name}</h2>
                      )}

                      <div className="relative">
                        <button
                          onClick={() => toggleDropdown(section.id)}
                          className="p-2 hover:bg-gray-200 rounded"
                        >
                          <FaEllipsisV className="w-4 h-4 text-gray-700" />
                        </button>
                        {dropdownOpen === section.id && (
                          <div className="absolute right-0 mt-2 w-24 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                            <button
                              className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                              onClick={() => {
                                setEditingSection(section.id);
                                setUpdatedSectionName(section.name);
                                closeDropdown();
                              }}
                            >
                              Edit
                            </button>
                            <button
                              className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                              onClick={() => {
                                handleDeleteSection(section.id);
                                closeDropdown();
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {section.tasks.map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={style.taskCard}
                            onClick={() => handleTaskClick(task.id)}
                          >
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <CheckCircleIcon
                                  className={`w-6 h-6 cursor-pointer ${
                                    section.name.toLowerCase() === "done"
                                      ? "text-[#639eb0]"
                                      : "text-[#87C2D4]/80"
                                  }`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    markTaskAsCompleted(task.id);
                                  }}
                                />
                                <p>{task.name}</p>
                              </div>

                              <div className="flex items-center space-x-2">
                                {task.assigneeUsers &&
                                task.assigneeUsers.length > 0 ? (
                                  <>
                                    {task.assigneeUsers
                                      .slice(0, 3)
                                      .map((member, index) => {
                                        const foundMember = members.find(
                                          (m) => m.id === member.userId
                                        );
                                        const imageUrl =
                                          member.image &&
                                          typeof member.image === "string" &&
                                          member.image.startsWith("http")
                                            ? member.image
                                            : member.image
                                            ? `http://localhost:5017/${member.image.replace(
                                                "\\",
                                                "/"
                                              )}`
                                            : person;

                                        return (
                                          <div
                                            key={member.userId}
                                            className="relative group"
                                          >
                                            <img
                                              src={imageUrl}
                                              alt={member.fullName || "User"}
                                              className="w-6 h-6 rounded-full border-2 border-gray-300 shadow-sm transition-transform duration-200 transform hover:scale-110 -ml-2 first:ml-0"
                                              onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = person;
                                              }}
                                            />
                                            <span className="absolute -top-7 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                              {foundMember
                                                ? foundMember.fullName
                                                : "User"}
                                            </span>
                                          </div>
                                        );
                                      })}
                                    {task.assigneeUsers.length > 3 && (
                                      <div className="w-6 h-6 flex items-center justify-center bg-gray-300 text-gray-700 text-xs font-semibold rounded-full border-2 border-gray-300 shadow-sm">
                                        +{task.assigneeUsers.length - 3}
                                      </div>
                                    )}
                                  </>
                                ) : (
                                  <div className="relative group flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 border-2 border-gray-200 shadow-sm">
                                    <FaUser className="w-3 h-3 text-gray-500" />
                                    <span className="absolute -top-7 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                      No Assigned User
                                    </span>
                                  </div>
                                )}

                                <div className="relative">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleTaskDropdown(task.id);
                                    }}
                                    className="p-2 hover:bg-gray-200 rounded"
                                  >
                                    <FaEllipsisH className="w-3 h-3 text-gray-700" />
                                  </button>

                                  {taskDropdownOpen === task.id && (
                                    <div className="absolute right-0 mt-2 w-24 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                                      <button
                                        className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleTaskClick(task.id);

                                          closeDropdowns();
                                        }}
                                      >
                                        Edit
                                      </button>
                                      <button
                                        className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDeleteTask(task.id);
                                          closeDropdowns();
                                        }}
                                      >
                                        Delete
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}

                    {provided.placeholder}

                    {section.name.toLowerCase() !== "done" &&
                      (showAddTaskInput[section.id] ? (
                        <div className="flex items-center gap-2 mt-2">
                          <input
                            type="text"
                            value={newTasks[section.id] || ""}
                            onChange={(e) =>
                              setNewTasks({
                                ...newTasks,
                                [section.id]: e.target.value,
                              })
                            }
                            placeholder="Enter task name"
                            className={style.inputField_pass}
                            autoFocus
                          />
                          <button
                            className="text-sm text-[#639eb0] font-semibold"
                            onClick={() =>
                              addTask(section.id, newTasks[section.id])
                            }
                          >
                            OK
                          </button>
                        </div>
                      ) : (
                        <button
                          className="mt-2 text-[#639eb0]"
                          onClick={() => {
                            setShowAddTaskInput((prev) => ({
                              ...prev,
                              [section.id]: true,
                            }));
                            setNewTasks((prevTasks) => ({
                              ...prevTasks,
                              [section.id]: "",
                            }));
                          }}
                        >
                          + Add a card
                        </button>
                      ))}
                  </div>
                )}
              </Droppable>
            ))}

            <button
              className={style.addSectionButton}
              onClick={() => setShowAddSectionModal(true)}
            >
              + Add Another Section
            </button>
          </div>
        </div>
      </DragDropContext>

      {/* Add new section Modal */}
      {showAddSectionModal && (
        <div
          id="add-section-modal"
          tabIndex="-1"
          aria-hidden="true"
          className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full bg-black bg-opacity-50"
        >
          <div className="relative p-4 w-full max-w-md max-h-full">
            <div className="relative bg-white rounded-lg shadow-sm">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b rounded-t">
                <h3 className="text-xl font-semibold text-gray-900">
                  Add New Section
                </h3>
                <button
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center"
                  onClick={() => setShowAddSectionModal(false)}
                >
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>

              {/* Body */}
              <div className="p-4 space-y-4">
                <label className="block">
                  <span className="text-gray-700 font-semibold">
                    Section Name:
                  </span>
                  <input
                    type="text"
                    className={`${style.inputField_pass}`}
                    value={newSectionName}
                    onChange={(e) => setNewSectionName(e.target.value)}
                    placeholder="Enter section name"
                    autoFocus
                  />
                </label>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end p-4 border-t border-gray-200 rounded-b">
                <button
                  type="button"
                  className="text-gray-500 bg-gray-200 hover:bg-gray-300 rounded-lg px-4 py-2 mr-2"
                  onClick={() => setShowAddSectionModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className={`${style.save_btn}`}
                  onClick={handleAddSection}
                >
                  Add Section
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Task Modal */}
      {showModal && selectedTask && (
        <div
          id="default-modal"
          tabIndex="-1"
          aria-hidden="true"
          className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full bg-black bg-opacity-50"
        >
          <div className="relative p-4 w-full max-w-2xl max-h-full">
            <div className="relative bg-white rounded-lg shadow-sm">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b rounded-t">
                <h3 className="text-xl font-semibold text-gray-900">
                  Edit Task
                </h3>
                <button
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center"
                  onClick={() => setShowModal(false)}
                >
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>

              {/* Body */}
              <div className="p-4 space-y-4">
                <label className="block">
                  <span className="text-gray-700 font-semibold">
                    Task Name:{" "}
                  </span>
                  <input
                    type="text"
                    className={`${style.inputField_subTask}`}
                    value={selectedTask.name}
                    onChange={(e) =>
                      setSelectedTask({ ...selectedTask, name: e.target.value })
                    }
                  />
                </label>

                <label className="block">
                  <span className="text-gray-700 font-semibold">
                    Description:
                  </span>
                  <textarea
                    className={`${style.inputField_subTask}`}
                    rows="3"
                    value={selectedTask.description || ""} // Ensure it never gets a null value
                    onChange={(e) =>
                      setSelectedTask({
                        ...selectedTask,
                        description: e.target.value,
                      })
                    }
                  />
                </label>

                <label className="block">
                  <span className="text-gray-700 font-semibold">
                    Start Date:
                  </span>
                  <input
                    type="date"
                    className={`${style.inputField_subTask}`}
                    value={selectedTask.startDate || ""}
                    onChange={(e) =>
                      setSelectedTask({
                        ...selectedTask,
                        startDate: e.target.value,
                      })
                    }
                  />
                </label>

                <label className="block">
                  <span className="text-gray-700 font-semibold">Due Date:</span>
                  <input
                    type="date"
                    className={`${style.inputField_subTask}`}
                    value={selectedTask.dueDate || ""}
                    onChange={(e) =>
                      setSelectedTask({
                        ...selectedTask,
                        dueDate: e.target.value,
                      })
                    }
                  />
                </label>

                {/* Display Members */}

                <div className="mt-4 relative">
                  <h4 className="text-lg font-semibold text-gray-900">
                    Available Members:
                  </h4>

                  {/* Button to Open/Close Dropdown */}
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-left flex justify-between items-center"
                  >
                    Select Members
                    <span>{dropdownOpen ? "▲" : "▼"}</span>
                  </button>

                  {/* Dropdown Menu */}
                  {dropdownOpen && (
                    <div className="absolute w-full bg-white border border-gray-300 mt-1 rounded-md shadow-lg max-h-40 overflow-y-auto z-10">
                      {members.map((member) => {
                        const isSelected = tempSelectedMembers?.includes(
                          member.id
                        );
                        return (
                          <div
                            key={member.id}
                            className={`flex items-center gap-3 px-4 py-2 cursor-pointer ${
                              isSelected ? "bg-gray-100" : ""
                            }`}
                            onClick={() => {
                              setTempSelectedMembers((prevSelected = []) =>
                                isSelected
                                  ? prevSelected.filter(
                                      (id) => id !== member.id
                                    )
                                  : [...prevSelected, member.id]
                              );
                            }}
                          >
                            {member.image ? (
                              <img
                                src={member.image}
                                alt={member.fullName}
                                className="w-8 h-8 rounded-full"
                              />
                            ) : (
                              <FaUser className="w-8 h-8 rounded-full text-gray-500" />
                            )}
                            <span className="text-gray-700">
                              {member.fullName}
                            </span>
                            {isSelected && (
                              <FaCheckCircle className="text-[#639eb0] ml-auto w-5 h-5" />
                            )}
                            
                          </div>
                        );
                      })}

                      {/* Assign Button */}
                      <div className="p-2 border-t bg-gray-50 flex justify-end">
                        <button
                          onClick={() => {
                            assignTaskToMembers(
                              selectedTask.id,
                              tempSelectedMembers
                            );
                            setDropdownOpen(false); // Close dropdown
                          }}
                          className="bg-[#639eb0] text-white px-4 py-2 rounded-md hover:bg-[#517f91] transition"
                        >
                          Assign
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Display Assigned Members */}

                <div className="mt-4">
                  <h4 className="text-lg font-semibold text-gray-900">
                    Assigned Members:
                  </h4>

                  {/* Debugging Log: Show Current Assigned Members */}
                  {console.log(
                    "Rendering Assigned Members:",
                    selectedTask.assigneeUsers
                  )}

                  <div className="flex flex-wrap gap-2">
                    {selectedTask.assigneeUsers &&
                    selectedTask.assigneeUsers.length > 0 ? (
                      selectedTask.assigneeUsers.map((member) => {
                        // Debugging logs
                        console.log("Member Image:", member.image);

                        // Only use startsWith if member.image is a valid string and not null
                        const imageUrl =
                          member.image &&
                          typeof member.image === "string" &&
                          member.image.startsWith("http")
                            ? member.image
                            : member.image
                            ? `http://localhost:5017/${member.image.replace(
                                "\\",
                                "/"
                              )}`
                            : person; // Use person as fallback if image is null or invalid

                        console.log("Image URL:", imageUrl); // Log the constructed image URL

                        return (
                          <div
                            key={member.userId}
                            className="flex items-center bg-gray-100 p-2 rounded-lg"
                          >
                            <img
                              src={imageUrl}
                              alt={member.fullName || "User"}
                              className="w-8 h-8 rounded-full mr-2"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = person;
                              }} // Fallback on error
                            />
                            <span>{member.fullName || "Unknown User"}</span>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-gray-500">No members assigned</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end p-4 border-t border-gray-200 rounded-b">
                <button
                  type="button"
                  className="text-gray-500 bg-gray-200 hover:bg-gray-300 rounded-lg px-4 py-2 mr-2"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className={`${style.save_btn}`}
                  onClick={async () => {
                    const formatDate = (date) => {
                      const d = new Date(date);
                      return isNaN(d) ? null : d.toISOString().split("T")[0];
                    };

                    const updatedTask = {
                      ...selectedTask,
                      startDate: formatDate(selectedTask.startDate),
                      dueDate: formatDate(selectedTask.dueDate),
                      assigneeUsers: members?.filter((m) =>
                        tempSelectedMembers?.includes(m.id)
                      ),
                    };

                    await editTask(selectedTask.id, updatedTask);

                    setSections((prevSections) =>
                      prevSections.map((section) => ({
                        ...section,
                        tasks: section.tasks.map((task) =>
                          task.id === selectedTask.id ? updatedTask : task
                        ),
                      }))
                    );

                    setSelectedTask(updatedTask);
                    setShowModal(false);
                  }}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
