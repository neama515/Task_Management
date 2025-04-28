import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export let usercontext = createContext();

export default function UserContext({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);

  useEffect(() => {
    async function fetchUserProfile() {
      if (token) {
        try {
          const response = await axios.get("http://localhost:3000/api/users/profile", {
            headers: { Authorization: `Bearer ${token}` },
          });

          // console.log(" User Profile API Response:", response.data);

          if (!response.data.id) {
            console.error(" API response is missing user ID!");
          }
          const updatedUser = {
            ...response.data,
            id: response.data.id, 
          };

          setUser(updatedUser);
          localStorage.setItem("user", JSON.stringify(updatedUser));

        } catch (err) {
          console.error(" Error fetching user profile:", err.response?.data || err);
          setUser(null);
          localStorage.removeItem("user");
        }
      }
    }

    fetchUserProfile();
  }, [token]);

  return (
    <usercontext.Provider value={{ token, setToken, user, setUser }}>
      {children}
    </usercontext.Provider>
  );
}
