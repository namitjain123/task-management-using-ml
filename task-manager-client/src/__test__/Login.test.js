import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../components/Login';
import axios from 'axios';
import { BrowserRouter } from 'react-router-dom';

jest.mock('axios');

test('shows error message on failed login', async () => {
  axios.post.mockRejectedValue(new Error('Invalid credentials'));

  render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );

  fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'wrong@example.com' } });
  fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'wrongpass' } });
  fireEvent.click(screen.getByRole('button', { name: /login/i }));

  expect(await screen.findByText(/invalid email or password/i)).toBeInTheDocument();
});
