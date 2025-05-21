import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TaskList from '../components/TaskList';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import '@testing-library/jest-dom';

jest.mock('axios');

const mockTasks = [
  {
    _id: 'task123',
    title: 'Test Task',
    description: 'This is a test task',
    tags: ['test', 'api'],
    dueDate: '2025-05-20',
    estimatedTime: 2,
    priority: 'Medium',
    assignedTo: 'testuser'
  }
];

test('loads and displays tasks', async () => {
  axios.get.mockResolvedValue({ data: mockTasks });

  render(<TaskList />, { wrapper: MemoryRouter });

  expect(await screen.findByText(/your tasks/i)).toBeInTheDocument();
  await screen.findByRole('heading', { name: /test task/i });

});

test('delete task removes from list', async () => {
  axios.get.mockResolvedValue({ data: mockTasks });
  axios.delete.mockResolvedValue({ status: 200 });

  render(<TaskList />, { wrapper: MemoryRouter });

  // Wait for tasks to load by heading
  await screen.findByRole('heading', { name: /test task/i });

  const deleteButton = await screen.findByRole('button', { name: /delete/i });
  fireEvent.click(deleteButton);

  // Assuming your component removes the task from the UI on delete
  await waitFor(() => {
    expect(screen.queryByRole('heading', { name: /test task/i })).not.toBeInTheDocument();
  });
});
