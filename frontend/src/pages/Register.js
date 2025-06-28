import React, { useState } from "react";
import axios from "axios";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false); // 성공 여부
  const [loading, setLoading] = useState(false); // 로딩 상태
  const BASE_URL = process.env.REACT_APP_API_URL;
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
        `${BASE_URL}/api/users/signup`,
        {
          email,
          password,
        }
      );

      if (response.status === 200) {
        setSuccess(true);
      }
    } catch (err) {
      console.error('Signup error:', err);
      if (err.response) {
        // 서버에서 응답이 왔지만 에러인 경우
        if (err.response.status === 400) {
          if (err.response.data.data === "이미 존재하는 이메일입니다.") {
            setError("이미 가입된 이메일입니다. 다른 이메일을 사용해주세요.");
          } else if (err.response.data.message) {
            setError(err.response.data.message);
          } else {
            console.log(err.response.data);
            setError("회원가입에 실패했습니다. 입력한 정보를 확인해주세요.");
          }
        } else if (err.response.status === 500) {
          setError("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
        } else {
          setError(err.response.data.message || "회원가입에 실패했습니다.");
        }
      } else if (err.request) {
        // 요청은 보냈지만 응답이 없는 경우
        setError("서버와 통신할 수 없습니다. 잠시 후 다시 시도해주세요.");
      } else {
        // 요청 설정 중 에러가 발생한 경우
        setError("회원가입 중 오류가 발생했습니다.");
      }
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
              className={`
                w-full px-4 py-2 rounded-md border
                ${error ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-400'}
                focus:outline-none focus:ring-2 focus:border-transparent transition-all
              `}
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
              className={`
                w-full px-4 py-2 rounded-md border
                ${error ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-400'}
                focus:outline-none focus:ring-2 focus:border-transparent transition-all
              `}
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
              className={`
                w-full px-4 py-2 rounded-md border
                ${error ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-400'}
                focus:outline-none focus:ring-2 focus:border-transparent transition-all
              `}
              required
            />
          </div>

          {/* 오류 메시지 */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md animate-fade-in">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* 회원가입 버튼 */}
          <button
            type="submit"
            className={`
              w-full py-2 rounded-md text-white font-medium text-lg
              ${loading 
                ? 'bg-blue-400 cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-600'
              }
              transition-colors
            `}
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                회원가입 중...
              </div>
            ) : (
              "회원가입"
            )}
          </button>
        </form>
      </div>

      {/* 성공 팝업 */}
      {success && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl text-center max-w-md animate-bounce-in">
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
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
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
