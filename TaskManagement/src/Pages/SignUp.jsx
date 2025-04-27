"use client";
import styles from "../CSS/Authenticate/SignPages.module.scss";
import React, { useState, useContext } from "react";
import { FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa"; // Import eye icons
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import axios from "axios";
import * as Yup from "yup";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { usercontext } from "../Components/UserContext/UserContext";
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";


export default function SignUp() {
  let { setToken } = useContext(usercontext);

  // State to toggle password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorApi, setErrorApi] = useState(null);
  let navigate = useNavigate();

  async function handleRegister(values) {
    setIsLoading(true);
    console.log("====================================");
    console.log(values);
    console.log("====================================");
    try {
      let { data } = await axios.post(`http://localhost:3000/api/auth/signup`, {
        fullName: values.fullname,
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
      });
      console.log("API Response:", data); // Log the response
      setToken(data.token);
      localStorage.setItem("token", data.token);
      navigate("/profile");
      const fullName = res.data.fullName;
      localStorage.setItem("name", fullName);
    } catch (error) {
      console.error("API Error:", error.response?.data); // Log error response
      setErrorApi(JSON.stringify(error.response?.data) || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }

  let validationSchema = Yup.object().shape({
    fullname: Yup.string()
      .min(3, "Name must be at least 5 characters")
      .max(50, "Name cannot exceed 50 characters")
      .required("Name is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,15}$/,
        "Password must be between 8 and 15 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character."
      )
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Confirm password is required"),
  });

  const formikRegister = useFormik({
    initialValues: {
      fullname: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: handleRegister,
  });

  const handleGoogleSignUp = async (response) => {
    try {
      const idToken = response.credential; // Google ID Token
      console.log("Received Google Token:", idToken); // ✅ Log token

      const requestBody = { idToken }; // ✅ Correct request body
      console.log("Sending Request Body:", requestBody); // ✅ Log request body

      const { data } = await axios.post(
        "http://localhost:5017/api/Account/google-login",
        requestBody,
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("Backend Response:", data);

      localStorage.setItem("token", data.token);
      // localStorage.setItem("name", data.fullName);
      navigate("/addinfo");
    } catch (error) {
      console.error("Google Sign-Up Error:", error.response?.data || error);
    }
  };

  return (
    <>
      <div className={styles.sign_up_container}>
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-lg">
          <h2
            className={`text-2xl font-bold text-black text-center ${styles.primary_text_sign}`}
          >
            Become a member!
          </h2>
          <p
            className={`text-gray-500 text-center mt-1 font-medium ${styles.secondary_text_sign}`}
          >
            Enter your details below to create your account
          </p>

          {/* Google Login Button */}
          <div className="flex justify-center mt-4">
            <div className="scale-125">
              {" "}
              {/* ✅ Scales the button 25% bigger */}
              <GoogleLogin
                text="signup_with"
                onSuccess={handleGoogleSignUp}
                onError={() => console.log("Google Sign-In Failed")}
                size="Medium" // ✅ Largest available size
                shape="pill" // ✅ Fully rounded
                theme="outline" // ✅ Forces a clean style
              />
            </div>
          </div>

          {/* Divider */}
          <div className="relative flex items-center  justify-center">
            <div className={styles.orLight}>━━━━━━━ or ━━━━━━━</div>
          </div>

          {errorApi ? (
            <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50">
              {errorApi}
            </div>
          ) : null}
          {/* Input Fields */}
          <form onSubmit={formikRegister.handleSubmit} className="space-y-4 ">
            {/* Full Name */}
            <div>
              <label htmlFor="fullname" className={styles.label}>
                Full Name
              </label>
              <input
                name="fullname"
                id="fullname"
                type="text"
                placeholder="Enter your name"
                className="inputField_pass  "
                required
                onChange={formikRegister.handleChange}
                value={formikRegister.values.fullname}
                onBlur={formikRegister.handleBlur}
              />
            </div>
            {formikRegister.errors.fullname &&
              formikRegister.touched.fullname && (
                <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50">
                  {formikRegister.errors.fullname}
                </div>
              )}

            {/* Email */}
            <div>
              <label htmlFor="email" className={styles.label}>
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="m@example.com"
                className={styles.inputField_pass}
                required
                onChange={formikRegister.handleChange}
                onBlur={formikRegister.handleBlur}
                value={formikRegister.values.email}
              />
            </div>
            {formikRegister.errors.email && formikRegister.touched.email && (
              <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50">
                {formikRegister.errors.email}
              </div>
            )}

            {/* Password */}
            <div className="relative">
              <label htmlFor="password" className={styles.label}>
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"} // Toggle password visibility
                name="password"
                id="password"
                placeholder="Enter your password"
                className="inputField_pass pr-10" // Add padding-right to avoid overlap with icon
                required
                onChange={formikRegister.handleChange}
                value={formikRegister.values.password}
                onBlur={formikRegister.handleBlur}
              />
              {/* Eye Icon */}
              <span
                className="absolute top-10 right-4 cursor-pointer text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </span>
            </div>
            {formikRegister.errors.password &&
              formikRegister.touched.password && (
                <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50">
                  {formikRegister.errors.password}
                </div>
              )}

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className={styles.label}>
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                placeholder="Enter your password again"
                className={styles.inputField_pass}
                required
                onChange={formikRegister.handleChange}
                value={formikRegister.values.confirmPassword}
                onBlur={formikRegister.handleBlur}
              />
            </div>
            {formikRegister.errors.confirmPassword &&
              formikRegister.touched.confirmPassword && (
                <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50">
                  {formikRegister.errors.confirmPassword}
                </div>
              )}

            {/* Submit Button with Spinner */}
            <button
              type="submit"
              disabled={!formikRegister.isValid || !formikRegister.dirty}
              className={`${styles.sign_btn} flex items-center justify-center`}
            >
              {isLoading ? (
                <FaSpinner className="animate-spin" size={20} />
              ) : (
                "Create account"
              )}
            </button>

            <p
              className={`text-gray-600 text-center mt-4 font-medium ${styles.helper_txt_sign}`}
            >
              By signing up, I agree to our{" "}
              <Link to="/privacy-policy" className="underline">
                Privacy Policy
              </Link>{" "}
              &{" "}
              <Link to="/terms-of-service" className="underline ">
                Terms of Service
              </Link>
              .
            </p>
          </form>
        </div>
      </div>
    </>
  );
}
