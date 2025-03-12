import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';
import Login from './pages/Login';
import Register from './pages/Register';
import MyPage from './pages/MyPage';
import NotFound from './pages/NotFound';
import HomePage from "./pages/HomePage";
import ResetPassword from "./pages/ResetPassword";

import "./index.css";
import Subscription from "./pages/Subscription"; // 기존 CSS 파일 유지

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(null); // 초기값 null로 설정
    const [loading, setLoading] = useState(true); // 로딩 상태 추가

    // 로그인 상태 초기화
    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            // 필요한 경우, 토큰 유효성을 확인하는 API 요청 추가
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
        setLoading(false);
    }, []);

    if (loading) {
        // 로딩 중일 때 CSS와 스타일을 유지한 로딩 화면 표시
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
                        element={isLoggedIn ? <MyPage /> : <Navigate to="/login" replace />}
                    />
                    <Route path="/subscription" element={isLoggedIn ? <Subscription /> : <Navigate to="/login" replace/>} /> {/* 구독 페이지 라우트 */}

                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </main>
            <Footer />
        </Router>
    );
}

export default App;