import React, { useContext, useEffect, useState } from "react";
import Profile_nav from "../../Components/Profile_nav/Profile_nav";
import axios from "axios";
import { usercontext } from "../../Components/UserContext/UserContext";

export default function MyTasks() {
  const [obj, setObj] = useState("");

  let { setToken } = useContext(usercontext);
  let token = localStorage.getItem("token");
  async function getTasks() {
    axios
      .get(
        `http://localhost:5017/api/Home/GetAllTasksUser
?sort=asc
`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        if (token) setToken(token);

        const sortedProjects = res.data.sort((a, b) => a.id - b.id);

        setObj(sortedProjects);
        console.log("====================================");
        console.log(res.data);
        console.log("====================================");
      })
      .catch((res) => {
        console.log(res);
      });
  }
  useEffect(() => {
    getTasks();
  }, []);
  return (
    <>
      <Profile_nav />
      <div className="text-center p-2">
        <ul>
          {obj?.length > 0 ? (
            obj?.map((ob, index) => (
              <li className="w-[80%] mx-auto mt-4 flex justify-between h-auto shadow-[#93cee0] shadow-sm border rounded-full px-2 py-2 border-[#93cee0]">
                <div className="flex font-bold items-center">
                  <div className="bg-[#93cee0] mx-1  rounded-full w-8 h-8">
                    {index + 1}
                  </div>{" "}
                  {ob?.name}
                </div>
                <div>
                  {ob?.projectName} ({ob.type})
                </div>
                <div>{ob?.dueDate}</div>
              </li>
            ))
          ) : (
            <span className="text-center w-full col-span-3 font-semibold">
              There is no Tasks
            </span>
          )}
        </ul>
      </div>
    </>
  );
}
