import React, { useState, useEffect } from "react";
import axios from "axios";

function Subscription() {
    const [email, setEmail] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchEmail = async () => {
            try {
                const token = localStorage.getItem("accessToken");
                const response = await axios.get("http://localhost:8080/api/users/email", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setEmail(response.data.data.email);
            } catch (err) {
                console.error("이메일 정보를 불러오지 못했습니다.", err);
            }
        };
        fetchEmail();
    }, []);

    const handleSubscribe = async () => {
        setLoading(true);
        setErrorMessage("");
        try {
            const token = localStorage.getItem("accessToken");
            await axios.post(
                "http://localhost:8080/api/subscriptions",
                {},
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setSuccessMessage("구독 설정이 완료되었습니다!");
        } catch (err) {
            console.error("구독 요청 실패:", err);
            setErrorMessage("구독 요청에 실패했습니다. 네트워크 상태를 확인하세요.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-blue-100 p-6">
            <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8 transform transition-all hover:scale-105 duration-300">
                <h1 className="text-3xl font-bold text-center text-indigo-600 mb-6 tracking-tight">
                    이메일 구독
                </h1>

                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <p className="text-gray-600 text-sm text-center">
                        공지사항을 받아볼 이메일
                    </p>
                    <p className="text-center font-medium text-gray-800 mt-2 truncate">
                        {email || (
                            <span className="italic text-gray-400">불러오는 중...</span>
                        )}
                    </p>
                </div>

                <button
                    onClick={handleSubscribe}
                    disabled={loading}
                    className={`w-full py-3 px-6 rounded-lg font-semibold text-white text-lg shadow-md transition-all duration-300 ${
                        loading
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg"
                    }`}
                >
                    {loading ? (
                        <span className="flex items-center justify-center">
                            <svg
                                className="animate-spin h-5 w-5 mr-2 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v8H4z"
                                />
                            </svg>
                            설정 중...
                        </span>
                    ) : (
                        "구독 신청"
                    )}
                </button>

                {successMessage && (
                    <div className="mt-6 p-4 bg-green-100 border-l-4 border-green-500 text-green-700 rounded-r-lg animate-fade-in">
                        {successMessage}
                    </div>
                )}
                {errorMessage && (
                    <div className="mt-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-r-lg animate-fade-in">
                        {errorMessage}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Subscription;