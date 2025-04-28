import React, { useEffect, useContext } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import style from "../../CSS/ProfileEdit/ProfileEdit.module.scss";
import { toast } from "react-toastify";
import { usercontext } from "../../Components/UserContext/UserContext";
import Profile_nav from "../../Components/Profile_nav/Profile_nav";
import { useLocation, useNavigate } from "react-router-dom";

export default function ProfileEdit() {
  const navigate = useNavigate();
  let { setToken } = useContext(usercontext);
  let token = localStorage.getItem("token");
  const location = useLocation();

  function saveChangesHandle(values) {
    const formData = new FormData();
    
    formData.append("fullName", values.fullName);
    formData.append("jobRole", values.jobRole);
    formData.append("gender", values.gender);
    formData.append("birthDate", values.birthDate);
    formData.append("phoneNumber", values.phoneNumber);
    formData.append("aboutMe", values.aboutMe);
    
    if (values.image instanceof File) {
      formData.append("image", values.image);
    }
    
    if (values.password) {
      formData.append("password", values.password);
      formData.append("confirmPassword", values.confirmPassword);
    }

    axios.put(`http://localhost:3000/api/users/editProfile`, formData, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    })
    .then((res) => {
      navigate("/profile");
      setToken(token);
      toast.success("Profile updated successfully!");
    })
    .catch((err) => {
      if (err.response) {
        toast.error(`Error: ${err.response.data.message || 'Something went wrong'}`);
      } else {
        toast.error("Server connection error");
      }
    });
  }

  const validationSchema = Yup.object({
    fullName: Yup.string().required("Full Name is required"),
    jobRole: Yup.string().required("Job Role is required"),
    gender: Yup.string()
  .oneOf(["male", "female", "other"], "Invalid gender selection")
  .required("Gender is required"),
  birthDate: Yup.date()
    .required("Birth Date is required")
    .typeError("Invalid Birth Date format (YYYY-MM-DD)"),
  phoneNumber: Yup.string()
    .matches(/^01[1250][0-9]{8}$/, "Phone number must be a valid Egyptian number")
    .nullable()
    .required("Phone Number is required"),
  aboutMe: Yup.string()
    .max(500, "About Me must be less than 500 characters")
    .nullable()
    .required("About Me is required"),
    password: Yup.string()
    .nullable()
    .test(
      "password-strength",
      "Password must be 8-15 characters, with at least one uppercase, one lowercase, one digit, and one special character",
      (value) => !value || /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,15}$/.test(value)
    ),
  
    confirmPassword: Yup.string()
    .nullable()
    .oneOf([Yup.ref("password"), null], "Passwords do not match"),
  
    image: Yup.mixed()
      .nullable()
      .test(
        "fileType",
        "Only image files are allowed",
        (value) =>
          !value || (value && ["image/jpeg", "image/png"].includes(value.type))
      ),
  

  });
  let formik = useFormik({
    initialValues: {
      fullName: "",
      jobRole: "",
      gender: "",
      birthDate: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      aboutMe: "",
      image: "",
    },
    validationSchema,
    onSubmit: saveChangesHandle,
  });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      formik.setFieldValue("image", file);
    }
  };

  const handleCancel = () => {
    formik.resetForm();
  };

  useEffect(() => {
    axios.get(`http://localhost:3000/api/users/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => {
      const profileData = res.data;
      formik.setValues({
        fullName: profileData.fullName || "",
        jobRole: profileData.jobRole || "",
        gender: profileData.gender ?? 0,
        birthDate: profileData.birthDate || "",
        phoneNumber: profileData.phoneNumber || "",
        aboutMe: profileData.aboutMe || "",
        image: profileData.image || "",
      });
    })
    .catch((err) => {
      console.error("Error fetching profile:", err);
    });
  }, []);

  return (
    <>
      <Profile_nav location={location} />
      <div className="container mx-auto px-10 py-5">
        <div className="flex flex-row mb-5 justify-between items-center sm:px-4 md:px-0">
          <div className="flex flex-col items-center mt-5">
            <input
              type="file"
              onChange={handleImageUpload}
              id="imageUpload"
              hidden
            />
            {formik.values.image && typeof formik.values.image === "string" ? (
              <img
                src={formik.values.image}
                alt="Profile"
                className={`${style.profileImg} bg-gray-100`}
              />
            ) : formik.values.image instanceof File ? (
              <img
                src={URL.createObjectURL(formik.values.image)}
                alt="Profile"
                className={`${style.profileImg} bg-gray-100`}
              />
            ) : null}
            <label
              htmlFor="imageUpload"
              className="text-black underline cursor-pointer hover:text-[#639eb0] my-3"
            >
              Upload your photo
            </label>
          </div>
        </div>

        <div className="">
          <div className="">
            <form onSubmit={formik.handleSubmit}>
              <div>
                <span className="px-5 pt-2 font-bold text-center mb-3">
                  Personal information:
                </span>

                <div className="flex md:gap-10 mx-auto justify-center">
                  <div className="flex md:gap-10 mx-auto justify-center mb-1">
                    <div className="mb-1">
                      <label htmlFor="fullName" className={`${style.label}`}>
                        FullName
                      </label>
                      <input
                        onChange={formik.handleChange}
                        value={formik.values.fullName}
                        onBlur={formik.handleBlur}
                        type="text"
                        id="fullName"
                        name="fullName"
                        className={`${style.inputField_long}`}
                        placeholder="Enter your FullName"
                      />
                      {formik.touched.fullName && formik.errors.fullName && (
                        <div
                          className="flex items-center p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 my-2"
                          role="alert"
                        >
                          <svg
                            className="shrink-0 inline w-4 h-4 me-3"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                          </svg>
                          <span className="sr-only">Info</span>
                          <div>
                            <span className="font-medium">
                              {formik.errors.fullName}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex sm:flex-col md:flex-row md:gap-10 mx-auto justify-center items-center">
                  <div className="">
                    <label htmlFor="jobRole" className={`${style.label}`}>
                      Job Title
                    </label>
                    <input
                      onChange={formik.handleChange}
                      value={formik.values.jobRole}
                      onBlur={formik.handleBlur}
                      type="text"
                      id="jobRole"
                      name="jobRole"
                      className={`${style.inputField_pass}`}
                      placeholder="Enter your JobRole"
                    />
                    {formik.touched.jobRole && formik.errors.jobRole && (
                      <div
                        className="flex items-center p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 my-2"
                        role="alert"
                      >
                        <svg
                          className="shrink-0 inline w-4 h-4 me-3"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                        </svg>
                        <span className="sr-only">Info</span>
                        <div>
                          <span className="font-medium">
                            {formik.errors.jobRole}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="">
                    <label htmlFor="gender" className={`${style.label}`}>
                      Gender
                    </label>
                    <select
  onChange={formik.handleChange}
  value={formik.values.gender}
  onBlur={formik.handleBlur}
  id="gender"
  name="gender"
  className={`${style.selectField_sign1}`}
>
  <option value="">Select Gender</option>
  <option value="male">Male</option>
  <option value="female">Female</option>
  <option value="other">Other</option>
</select>
                    {formik.touched.gender && formik.errors.gender && (
                      <div
                        className="flex items-center p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 my-2"
                        role="alert"
                      >
                        <svg
                          className="shrink-0 inline w-4 h-4 me-3"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                        </svg>
                        <span className="sr-only">Info</span>
                        <div>
                          <span className="font-medium">
                            {formik.errors.gender}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-10 mx-auto justify-center mb-1">
                  <div className="mb-1">
                    <label htmlFor="birthDate" className={`${style.label}`}>
                      BirthDate
                    </label>
                    <input
                      onChange={formik.handleChange}
                      value={formik.values.birthDate}
                      onBlur={formik.handleBlur}
                      type="date"
                      id="birthDate"
                      name="birthDate"
                      className={`${style.inputField_long}`}
                      placeholder="Enter your BirthDate"
                    />
                    {formik.touched.birthDate && formik.errors.birthDate && (
                      <div
                        className="flex items-center p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 my-2"
                        role="alert"
                      >
                        <svg
                          className="shrink-0 inline w-4 h-4 me-3"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                        </svg>
                        <span className="sr-only">Info</span>
                        <div>
                          <span className="font-medium">
                            {formik.errors.birthDate}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-10 mx-auto justify-center mb-1">
                  <div className="mb-1">
                    <label htmlFor="phoneNumber" className={`${style.label}`}>
                      PhoneNumber
                    </label>
                    <input
                      onChange={formik.handleChange}
                      value={formik.values.phoneNumber}
                      onBlur={formik.handleBlur}
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      className={`${style.inputField_long}`}
                      placeholder="Enter your PhoneNumber"
                    />
                    {formik.touched.phoneNumber &&
                      formik.errors.phoneNumber && (
                        <div
                          className="flex items-center p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 my-2"
                          role="alert"
                        >
                          <svg
                            className="shrink-0 inline w-4 h-4 me-3"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                          </svg>
                          <span className="sr-only">Info</span>
                          <div>
                            <span className="font-medium">
                              {formik.errors.phoneNumber}
                            </span>
                          </div>
                        </div>
                      )}
                  </div>
                </div>
                <div className="flex sm:flex-col md:flex-row md:gap-10 mx-auto justify-center items-center">
                  <div className="mb-1">
                    <label htmlFor="password" className={`${style.label}`}>
                      Change Password
                    </label>
                    <input
                      onChange={formik.handleChange}
                      value={formik.values.password}
                      onBlur={formik.handleBlur}
                      autoComplete="off"
                      type="password"
                      name="password"
                      id="password"
                      className="inputField_pass"
                      placeholder="Enter your password"
                    />
                    {formik.touched.password && formik.errors.password && (
                      <div
                        className="flex items-center p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 my-2"
                        role="alert"
                      >
                        <svg
                          className="shrink-0 inline w-4 h-4 me-3"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                        </svg>
                        <span className="sr-only">Info</span>
                        <div>
                          <span className="font-medium">
                            {formik.errors.password}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="mb-1">
                    <label
                      htmlFor="confirmPassword"
                      className={`${style.label}`}
                    >
                      Confirm Password
                    </label>
                    <input
                      onChange={formik.handleChange}
                      value={formik.values.confirmPassword}
                      onBlur={formik.handleBlur}
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      className="inputField_pass"
                      placeholder="repeat your password"
                    />
                    {formik.touched.confirmPassword &&
                      formik.errors.confirmPassword && (
                        <div
                          className="flex items-center p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 my-2"
                          role="alert"
                        >
                          <svg
                            className="shrink-0 inline w-4 h-4 me-3"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                          </svg>
                          <span className="sr-only">Info</span>
                          <div>
                            <span className="font-medium">
                              {formik.errors.confirmPassword}
                            </span>
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              </div>
              <div>
                <span className="px-5 pt-2 font-bold text-center mb-3">
                  About Me:
                </span>
                <div className="flex gap-10 mx-auto justify-center mb-1">
                  <div className="mb-1">
                    <label htmlFor="aboutMe" className={`${style.label}`}>
                      Tell us about yourself
                    </label>
                    <textarea
                      onChange={formik.handleChange}
                      value={formik.values.aboutMe}
                      onBlur={formik.handleBlur}
                      id="aboutMe"
                      name="aboutMe"
                      rows="5"
                      className={`${style.inputField_long}`}
                    ></textarea>
                    {formik.touched.aboutMe && formik.errors.aboutMe && (
                      <div
                        className="flex items-center p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 my-2"
                        role="alert"
                      >
                        <svg
                          className="shrink-0 inline w-4 h-4 me-3"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                        </svg>
                        <span className="sr-only">Info</span>
                        <div>
                          <span className="font-medium">
                            {formik.errors.aboutMe}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="my-10 flex justify-center items-center sm:flex-col md:flex-row">
                <button
                  type="button"
                  onClick={handleCancel}
                  className={`${style.edit_btn} sm:mt-4 md:me-4`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`${style.edit_btn} sm:mt-4 `}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}