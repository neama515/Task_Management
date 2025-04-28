import React ,{useContext , useState , useEffect} from "react";
import styles from "../../CSS/Profile.module.scss";
import profile from "../../Images/profilePic.jpg";
import { Avatar, Dropdown, Navbar } from "flowbite-react";
import { usercontext } from "../../Components/UserContext/UserContext";
import {  Link, useNavigate } from "react-router-dom";
import SideBar from "../SideBar/SideBar";
import axios from "axios";
import profile1 from "../../Images/download.jpg";

export default function Profile_nav() {
   const [obj, setObj] = useState(null);
   const [navobj, setObjnav] = useState(null);
   const[loading,setLoading]= useState(true);
  const { setToken, token } = useContext(usercontext);
  const { user, setUser } = useContext(usercontext);
  const storedImage = localStorage.getItem("profileImage"); 
let navigate=useNavigate()
  function logout() {
    localStorage.removeItem("token")
    localStorage.removeItem("name")
    localStorage.removeItem("proj1")
    localStorage.removeItem("proj2")
    localStorage.removeItem("email")
    localStorage.removeItem("user")
    localStorage.clear();
    setToken(null)
    setUser(null)
    navigate("/signin")
  }
  async function profileInfo() {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:3000/api/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setToken(token);
      setObjnav(res.data);
      setObj(res.data);
      localStorage.setItem("profileImage", res.data.image || profile1); 

    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false); 
    }
  }

  useEffect(() => {
    const storedToken = localStorage.getItem("token"); 
    if (!token && storedToken) {
      setToken(storedToken);
    }
    if (!storedToken) {
      console.warn("No token found, not fetching profile.");
      return;
    }
    profileInfo();
  }, [token]);
   
  
  return (
    <div>
      <nav
        className={`flex py-1 items-center justify-between ${styles.profile_nav} `}
      >
        <div className="flex justify-between items-center">
          
          <SideBar proj={obj} />
          {location.pathname == "/projects" ? (
            <span className="flex self-center justify-self-end whitespace-nowrap text-2xl font-semibold dark:text-white">
              Projects
            </span>
          ) : (
            <span className="flex self-center justify-self-end whitespace-nowrap text-2xl font-semibold dark:text-white"></span>
          )}
          {location.pathname == "/profile" ? (
            <span className="flex self-center justify-self-end whitespace-nowrap text-2xl font-semibold dark:text-white">
              Profile
            </span>
          ) : (
            <span className="flex self-center justify-self-end whitespace-nowrap text-2xl font-semibold dark:text-white"></span>
          )}
          {location.pathname == "/ProfileEdit" ? (
            <span className="flex self-center justify-self-end whitespace-nowrap text-2xl font-semibold dark:text-white">
              Profile Edit
            </span>
          ) : (
            <span className="flex self-center justify-self-end whitespace-nowrap text-2xl font-semibold dark:text-white"></span>
          )}
          {location.pathname == "/tasks" ? (
            <span className="flex self-center justify-self-end whitespace-nowrap text-2xl font-semibold dark:text-white">
              Tasks
            </span>
          ) : (
            <span className="flex self-center justify-self-end whitespace-nowrap text-2xl font-semibold dark:text-white"></span>
          )}
          
        </div>
      
        <div className=" md:order-2 flex justify-between px-2 drop ">
        <img
  src={obj?.image ? obj.image.replace(/\\/g, "/") : storedImage || profile1}
  alt="Profile Pic"
  onError={(e) => (e.target.src = profile1)} 
  className="rounded-full object-cover w-10 h-10 place-self-center"
/>

              <Dropdown arrowIcon={true} inline className="px-2">
                <Dropdown.Item className="rounded-sm justify-center">
                  <Link to="/profile">Profile</Link>
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item className="rounded-sm" onClick={logout}>
                  Sign out
                </Dropdown.Item>
              </Dropdown>
        </div>
      </nav>
    </div>
  );
}
