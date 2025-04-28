import React from "react";
import styles from "../CSS/Authenticate/SignPages.module.scss";
import {
  FaFacebook,
  FaFacebookF,
  FaGoogle,
  FaLinkedin,
  FaLinkedinIn,
} from "react-icons/fa"; // Import Google icon
import { Link } from "react-router-dom";
import * as Yup from "yup";
import { useState, useContext } from "react";
import logo from "../Images/search.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useFormik } from "formik";
import { usercontext } from "../Components/UserContext/UserContext";



export default function SignIn() {
  let { setToken } = useContext(usercontext);
  let navigate = useNavigate();
  const [errorApi, setErrorApi] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  async function login(values) {
    setIsLoading(true);
    let { data } = await axios
      .post(`http://localhost:3000/api/auth/login`, {
        email: values.email,
        password: values.password,
      })
      .then((res) => {
        // const fullName = res.data.fullName;
        // localStorage.setItem("name", fullName);
        console.log("====================================");
        console.log(res.data);
        console.log("====================================");
        setToken(res.data.token);
         localStorage.setItem("token", res.data.token);
        navigate("/profile");
        setIsLoading(false);
      })
      .catch((res) => {
        console.log(res);
        setErrorApi(err.response.data.message);

        setIsLoading(false);
      });
    console.log(data);
  }
 

  let validation = Yup.object().shape({
    email: Yup.string().email("Email is invalid").required(),
    password: Yup.string()
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,15}$/,
        "Password must be between 8 and 15 characters and contain at least one uppercase letter, one lowercase letter, one digit and one special character."
      )
      .required(),
  });

  let formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: login,
    validationSchema: validation,
  });

  return (
    <>
      <div className={styles.sign_in_container}>
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-lg">
          <h2
            className={`text-2xl font-bold text-black text-center ${styles.primary_text_sign}`}
          >
            Welcome Back
          </h2>
          <p
            className={`text-gray-500 text-center mt-1 font-medium ${styles.secondary_text_sign}`}
          >
            Sign In To Your Account
          </p>
          {/* Input Fields */}
          <form className="space-y-4" onSubmit={formik.handleSubmit}>
            {/* Email */}
            <div>
              <label htmlFor="email" className={styles.label}>
                Email
              </label>
              <input
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.email}
                type="email"
                name="email"
                id="email"
                placeholder="m@example.com"
                className={styles.inputField_pass}
                required
              />
              {formik.errors.email && formik.touched.email ? (
                <div
                  className={`p-2 my-2 lg:w-[24.5rem] text-sm text-red-800 rounded-lg bg-red-50`}
                >
                  {formik.errors.email}
                </div>
              ) : null}
            </div>

            {/* Password */}
            <div className="relative">
              <label htmlFor="password" className={styles.label}>
                Password
              </label>
              <input
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.password}
                type="password"
                name="password"
                id="password"
                placeholder="Enter your password"
                className="inputField_pass"
                required
              />
              {formik.errors.password && formik.touched.password ? (
                <div className="p-2 my-2 lg:w-[24.5rem] text-sm text-red-800 rounded-lg bg-red-50">
                  {formik.errors.password}
                </div>
              ) : null}
            </div>

            {/* Submit Button */}
            <button
              disabled={!formik.isValid || !formik.dirty}
              type="submit"
              className={styles.sign_btn}
            >
              {isLoading ? <i className="fas fa-spin fa-spinner"></i> : "Login"}
            </button>
            <div className="text-center flex flex-col">
              <a href="/signup" className="underline text-gray-600">
                Register
              </a>
            </div>
          </form>

      
         

          <p
            className={`text-gray-600  text-center mt-4 font-medium ${styles.helper_txt_sign}`}
          >
            <Link to="/privacy-policy" className="underline ">
              Terms of Use
            </Link>{" "}
            |{" "}
            <Link to="/terms-of-service" className="underline ">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </>
  );
}
