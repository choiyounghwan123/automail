import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Header({ isLoggedIn, setIsLoggedIn }) {
    const [isClicked, setIsClicked] = useState(false);
    const navigate = useNavigate();

    // 로그아웃 함수
    const handleLogout = async () => {
        const token = localStorage.getItem("accessToken");

        if (!token) {
            console.error("Access token이 없습니다.");
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            setIsLoggedIn(false);
            navigate("/");
            return;
        }

        try {
            await axios.post(
                "http://localhost:8080/api/auth/logout",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
        } catch (error) {
            console.error("로그아웃 실패:", error);
        } finally {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            setIsLoggedIn(false);
            navigate("/");
        }
    };

    // Axios 인터셉터 설정
    useEffect(() => {
        const interceptor = axios.interceptors.response.use(
            (response) => response,
            (error) => {

                    // JWT 만료 시 로그아웃 처리
                    handleLogout();
                return Promise.reject(error);
            }
        );

        // 컴포넌트 언마운트 시 인터셉터 제거
        return () => {
            axios.interceptors.response.eject(interceptor);
        };
    }, [isLoggedIn]); // isLoggedIn이 변경될 때마다 재설정

    return (
        <header className="fixed top-0 left-0 w-full z-50 bg-white shadow-md border-b border-gray-200">
            <div className="max-w-screen-xl mx-auto px-6 py-4 flex items-center justify-between">
                <a
                    href="/"
                    onMouseDown={() => setIsClicked(true)}
                    onMouseUp={() => setIsClicked(false)}
                    className={`
                        text-2xl font-bold 
                        ${isClicked ? "text-blue-300" : "text-gray-700"} 
                        hover:text-blue-400 
                        active:text-blue-300 
                        transition-all duration-300 ease-in-out
                    `}
                >
                    의생명융합공학부 공지사항
                </a>

                <nav className="hidden md:flex items-center space-x-6">
                    <a href="/notice" className="text-gray-600 hover:text-blue-400 transition-colors duration-300">
                        공지사항
                    </a>
                    <a href="/subscription" className="text-gray-600 hover:text-blue-400 transition-colors duration-300">
                        구독하기
                    </a>
                    {isLoggedIn ? (
                        <>
                            <a href="/mypage" className="text-gray-600 hover:text-blue-400 transition-colors duration-300">
                                마이페이지
                            </a>
                            <button
                                onClick={handleLogout}
                                className="text-gray-600 hover:text-blue-400 transition-colors duration-300"
                            >
                                로그아웃
                            </button>
                        </>
                    ) : (
                        <>
                            <a href="/login" className="text-gray-600 hover:text-blue-400 transition-colors duration-300">
                                로그인
                            </a>
                            <a href="/register" className="text-gray-600 hover:text-blue-400 transition-colors duration-300">
                                회원가입
                            </a>
                        </>
                    )}
                </nav>

                <div className="md:hidden flex items-center">
                    <button className="text-gray-800 hover:text-blue-400">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-6 h-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </header>
    );
}

export default Header;