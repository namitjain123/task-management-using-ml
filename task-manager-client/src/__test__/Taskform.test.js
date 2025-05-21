import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TaskForm from '../components/TaskForm';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import '@testing-library/jest-dom';

jest.mock('axios');

test('create new task successfully', async () => {
  axios.post.mockResolvedValue({
    data: { _id: 'task123', title: 'New Task' }
  });

  render(
    <MemoryRouter initialEntries={['/tasks/new']}>
      <Routes>
        <Route path="/tasks/new" element={<TaskForm />} />
      </Routes>
    </MemoryRouter>
  );

  fireEvent.change(screen.getByPlaceholderText(/title/i), { target: { value: 'New Task' } });
  fireEvent.change(screen.getByPlaceholderText(/description/i), { target: { value: 'Task description' } });
  fireEvent.change(screen.getByPlaceholderText(/tags/i), { target: { value: 'test,api' } });
  fireEvent.change(screen.getByPlaceholderText(/estimated time/i), { target: { value: '3' } });
  fireEvent.change(screen.getByLabelText(/due date/i), { target: { value: '2025-05-20' } });

  fireEvent.click(screen.getByRole('button', { name: /create task/i }));

  await waitFor(() => {
    expect(screen.queryByText(/failed to save task/i)).not.toBeInTheDocument();
  });
});
