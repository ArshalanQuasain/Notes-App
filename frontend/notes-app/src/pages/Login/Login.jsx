import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import PasswordInput from '../../components/Input/PasswordInput';
import axiosInstances from '../../utils/axiosinstance';

function Login() {
    const [emailOrUsername, setEmailOrUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!emailOrUsername.trim()) {
            setError("Please enter a valid email or username");
            return;
        }
        if (!password.trim()) {
            setError("Please enter the password");
            return;
        }

        setError("");

        try {
            const response = await axiosInstances.post("/login", {
                emailorusername: emailOrUsername,
                password: password,
            });

            if (response.data && response.data.data && response.data.data.accessToken) {
                localStorage.setItem("accessToken", response.data.data.accessToken);
                navigate('/');
            } 
        }  catch (error) {
            if (error.response) {
                const responseData = error.response.data;
        
                if (responseData.message) {
                    setError(responseData.message);
                } else if (responseData.errors && responseData.errors.length > 0) {
                    setError(responseData.errors.join(', '));
                } else {
                    setError("An unexpected error occurred");
                }
            } else {
                setError("An unexpected error occurred");
            }
        } 
    };

    return (
        <>
            <Navbar />
            <div className="flex items-center justify-center mt-28">
                <div className="w-96 border rounded bg-white px-7 py-10">
                    <form onSubmit={handleLogin}>
                        <h4 className="text-center text-2xl mb-7">Login</h4>
                        <input
                            type="text"
                            placeholder="Email or Username"
                            className="input-box"
                            value={emailOrUsername}
                            onChange={(e) => setEmailOrUsername(e.target.value)}
                        />
                        <PasswordInput
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {error && <p className="text-red-500 text-xs pb-1 text-center">{error}</p>}
                        <button type="submit" className="btn-primary">
                            Login
                        </button>
                        <p className="text-sm text-center mt-4">
                            Don't have an account?{' '}
                            <Link to="/signup" className="font-medium text-primary underline hover:text-blue-600">
                                Create an Account
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Login;
