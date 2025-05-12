import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';

import Header from './components/Header';
import Footer from './components/Footer';
import Login from './pages/Login';
import Register from './pages/Register';
import MyPage from './pages/MyPage';
import NotFound from './pages/NotFound';
import HomePage from "./pages/HomePage";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";
import Subscription from "./pages/Subscription";

import "./index.css";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(null);
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            axios.get(`${process.env.REACT_APP_API_URL}/api/users/me`, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(response => {
                    console.log(response.data);
                    setIsLoggedIn(true);
                    setIsEmailVerified(response.data.isActive);
                })
                .catch((error) => {
                    console.error("Token validation error:", error);
                    setIsLoggedIn(false);
                    setIsEmailVerified(false);
                    localStorage.removeItem("accessToken");
                    localStorage.removeItem("refreshToken");
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            setIsLoggedIn(false);
            setIsEmailVerified(false);
            setLoading(false);
        }
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>로딩 중...</p>
            </div>
        );
    }

    return (
        <Router>
            <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
            <main>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                        path="/mypage"
                        element={
                            isLoggedIn && isEmailVerified ? (
                                <MyPage />
                            ) : isLoggedIn ? (
                                <Navigate to="/verify-email" replace />
                            ) : (
                                <Navigate to="/login" replace />
                            )
                        }
                    />
                    <Route
                        path="/subscription"
                        element={
                            isLoggedIn && isEmailVerified ? (
                                <Subscription />
                            ) : isLoggedIn ? (
                                <Navigate to="/verify-email" replace />
                            ) : (
                                <Navigate to="/login" replace />
                            )
                        }
                    />
                    <Route path="/verify-email" element={<VerifyEmail />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </main>
            <Footer />
        </Router>
    );
}

export default App;