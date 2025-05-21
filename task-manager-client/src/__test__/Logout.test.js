import React from 'react';
import { render, screen } from '@testing-library/react';
import Logout from '../components/Logout';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom'; // for matchers

test('logout clears token and redirects', () => {
  localStorage.setItem('token', 'testtoken');
  render(<Logout />, { wrapper: MemoryRouter });

  expect(localStorage.getItem('token')).toBeNull();
  expect(screen.getByText(/you have been logged out successfully/i)).toBeInTheDocument();
});
