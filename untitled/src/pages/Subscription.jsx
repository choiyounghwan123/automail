import React, { useState, useEffect } from "react";
import axios from "axios";

function Subscription() {
    const [email, setEmail] = useState("");
    const [frequency, setFrequency] = useState("IMMEDIATE"); // 기본값 대문자로 수정
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchEmail = async () => {
            try {
                const token = localStorage.getItem("accessToken");
                console.log(token);
                const response = await axios.get("http://localhost:8080/api/users/email", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setEmail(response.data.data.email);
                console.log(response.data.data.email);
            } catch (err) {
                console.error("이메일 정보를 불러오지 못했습니다.", err);
            }
        };
        fetchEmail();
    }, []);

    const handleSubscribe = async () => {
        if (!frequency || !["IMMEDIATE", "HOURLY", "DAILY", "WEEKLY"].includes(frequency)) {
            alert("유효한 받아볼 시간을 선택하세요.");
            return;
        }

        setLoading(true);
        setErrorMessage("");
        try {
            const token = localStorage.getItem("accessToken");
            await axios.post(
                "http://localhost:8080/api/subscriptions",
                { frequency },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setSuccessMessage(
                `구독 설정이 완료되었습니다! (${getFrequencyLabel(frequency)})`
            );
        } catch (err) {
            console.error("구독 요청 실패:", err);
            setErrorMessage("구독 요청에 실패했습니다. 네트워크 상태를 확인하세요.");
        } finally {
            setLoading(false);
        }
    };

    const getFrequencyLabel = (value) => {
        switch (value) {
            case "IMMEDIATE":
                return "즉시";
            case "HOURLY":
                return "1시간마다";
            case "DAILY":
                return "하루마다";
            case "WEEKLY":
                return "일주일마다";
            default:
                return "";
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-50 px-4">
            <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-8">
                <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-6">
                    이메일 구독 설정
                </h1>

                <p className="text-gray-600 text-center mb-6">
                    공지사항을 받아볼 이메일:
                    <span className="block font-semibold text-gray-700 mt-2">
                        {email || "불러오는 중..."}
                    </span>
                </p>

                <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700">
                        공지사항 이메일 간격:
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                        {["IMMEDIATE", "HOURLY", "DAILY", "WEEKLY"].map((freq) => (
                            <button
                                key={freq}
                                className={`py-2 px-4 rounded-lg font-medium border transition-all ${
                                    frequency === freq
                                        ? "bg-indigo-500 text-white border-indigo-500"
                                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                                }`}
                                onClick={() => setFrequency(freq)}
                            >
                                {getFrequencyLabel(freq)}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={handleSubscribe}
                        disabled={loading}
                        className={`w-full py-3 rounded-lg font-semibold text-lg transition-all ${
                            loading
                                ? "bg-gray-400 text-gray-100 cursor-not-allowed"
                                : "bg-blue-500 text-white hover:bg-blue-600"
                        }`}
                    >
                        {loading ? "설정 중..." : "구독 설정"}
                    </button>

                    {successMessage && (
                        <div className="mt-6 bg-green-100 border border-green-300 text-green-700 p-4 rounded-lg text-sm">
                            {successMessage}
                        </div>
                    )}
                    {errorMessage && (
                        <div className="mt-6 bg-red-100 border border-red-300 text-red-700 p-4 rounded-lg text-sm">
                            {errorMessage}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Subscription;