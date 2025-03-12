import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login({ setIsLoggedIn }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (!email || !password) {
            setError("이메일과 비밀번호를 입력해주세요.");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post(
                "http://localhost:8080/api/auth/login",
                { email, password }
            );

            if (response.status === 200) {
                const { accessToken, refreshToken } = response.data.data;
                localStorage.setItem("accessToken", accessToken);
                localStorage.setItem("refreshToken", refreshToken);

                // 로그인 상태 업데이트 후 리다이렉트
                setIsLoggedIn(true);
                navigate("/", { replace: true }); // replace로 히스토리를 덮어씁니다.
            }
        } catch (err) {
            console.log(err);
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError("이메일 또는 비밀번호가 잘못되었습니다.");
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

                    {error && <p className="text-red-500 text-sm">{error}</p>}

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