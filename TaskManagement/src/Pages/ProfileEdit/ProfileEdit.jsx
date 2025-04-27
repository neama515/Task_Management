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

  function saveChangesHandle(formValues) {
    console.log(formValues.values);
    console.log("hellllllllllllllllll");
    console.log('====================================');
    const formData = new FormData();

    formData.append("fullName", formValues.FullName);
    formData.append("jobRole", formValues.JobRole);
    formData.append("gender", formValues.Gender);
    formData.append("birthDate", formValues.BirthDate);
    formData.append("phoneNumber", formValues.PhoneNumber);
    formData.append("aboutMe", formValues.AboutMe);
    if (formValues.Image instanceof File) {
      formData.append("image", formValues.Image);
    }
    console.log("Final FormData to API:", formData.fullName);
    if (formValues.Password) {
      formData.append("password", formValues.Password);
      formData.append("confirmPassword", formValues.ConfirmPassword);
    }

    axios
      .put(`http://localhost:3000/api/users/editProfile`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log(res.data);
        navigate("/profile");
        setToken(token);
        toast.success("Profile updated successfully!");
      })
      .catch((err) => {
        if (err.response) {
          console.error("Response Data:", err.response.data);
          toast.error(`Error: ${JSON.stringify(err.response.data.errors)}`);
        }
      });
  }

  const validationSchema = Yup.object({
    FullName: Yup.string().required("Full Name is required"),

    JobRole: Yup.string().required("Job Role is required"),

    Gender: Yup.number()
      .oneOf([0, 1], "Invalid gender selection") // 0 = Male, 1 = Female
      .required("Gender is required"),

    BirthDate: Yup.date()
      .required("Birth Date is required")
      .typeError("Invalid Birth Date format (YYYY-MM-DD)"),

    PhoneNumber: Yup.string()
      .matches(
        /^01[1250][0-9]{8}$/,
        "Phone number must be a valid Egyptian number"
      )
      .nullable(),

    AboutMe: Yup.string()
      .max(500, "About Me must be less than 500 characters")
      .nullable(),

    Country: Yup.string().required("Country is required"),

    City: Yup.string().required("City is required"),

    Language: Yup.string().nullable(),

    linkedIn: Yup.string().url("Invalid Linkedin URL").nullable(),

    Github: Yup.string().url("Invalid Github URL").nullable(),

    Protofilo: Yup.string().url("Invalid Protofilo URL").nullable(),

    Password: Yup.string()
      .nullable()
      .test(
        "password-strength",
        "Password must be 8-15 characters, with at least one uppercase letter, one lowercase letter, one digit, and one special character.",
        (value) =>
          !value ||
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,15}$/.test(value)
      ),

    ConfirmPassword: Yup.string()
      .nullable()
      .oneOf([Yup.ref("Password"), null], "Passwords do not match"),

    Image: Yup.mixed()
      .nullable()
      .test(
        "fileType",
        "Only image files are allowed",
        (value) =>
          !value || (value && ["image/jpeg", "image/png"].includes(value.type))
      ),

    CVFile: Yup.mixed()
      .nullable()
      .test(
        "fileType",
        "Only PDF files are allowed",
        (value) => !value || (value && value.type === "application/pdf")
      ),

    Experiences: Yup.array().of(
      Yup.object({
        experienceName: Yup.string(),
        experienceTitle: Yup.string(),
        ExperiencestartDate: Yup.date().when(
          ["experienceName", "experienceTitle"],
          {
            is: (name, title) => !!name || !!title,
            then: (schema) => schema.required("Start date is required"),
          }
        ),
        experienceEndDate: Yup.date()
          .min(
            Yup.ref("ExperiencestartDate"),
            "End date must be after start date"
          )
          .when(["experienceName", "experienceTitle"], {
            is: (name, title) => !!name || !!title,
            then: (schema) => schema.required("End date is required"),
          }),
      })
    ),

    Skills: Yup.array()
      .of(Yup.string())
      .min(1, "At least one skill is required"),
  });

  let formik = useFormik({
    initialValues: {
      FullName: "",
      JobRole: "",
      Gender: "",
      BirthDate: "",
      PhoneNumber: "",
      Password: "",
      ConfirmPassword: "",
      AboutMe: "",
      Image: "",
    },
    validationSchema,
    onSubmit: saveChangesHandle,
  });



  // handle profile img
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      formik.setFieldValue("Image", file);
    }
  };

  // handle cancel button
  const handleCancel = () => {
    formik.resetForm();
  };

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const profileData = res.data;
        console.log(res.data);

        formik.setValues({
          FullName: profileData.fullName || "",
          JobRole: profileData.jobRole || "",
          Gender: profileData.gender ?? 0,
          BirthDate: profileData.birthDate || "",
          PhoneNumber: profileData.phoneNumber || "",
          AboutMe: profileData.aboutMe || "",
         
       
          Image: profileData.image || "",
          CVFile: null,
       
        });
      })
      .catch((err) => {
        console.log(err);

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
              id="ImageUpload"
              hidden
            />
            {formik.values.Image && typeof formik.values.Image === "string" ? (
              <img
                src={formik.values.Image}
                alt="Profile"
                className={`${style.profileImg} bg-gray-100`}
              />
            ) : formik.values.Image instanceof File ? (
              <img
                src={URL.createObjectURL(formik.values.Image)}
                alt="Profile"
                className={`${style.profileImg} bg-gray-100`}
              />
            ) : null}
            <label
              htmlFor="ImageUpload"
              className="text-black underline cursor-pointer hover:text-[#639eb0] my-3"
            >
              Upload your photo{" "}
            </label>
          </div>
        </div>

        <div className="">
          <div className="">
            <form onSubmit={formik.handleSubmit}>
              <div>
                <span className="px-5 pt-2 font-bold text-center mb-3">
                  Personal information:{" "}
                </span>

                <div className="flex md:gap-10 mx-auto justify-center">
                  <div className="flex md:gap-10 mx-auto justify-center mb-1">
                    <div className="mb-1">
                      <label htmlFor="FullName" className={`${style.label}`}>
                        FullName
                      </label>
                      <input
                        onChange={formik.handleChange}
                        value={formik.values.FullName}
                        onBlur={formik.handleBlur}
                        type="text"
                        id="FullName"
                        name="FullName"
                        className={`${style.inputField_long}`}
                        placeholder="Enter your FullName"
                      />
                      {formik.touched.FullName && formik.errors.FullName && (
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
                              {formik.errors.FullName}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex sm:flex-col md:flex-row md:gap-10 mx-auto justify-center items-center">
                  <div className="">
                    <label htmlFor="JobRole" className={`${style.label}`}>
                      Job Title
                    </label>
                    <input
                      onChange={formik.handleChange}
                      value={formik.values.JobRole}
                      onBlur={formik.handleBlur}
                      type="text"
                      id="JobRole"
                      name="JobRole"
                      className={`${style.inputField_pass}`}
                      placeholder="Enter your JobRole"
                    />
                    {formik.touched.JobRole && formik.errors.JobRole && (
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
                            {formik.errors.JobRole}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="">
                    <label htmlFor="Gender" className={`${style.label}`}>
                      Gender
                    </label>
                    <select
                      onChange={(e) =>
                        formik.setFieldValue("Gender", Number(e.target.value))
                      }
                      value={formik.values.Gender}
                      onBlur={formik.handleBlur}
                      id="Gender"
                      name="Gender"
                      className={`${style.selectField_sign1}`}
                    >
                      <option value="">Select Gender</option>
                      <option value="0">Male</option>
                      <option value="1">Female</option>
                    </select>
                    {formik.touched.Gender && formik.errors.Gender && (
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
                            {formik.errors.Gender}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-10 mx-auto justify-center mb-1">
                  <div className="mb-1">
                    <label htmlFor="BirthDate" className={`${style.label}`}>
                      BirthDate
                    </label>
                    <input
                      onChange={formik.handleChange}
                      value={formik.values.BirthDate}
                      onBlur={formik.handleBlur}
                      type="date"
                      id="BirthDate"
                      name="BirthDate"
                      className={`${style.inputField_long}`}
                      placeholder="Enter your BirthDate"
                    />
                    {formik.touched.BirthDate && formik.errors.BirthDate && (
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
                            {formik.errors.BirthDate}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-10 mx-auto justify-center mb-1">
                  <div className="mb-1">
                    <label htmlFor="PhoneNumber" className={`${style.label}`}>
                      PhoneNumber
                    </label>
                    <input
                      onChange={formik.handleChange}
                      value={formik.values.PhoneNumber}
                      onBlur={formik.handleBlur}
                      type="tel"
                      id="PhoneNumber"
                      name="PhoneNumber"
                      className={`${style.inputField_long}`}
                      placeholder="Enter your PhoneNumber"
                    />
                    {formik.touched.PhoneNumber &&
                      formik.errors.PhoneNumber && (
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
                              {formik.errors.PhoneNumber}
                            </span>
                          </div>
                        </div>
                      )}
                  </div>
                </div>
                <div className="flex sm:flex-col md:flex-row md:gap-10 mx-auto justify-center items-center">
                  <div className="mb-1">
                    <label htmlFor="Password" className={`${style.label}`}>
                      Change Password
                    </label>
                    <input
                      onChange={formik.handleChange}
                      value={formik.values.Password}
                      onBlur={formik.handleBlur}
                      autoComplete="off"
                      type="password"
                      name="Password"
                      id="Password"
                      className="inputField_pass"
                      placeholder="Enter your password"
                    />
                    {formik.touched.Password && formik.errors.Password && (
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
                            {formik.errors.Password}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="mb-1">
                    <label
                      htmlFor="ConfirmPassword"
                      className={`${style.label}`}
                    >
                      Confirm Password
                    </label>
                    <input
                      onChange={formik.handleChange}
                      value={formik.values.ConfirmPassword}
                      onBlur={formik.handleBlur}
                      type="password"
                      id="ConfirmPassword"
                      name="ConfirmPassword"
                      className="inputField_pass"
                      placeholder="repeat your password"
                    />
                    {formik.touched.ConfirmPassword &&
                      formik.errors.ConfirmPassword && (
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
                              {formik.errors.ConfirmPassword}
                            </span>
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              </div>
              <div>
                <span className="px-5 pt-2 font-bold text-center mb-3">
                  About Me:{" "}
                </span>
                <div className="flex gap-10 mx-auto justify-center mb-1">
                  <div className="mb-1">
                    <label htmlFor="AboutMe" className={`${style.label}`}>
                      Tell us about yourself
                    </label>
                    <textarea
                      onChange={formik.handleChange}
                      value={formik.values.AboutMe}
                      onBlur={formik.handleBlur}
                      id="AboutMe"
                      name="AboutMe"
                      rows="5"
                      className={`${style.inputField_long}`}
                    ></textarea>
                    {formik.touched.AboutMe && formik.errors.AboutMe && (
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
                            {formik.errors.AboutMe}
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
                  onClick={() => saveChangesHandle(formik)}
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
