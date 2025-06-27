import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login({ setIsLoggedIn }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showResendButton, setShowResendButton] = useState(false);
    const navigate = useNavigate();
    const BASE_URL = process.env.REACT_APP_API_URL;

    const handleResendVerification = async () => {
        try {
            setLoading(true);
            await axios.post(`${BASE_URL}/api/users/verify/resend`, { email });
            setError("인증 메일이 재발송되었습니다. 이메일을 확인해주세요.");
            setShowResendButton(false);
        } catch (err) {
            setError("인증 메일 재발송에 실패했습니다. 다시 시도해주세요.");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setShowResendButton(false);

        if (!email || !password) {
            setError("이메일과 비밀번호를 입력해주세요.");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post(
                `${BASE_URL}/api/auth/login`,
                { email, password }
            );

            if (response.status === 200) {
                const { accessToken, refreshToken } = response.data.data;
                localStorage.setItem("accessToken", accessToken);
                localStorage.setItem("refreshToken", refreshToken);
                localStorage.setItem("userEmail", email);
                setIsLoggedIn(true);
                navigate("/", { replace: true });
            }
        } catch (err) {
            if (err.response) {
                console.log(err.response);
                if (err.response.status === 401 && err.response.data.error === "이메일 인증이 필요합니다. 이메일을 확인해주세요.") {
                    setError("이메일 인증이 필요합니다. 인증 메일을 확인해주세요.");
                    setShowResendButton(true);
                } else if (err.response.data && err.response.data.message) {
                    setError(err.response.data.message);
                } else {
                    setError("이메일 또는 비밀번호가 잘못되었습니다.");
                }
            } else {
                setError("서버와의 통신에 실패했습니다.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
                <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">로그인</h1>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            이메일
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="이메일을 입력하세요"
                            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            비밀번호
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="비밀번호를 입력하세요"
                            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                        />
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm">
                            <p>{error}</p>
                            {showResendButton && (
                                <button
                                    type="button"
                                    onClick={handleResendVerification}
                                    className="mt-2 text-blue-500 hover:text-blue-600 underline"
                                    disabled={loading}
                                >
                                    인증 메일 재발송
                                </button>
                            )}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors font-medium text-lg"
                        disabled={loading}
                    >
                        {loading ? "로그인 중..." : "로그인"}
                    </button>
                </form>

                <div className="mt-6 text-center space-y-2">
                    <p className="text-sm text-gray-600">
                        아직 계정이 없으신가요?{" "}
                        <a href="/signup" className="text-blue-500 hover:underline">
                            회원가입
                        </a>
                    </p>
                    <p className="text-sm text-gray-600">
                        비밀번호를 잊으셨나요?{" "}
                        <a href="/reset-password" className="text-blue-500 hover:underline">
                            비밀번호 찾기
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;