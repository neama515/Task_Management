import React, { useState } from 'react';
import axios from 'axios';
import style from "../../CSS/PasswordHandle/ForgetPassword.module.scss";
import { useNavigate } from 'react-router-dom';

export default function VerifyCode() {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const email = localStorage.getItem('email');

    const data = {
        code: code, 
        email: email, 
      };
      console.log('Data being sent to API:', data);

    try {
      const response = await axios.post('http://localhost:5017/api/Account/VerifyCode', data)
      setMessage(response.data.message);
      setError('');
      navigate('/ResetPassword');

    } catch (err) {
      setError('Error!!!');
      setMessage('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={`${style.forget_password_container}`}>
        <div className={`${style.forget_password_box}`}>
          <div className={`${style.key_icon_container} mt-2 mb-4`}>
            <i className="fa-solid fa-envelope text-2xl text-[#2f5966]"></i>            
          </div>
          <h2 className='font-bold mb-2 text-2xl'>Verify Code</h2>
          <p className='text-sm mb-5 text-gray-500 text-center'>Please enter the verification code sent to your email.</p>
          <form onSubmit={handleSubmit}>
            <div className={`${style.form_group}`}>
              <label htmlFor="code" className={`${style.label}`}>Verification Code</label>
              <input
                type="text"
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                className={`${style.inputField_pass}`}
                placeholder='Enter Verification Code'
              />
            </div>
            <button
              type="submit"
              className={`${style.send_button} mb-1`}
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <i className="fa-solid fa-spinner animate-spin"></i>
                </div>
              ) : ('Verify')}
            </button>
          </form>
          {message && <p className='mt-2'>{message}</p>}
          {error && <p className='text-red-600 mt-1'>{error}</p>}
          <a href="/SignIn" className="text-center text-sm text-gray-500">
            <i className="fa-solid fa-arrow-left"></i> Back to log in
          </a>
        </div>
      </div>
    </>
  );
}