import React, { useContext, useEffect } from "react";
import profile from "../Images/download.jpg";
import { Button } from "flowbite-react";
import { Card } from "flowbite-react";
import styles from "../CSS/Profile.module.scss";
import { Modal, Select } from "flowbite-react";
import { useState } from "react";
import axios from "axios";
import Profile_nav from "../Components/Profile_nav/Profile_nav";
import { usercontext } from "../Components/UserContext/UserContext";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaStar, FaRegStar } from "react-icons/fa";

export default function ProfilePage() {
  const navigate = useNavigate();
  let { setToken } = useContext(usercontext);
  const { id } = useParams();
  const { user } = useContext(usercontext) || {};
  const location = useLocation();
  const name = localStorage.getItem("name");
  const [obj, setObj] = useState("");
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const [Pdf, setPdf] = useState(null);
  const [Pdf1, setPdf1] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openModal1, setOpenModal1] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [openReviewsModal, setOpenReviewsModal] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [error, setError] = useState(null);
  const [openFeedbackModal, setOpenFeedbackModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [profileId, setprofileId] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      if (!token) {
        console.error("No token found.");
        return;
      }
      setLoading(true);
      try {
        const endpoint = id
          ? `http://localhost:3000/api/users/profile`
          : `http://localhost:3000/api/users/profile`;

        const response = await axios.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const fullName = response.data.fullName;
        localStorage.setItem("name", fullName);
        console.log("API Response:", response.data);
        setProfileData(response.data);
        setprofileId(response.data.id);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
      setLoading(false);
    }

    fetchProfile();
  }, [id, token]);

  useEffect(() => {
    if (openReviewsModal && profileId) {
      fetchReviews();
    }
  }, [openReviewsModal, token, profileId]);

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-screen w-full">
          <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <>
          <ToastContainer />
          <Profile_nav location={location} />
          <section className="grid lg:grid-cols-4 sm:grid-cols-1">
            <div className="lg:col-span-1  p-2 sm:col-span-1 ">
              {profileData?.image ? (
                <img
                  src={profileData.image}
                  alt="profilePic"
                  className="rounded-full object-cover w-60 h-60 place-self-center"
                />
              ) : (
                <img
                  src={profile}
                  alt="profilePic"
                  className="rounded-full object-cover w-60 h-60 place-self-center"
                />
              )}
              <div className="flex flex-col items-center ">
                <div className="flex gap-2">
                  <p> {profileData?.fullName}</p>
                  <div className="flex justify-center">
                    {profileData?.averageRating && (
                      <div className="flex items-center gap-1">
                        <span className="">
                          <FaStar className="text-yellow-400 text-sm" />
                        </span>
                        <span className="text-gray-600 text-sm">
                          {profileData.averageRating.toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                {profileData?.jobRole ? (
                  <span>{profileData.jobRole}</span>
                ) : (
                  <a href="/ProfileEdit">
                    {" "}
                    <i className="fa-solid fa-plus"></i> Add your job role
                  </a>
                )}
              </div>

              <div className="flex gap-2 justify-center items-center">
                <Link
                  onClick={() => setOpenReviewsModal(true)}
                  className="place-self-center my-3 text-sm hover:text-[#639eb0] transition-all"
                >
                  View Reviews
                </Link>

                <Link
                  onClick={() => setOpenFeedbackModal(true)}
                  className="place-self-center my-3 text-sm hover:text-[#639eb0] transition-all"
                >
                  Give Feedback
                </Link>
              </div>

              <div className="flex gap-2 justify-center">
                {user?.id &&
                  profileData?.id &&
                  user.id.toString() === profileData.id.toString() && (
                    <p
                      className={`place-self-center text-sm ${styles.connections}`}
                      onClick={() => navigate("/connections")}
                    >
                      {profileData?.connections
                        ? `${profileData.connections} Connections`
                        : "No Connections"}
                    </p>
                  )}

                <Button
                  pill
                  className={`place-self-center ${styles.profile_Button}`}
                >
                  <Link to="/ProfileEdit">Edit Profile</Link>
                </Button>
              </div>

              <Card className=" mt-2 h-60  grid grid-cols-1  content-start ">
                <div className=" flex  justify-between ">
                  <h5
                    className={`text-xl font-bold leading-none text-gray-900 dark:text-white ${styles.profile_h5}`}
                  >
                    Skills
                  </h5>
                  <Link
                    onClick={() => setOpenModal(true)}
                    to="#"
                    className={`text-sm font-medium  hover:underline dark:text-cyan-500 ${styles.profile_a}`}
                  >
                    View all
                  </Link>
                  <Modal show={openModal} onClose={() => setOpenModal(false)}>
                    <Modal.Header>Skills</Modal.Header>
                    <Modal.Body>
                      <div className="flow-root overflow-hidden">
                        <ul
                          className={`grid ${
                            profileData?.skills?.length > 0
                              ? "grid-cols-6"
                              : "grid-cols-1"
                          } place-content-center place-items-center divide-gray-200 dark:divide-gray-700 overflow-hidden`}
                        >
                          {profileData?.skills?.length > 0 ? (
                            profileData?.skills?.map((skill, index) => (
                              <li className="  col-span-1">
                                <p className="truncate text-sm px-4 py-2 font-medium text-gray-900 dark:text-white w-fit p-2 rounded-full bg-[#93cee0]">
                                  {skill.name}
                                </p>
                              </li>
                            ))
                          ) : (
                            <Link
                              to="/ProfileEdit"
                              className="flex items-center"
                            >
                              <i className="fa-solid fa-plus flex self-center"></i>{" "}
                              Add your skills
                            </Link>
                          )}
                        </ul>
                      </div>
                    </Modal.Body>
                  </Modal>
                </div>
                <div className=" overflow-hidden h-full ">
                  <ul
                    className={`grid ${
                      profileData?.skills?.length > 0
                        ? "grid-cols-3"
                        : "grid-cols-1"
                    } place-content-center place-items-center divide-gray-200 dark:divide-gray-700 overflow-hidden`}
                  >
                    {profileData?.skills?.length > 0 ? (
                      profileData?.skills?.map((skill, index) => (
                        <li className="  col-span-1">
                          <p className="truncate text-sm px-4 py-2 font-medium text-gray-900 dark:text-white w-fit p-2 rounded-full bg-[#93cee0]">
                            {skill.name}
                          </p>
                        </li>
                      ))
                    ) : (
                      <a href="/ProfileEdit" className="flex items-center">
                        <i className="fa-solid fa-plus flex self-center"></i>{" "}
                        Add your skills
                      </a>
                    )}
                  </ul>
                </div>
              </Card>
            </div>
            <div className="lg:col-span-2 lg:px-4 p-2 sm:col-span-1">
              <Card className=" lg:mt-4 h-72  grid grid-cols-1  content-start ">
                <div className=" self-start ">
                  <h5
                    className={`h-10 text-xl font-bold leading-none text-gray-900 dark:text-white ${styles.profile_h5}`}
                  >
                    About me
                  </h5>
                </div>
                <div className="overflow-hidden">
                  {profileData?.aboutMe ? (
                    <p>{profileData.aboutMe}</p>
                  ) : (
                    <a href="/ProfileEdit">
                      <i className="fa-solid fa-plus"></i> Add Information about
                      you
                    </a>
                  )}
                </div>
              </Card>
              <div className="lg:px-10 ">
                <Card className="lg:mt-9 mt-2  grid grid-cols-1  content-start h-[17rem]">
                  <div className="lg:mb-4 flex  justify-between">
                    <h5
                      className={`text-xl font-bold leading-none text-gray-900 dark:text-white ${styles.profile_h5}`}
                    >
                      Experience
                    </h5>
                    <a
                      onClick={() => setOpenModal1(true)}
                      href="#"
                      className={`text-sm font-medium  hover:underline dark:text-cyan-500 ${styles.profile_a}`}
                    >
                      View all
                    </a>
                    <Modal
                      show={openModal1}
                      onClose={() => setOpenModal1(false)}
                    >
                      <Modal.Header>Experience</Modal.Header>
                      <Modal.Body>
                        <div className="space-y-6">
                          <ul
                            className={`grid    ${
                              profileData?.experiences?.length > 0
                                ? "grid-cols-4"
                                : "grid-cols-1"
                            }`}
                          >
                            {profileData?.experiences?.length > 0 ? (
                              profileData?.experiences?.map(
                                (experience, index) => (
                                  <li className="py-1 sm:py-4 mx-1">
                                    <Card href="#" className="max-w-sm">
                                      <div className="flex items-center space-x-4">
                                        <div className="min-w-0 flex-1">
                                          <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                                            {experience.name}
                                          </p>
                                          <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                                            {experience.startDate}
                                          </p>
                                          <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                                            {experience.endDate}
                                          </p>
                                          <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                                            {experience.title}
                                          </p>
                                        </div>
                                      </div>
                                    </Card>
                                  </li>
                                )
                              )
                            ) : (
                              <a
                                href="/ProfileEdit"
                                className="flex items-center"
                              >
                                <i className="fa-solid fa-plus flex self-center"></i>{" "}
                                Add your experiences
                              </a>
                            )}
                          </ul>
                        </div>
                      </Modal.Body>
                    </Modal>
                  </div>
                  <div className="overflow-hidden h-full">
                    <ul
                      className={`grid    ${
                        profileData?.experiences?.length > 0
                          ? "grid-cols-4"
                          : "grid-cols-1"
                      }`}
                    >
                      {profileData?.experiences?.length > 0 ? (
                        profileData?.experiences?.map((experience, index) => (
                          <li className="p-0 m-1">
                            <Card href="#" className="max-w-sm">
                              <div className="flex items-center space-x-4">
                                <div className="min-w-0 flex-1">
                                  <p className="truncate text-sm w-fit font-medium text-gray-900 dark:text-white">
                                    {experience.name}
                                  </p>
                                  <p className="truncate text-sm w-fit text-gray-500 dark:text-gray-400">
                                    {experience.startDate}
                                  </p>
                                  <p className="truncate text-sm w-fit text-gray-500 dark:text-gray-400">
                                    {experience.endDate}
                                  </p>
                                  <p className="truncate w-fit text-sm text-gray-500 dark:text-gray-400">
                                    {experience.title}
                                  </p>
                                </div>
                              </div>
                            </Card>
                          </li>
                        ))
                      ) : (
                        <a href="/ProfileEdit" className="flex items-center">
                          <i className="fa-solid fa-plus flex self-center"></i>{" "}
                          Add your experiences
                        </a>
                      )}
                    </ul>
                  </div>
                </Card>
              </div>
            </div>
            <div className="lg:col-span-1 lg:px-4 px-2 sm:col-span-1">
              <Card className="lg:mt-3 sm:mt-2 justify-start h-64 py-5">
                <h5
                  className={`text-xl font-bold leading-none text-gray-900 dark:text-white ${styles.profile_h5}`}
                >
                  Personal Information
                </h5>

                <ul>
                  <li className="py-2  flex items-center">
                    <i
                      className={`fa-brands fa-google pr-2 ${styles.profile_li_i}`}
                    ></i>
                    <div className="flex items-center space-x-4">
                      <div className="min-w-0 flex-1 flex justify-center items-center">
                        {profileData?.email ? (
                          <p>{profileData.email}</p>
                        ) : (
                          <a href="/ProfileEdit" className="flex items-center">
                            <i className="fa-solid fa-plus flex self-center"></i>{" "}
                            Add your email
                          </a>
                        )}
                      </div>
                    </div>
                  </li>
                  <li className="py-2  flex items-center">
                    <i
                      className={`fa-regular fa-calendar-days pr-2 ${styles.profile_li_i}`}
                    ></i>{" "}
                    <div className="flex items-center space-x-4">
                      {profileData?.birthDate ? (
                        <p>{profileData.birthDate}</p>
                      ) : (
                        <a href="/ProfileEdit" className="flex items-center">
                          <i className="fa-solid fa-plus flex self-center"></i>{" "}
                          Add your Birthdate
                        </a>
                      )}
                    </div>
                  </li>
                  <li className="py-2  flex  items-center">
                    <i
                      className={`fa-solid fa-phone pr-[5px] ${styles.profile_li_i}`}
                    ></i>{" "}
                    <div className="flex items-center space-x-4">
                      <div className="min-w-0 flex-1">
                        {profileData?.phoneNumber ? (
                          <p>{profileData.phoneNumber}</p>
                        ) : (
                          <a href="/ProfileEdit" className="flex items-center">
                            <i className="fa-solid fa-plus flex self-center"></i>{" "}
                            Add your phone Number
                          </a>
                        )}{" "}
                      </div>
                    </div>
                  </li>
                  <li className="py-2  flex   items-center">
                    <i
                      className={`fa-solid fa-location-dot pr-[9px] ${styles.profile_li_i}`}
                    ></i>{" "}
                    <div className="flex items-center space-x-4">
                      <div className="min-w-0 flex-1">
                        {profileData?.country || profileData?.city ? (
                          <p>{profileData.country + "-" + profileData.city}</p>
                        ) : (
                          <a href="/ProfileEdit" className="flex items-center">
                            <i className="fa-solid fa-plus flex self-center"></i>{" "}
                            Add your location
                          </a>
                        )}{" "}
                      </div>
                    </div>
                  </li>
                </ul>
              </Card>
              <Card className=" mt-4 justify-start h-44">
                <div className="mb-4 flex items-center justify-between">
                  <h5
                    className={`text-xl font-bold leading-none text-gray-900 dark:text-white ${styles.profile_h5}`}
                  >
                    Links
                  </h5>
                </div>
                <ul className="overflow-hidden">
                  {" "}
                  <li className="py-2  flex items-center">
                    <i
                      className={`fa-brands fa-linkedin pr-2 ${styles.profile_li_i_linked}`}
                    ></i>{" "}
                    <div className="flex items-center space-x-4">
                      <div className="min-w-0 flex-1">
                        {profileData?.linkedIn ? (
                          <a href={profileData.linkedIn}>
                            {profileData.firstName}
                          </a>
                        ) : (
                          <a href="/ProfileEdit" className="flex items-center">
                            <i className="fa-solid fa-plus flex self-center"></i>{" "}
                            Add your LinkedIn
                          </a>
                        )}{" "}
                      </div>
                    </div>
                  </li>
                  <li className="py-2  flex items-center">
                    <i
                      className={`fa-brands fa-square-github pr-2  ${styles.profile_li_i_git}`}
                    ></i>{" "}
                    <div className="flex items-center space-x-4">
                      <div className="min-w-0 flex-1">
                        {profileData?.github ? (
                          <a href={profileData.github}>
                            {profileData.firstName}
                          </a>
                        ) : (
                          <a href="/ProfileEdit" className="flex items-center">
                            <i className="fa-solid fa-plus flex self-center"></i>{" "}
                            Add your Github
                          </a>
                        )}{" "}
                      </div>
                    </div>
                  </li>
                </ul>
              </Card>
              <Card className=" mt-4 justify-start h-36 mb-2">
                <div className="mb-4 flex items-center justify-between">
                  <h5
                    className={`text-xl font-bold leading-none text-gray-900 dark:text-white ${styles.profile_h5}`}
                  >
                    Resume
                  </h5>
                </div>
                <ul className="overflow-hidden">
                  {" "}
                  <li className="py-2  flex">
                    <i
                      className={`fa-regular fa-eye pr-2 ${styles.profile_li_i}`}
                    ></i>{" "}
                    <div className="flex items-center space-x-4">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                          <a href={Pdf} target="_blank" download>
                            {" "}
                            Preview & Download
                          </a>
                        </p>
                      </div>
                    </div>
                  </li>
                </ul>
              </Card>
            </div>
            <div></div>
          </section>
        </>
      )}
    </>
  );
}
