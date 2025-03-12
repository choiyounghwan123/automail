import React, { useState } from "react";
import axios from "axios";

function ResetPassword() {
    const [email, setEmail] = useState(""); // 이메일 상태
    const [message, setMessage] = useState(""); // 성공 메시지
    const [error, setError] = useState(""); // 오류 메시지
    const [loading, setLoading] = useState(false); // 로딩 상태
    const [success, setSuccess] = useState(false); // 팝업 상태

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        try {
            setLoading(true);

            const response = await axios.post("http://localhost:8080/api/reset-password", {
                email,
            });

            if (response.status === 200) {
                setSuccess(true);
                setMessage("비밀번호 재설정 링크가 이메일로 전송되었습니다.");
            }
        } catch (err) {
            setError(err.response?.data?.message || "오류가 발생했습니다. 다시 시도해주세요.");
        } finally {
            setLoading(false);
        }
    };

    const closePopup = () => {
        setSuccess(false);
        setEmail("");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
                {/* 제목 */}
                <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
                    비밀번호 찾기
                </h1>

                {/* 설명 */}
                <p className="text-gray-600 text-center mb-4">
                    이메일 주소를 입력하면 비밀번호 재설정 링크를 보내드립니다.
                </p>

                {/* 비밀번호 찾기 폼 */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* 이메일 입력 */}
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            이메일
                        </label>
                        <input
                            type="email"
                            id="email"
                            placeholder="이메일을 입력하세요"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="
                w-full px-4 py-2 rounded-md border border-gray-300
                focus:outline-none focus:ring-2 focus:ring-blue-400
                focus:border-transparent transition-all
              "
                            required
                        />
                    </div>

                    {/* 오류 메시지 */}
                    {error && (
                        <p className="text-red-500 text-sm mt-1">{error}</p>
                    )}

                    {/* 성공 메시지 */}
                    {message && (
                        <p className="text-green-500 text-sm mt-1">{message}</p>
                    )}

                    {/* 비밀번호 재설정 버튼 */}
                    <button
                        type="submit"
                        className="
              w-full py-2 rounded-md bg-blue-500 text-white
              hover:bg-blue-600 transition-colors
              font-medium text-lg
            "
                        disabled={loading}
                    >
                        {loading ? "전송 중..." : "비밀번호 재설정 링크 보내기"}
                    </button>
                </form>

                {/* 로그인 페이지로 이동 */}
                <div className="mt-6 text-center">
                    <a href="/login" className="text-blue-500 hover:underline">
                        로그인 페이지로 이동
                    </a>
                </div>
            </div>

            {/* 성공 팝업 */}
            {success && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
                    <div
                        className="
              bg-white p-6 rounded-lg shadow-xl text-center max-w-md
              animate-bounce-in
            "
                    >
                        {/* 동그라미 + 체크 아이콘 */}
                        <div className="relative flex justify-center mb-4">
                            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center animate-pulse-circle">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-12 h-12 text-green-500 animate-bounce-in"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </div>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">
                            전송 완료!
                        </h2>
                        <p className="text-gray-600 mb-4">
                            입력한 이메일로 비밀번호 재설정 링크가 전송되었습니다.
                        </p>
                        <button
                            onClick={closePopup}
                            className="
                bg-blue-500 text-white px-4 py-2 rounded-md
                hover:bg-blue-600 transition-colors
              "
                        >
                            확인
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ResetPassword;