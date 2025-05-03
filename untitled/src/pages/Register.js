import React, { useState } from "react";
import axios from "axios";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false); // 성공 여부
  const [loading, setLoading] = useState(false); // 로딩 상태

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await axios.post(
        "http://10.125.208.184:8080/api/users/signup",
        {
          email,
          password,
        }
      );

      if (response.status === 200) {
        setSuccess(true); // 성공 시 팝업 표시
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "회원가입 중 오류가 발생했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  const closePopup = () => {
    setSuccess(false);
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
        {/* 제목 */}
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          회원가입
        </h1>

        {/* 회원가입 폼 */}
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

          {/* 비밀번호 입력 */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              비밀번호
            </label>
            <input
              type="password"
              id="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="
                w-full px-4 py-2 rounded-md border border-gray-300
                focus:outline-none focus:ring-2 focus:ring-blue-400
                focus:border-transparent transition-all
              "
              required
            />
          </div>

          {/* 비밀번호 확인 */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              비밀번호 확인
            </label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="비밀번호를 다시 입력하세요"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="
                w-full px-4 py-2 rounded-md border border-gray-300
                focus:outline-none focus:ring-2 focus:ring-blue-400
                focus:border-transparent transition-all
              "
              required
            />
          </div>

          {/* 오류 메시지 */}
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

          {/* 회원가입 버튼 */}
          <button
            type="submit"
            className="
              w-full py-2 rounded-md bg-blue-500 text-white
              hover:bg-blue-600 transition-colors
              font-medium text-lg
            "
            disabled={loading}
          >
            {loading ? "회원가입 중..." : "회원가입"}
          </button>
        </form>
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
              회원가입 성공!
            </h2>
            <p className="text-gray-600 mb-4">
              이메일로 인증 링크를 발송했습니다. 확인해주세요.
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

export default Signup;
