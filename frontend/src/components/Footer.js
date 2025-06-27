import React from "react";

function Footer() {
    return (
        <footer className="bg-gray-50 text-gray-600 border-t border-gray-200">
            <div className="max-w-screen-xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between text-sm">
                {/* 왼쪽: 로고 */}
                <div className="mb-4 md:mb-0 text-center md:text-left">
                    <h2 className="text-lg font-semibold text-gray-800">
                        의생명융합공학부 공지사항
                    </h2>
                </div>

                {/* 가운데: 링크 */}
                <nav className="flex space-x-6 mb-4 md:mb-0">
                    <a
                        href="/notice"
                        className="hover:text-blue-400 transition-colors"
                    >
                        공지사항
                    </a>
                    <a
                        href="/src/pages/Login"
                        className="hover:text-blue-400 transition-colors"
                    >
                        로그인
                    </a>
                    <a
                        href="/signup"
                        className="hover:text-blue-400 transition-colors"
                    >
                        회원가입
                    </a>
                    <a
                        href="/mypage"
                        className="hover:text-blue-400 transition-colors"
                    >
                        마이페이지
                    </a>
                </nav>

                {/* 오른쪽: 저작권 */}
                <div className="text-center md:text-right">
                    <p>© 2025 의생명융합공학부. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;