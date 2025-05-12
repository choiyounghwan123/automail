import React, { useState } from 'react';
import axios from 'axios';

function VerifyEmail() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const BASE_URL = process.env.REACT_APP_API_URL;

    const handleResendVerification = async () => {
        try {
            setLoading(true);
            await axios.post(`${BASE_URL}/api/users/verify/resend`, { email });
            setMessage('인증 메일이 재발송되었습니다. 이메일을 확인해주세요.');
        } catch (error) {
            setMessage('인증 메일 재발송에 실패했습니다. 다시 시도해주세요.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
                <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
                    이메일 인증이 필요합니다
                </h1>
                <p className="text-gray-600 mb-4">
                    서비스 이용을 위해 이메일 인증이 필요합니다.
                    이메일을 확인하여 인증을 완료해주세요.
                </p>
                <div className="space-y-4">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="이메일 주소를 입력하세요"
                        className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                    />
                    <button
                        onClick={handleResendVerification}
                        disabled={loading}
                        className="w-full py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors font-medium text-lg"
                    >
                        {loading ? '처리 중...' : '인증 메일 재발송'}
                    </button>
                </div>
                {message && (
                    <p className="mt-4 text-center text-sm text-gray-600">
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
}

export default VerifyEmail; 