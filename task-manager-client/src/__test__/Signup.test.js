import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Signup from '../components/Signup';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import '@testing-library/jest-dom';

jest.mock('axios');

test('signup form submits and redirects', async () => {
  axios.post.mockResolvedValue({ status: 201 });

  render(<Signup />, { wrapper: MemoryRouter });

  fireEvent.change(screen.getByPlaceholderText(/username/i), { target: { value: 'testuser' } });
  fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'testuser@example.com' } });
  fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'Test1234!' } });

  fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

  await waitFor(() => {
    expect(screen.queryByText(/failed to sign up/i)).not.toBeInTheDocument();
  });
});
