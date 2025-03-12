// src/pages/NotFound.js
import React from 'react';
import styled from 'styled-components';

const NotFoundContainer = styled.div`
  text-align: center;
  margin-top: 5rem;
`;

function NotFound() {
    return (
        <NotFoundContainer>
            <h2>페이지를 찾을 수 없습니다</h2>
            <p>주소를 확인하거나 다시 시도해보세요.</p>
        </NotFoundContainer>
    );
}

export default NotFound;