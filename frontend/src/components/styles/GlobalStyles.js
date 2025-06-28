// src/components/styles/GlobalStyles.js
import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&display=swap');

  html, body {
    margin: 0; 
    padding: 0; 
    height: 100%;
  }

  body {
    font-family: 'Roboto', sans-serif;
    background-color: #ECEFF1; /* 연한 그레이톤 배경 */
    color: #424242; /* 진한 회색 글자색 */
    display: flex; 
    flex-direction: column; 
    min-height: 100%;
  }

  #root {
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  a {
    text-decoration: none;
    color: #42A5F5; /* 메인 블루 */
  }

  button, input {
    font-family: inherit;
  }
`;

export default GlobalStyles;