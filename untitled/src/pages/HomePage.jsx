import React from "react";

function HomePage() {
    return (
        <main className="pt-16">
            {/* Hero Section */}
            <section className="relative w-full h-[70vh] bg-gray-100 flex items-center justify-center text-center">
                {/* 배경 이미지가 있다면, absolute로 깔고 그 위에 내용 표시 가능
        <img
          src="https://via.placeholder.com/1200x800"
          alt="Hero Background"
          className="absolute w-full h-full object-cover"
        />
        */}
                <div className="z-10 max-w-xl px-4">
                    <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4 leading-tight">
                         새로운 공지사항을 편리하게 받아보세요
                    </h1>
                    <p className="text-gray-600 mb-8">
                        학교 홈페이지를 직접 방문하지 않아도, 중요한 소식을 한눈에 확인할 수 있습니다.
                    </p>
                    <a
                        href="#notice"
                        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded transition-colors"
                    >
                        공지사항 바로가기
                    </a>
                </div>
            </section>

            {/* 서비스 소개 섹션 */}
            <section className="py-12 bg-white">
                <div className="max-w-screen-xl mx-auto px-6 text-center">
                    <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6">
                        이런 기능을 제공합니다
                    </h2>
                    <ul className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <li className="p-6 border rounded hover:shadow-md transition-shadow">
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                자동 크롤링
                            </h3>
                            <p className="text-gray-600">
                                매번 홈페이지를 보지 않아도, 최신 정보를 자동으로 가져옵니다.
                            </p>
                        </li>
                        <li className="p-6 border rounded hover:shadow-md transition-shadow">
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                메일 전송
                            </h3>
                            <p className="text-gray-600">
                                사용자 설정에 따라 원하는 소식을 메일로 빠르게 받아볼 수 있습니다.
                            </p>
                        </li>
                        <li className="p-6 border rounded hover:shadow-md transition-shadow">
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                맞춤 설정
                            </h3>
                            <p className="text-gray-600">
                                마이페이지에서 원하는 분야만 선택해서 받아볼 수 있습니다.
                            </p>
                        </li>
                    </ul>
                </div>
            </section>
        </main>
    );
}

export default HomePage;