import React, { useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import PasswordInput from '../../components/Input/PasswordInput';
import { Link, useNavigate } from 'react-router-dom';
import { validateEmail } from '../../utils/helper';
import axiosInstances from '../../utils/axiosinstance';
import Toast from '../../components/ToastMessage/Toast';

function Signup() {
  const [username, setUsername] = useState("");
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [showToastMessage, setToastMessage] = useState({
    isShow: false,
    message: "",
    type: "add"
  });
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!username.trim()) {
      setError("Username shouldn't be empty");
      return;
    }
    if (!fullname.trim()) {
      setError("Name shouldn't be empty");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email");
      return;
    }
    if (!password.trim()) {
      setError("Password shouldn't be empty");
      return;
    }

    setError("");
    setToastMessage({
      isShow: false,
      message: "",
      type: "add"
    });

    try {
      const response = await axiosInstances.post("/register", {
        fullName: fullname,
        password: password,
        username: username,
        email: email
      });

      if (response.status === 201) {
        setToastMessage({
          isShow: true,
          message: "Registration successful! Redirecting to login page...",
          type: "add"
        });

        setTimeout(() => {
          setToastMessage({
            isShow: false,
            message: "",
            type: "add"
          });
          navigate('/login');
        }, 500);
      } else {
        setError("Registration failed, please try again!");
      }
    } catch (error) {
      console.error('Error object:', error);

      if (error.response) {
        const responseData = error.response.data;
        if (responseData.message) {
          setError(responseData.message);
        } else if (responseData.errors && responseData.errors.length > 0) {
          setError(responseData.errors.join(', '));
        } else {
          setError("An unexpected error occurred");
        }
      } else if (error.request) {
        setError("No response received from server. Please try again.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  const handleCloseToast = () => {
    setToastMessage({
      isShow: false,
      message: "",
      type: "add"
    });
  };

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center mt-28">
        <div className="w-96 border rounded bg-white px-7 py-10">
          <form onSubmit={handleSignup}>
            <h4 className="text-center text-2xl mb-7">Sign Up</h4>
            <input
              type="text"
              placeholder="Full Name"
              className="input-box"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
            />
            <input
              type="text"
              placeholder="Username"
              className="input-box"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              className="input-box"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <PasswordInput
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p className="text-red-500 text-xs pb-1 text-center">{error}</p>}
            <button type="submit" className="btn-primary">
              Sign Up
            </button>
            <p className="text-sm text-center mt-4">
              Already registered?{' '}
              <Link to="/login" className="font-medium text-primary underline hover:text-blue-600">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
      <Toast
        isShow={showToastMessage.isShow}
        message={showToastMessage.message}
        type={showToastMessage.type}
        onClose={handleCloseToast}
      />
    </>
  );
}

export default Signup;
