import { render, screen } from '@testing-library/react';
import App from './App';

test('renders main heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/새로운 공지사항을 편리하게 받아보세요/i);
  expect(headingElement).toBeInTheDocument();
});
