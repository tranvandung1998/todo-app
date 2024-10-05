import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TodoApp from '../components/TodoApp';
import '@testing-library/jest-dom';

describe('TodoApp', () => {
  test('renders the TodoApp component', () => {
    render(<TodoApp />);
    
    const headingElement = screen.getByText(/danh sách công việc/i);
    expect(headingElement).toBeInTheDocument();
  });

  test('validates input and shows error message', async () => {
    render(<TodoApp />);
    
    const submitButton = screen.getByText(/thêm công việc/i);
    fireEvent.click(submitButton);

    const errorMessage = await screen.findByText(/nội dung công việc là bắt buộc/i);
    expect(errorMessage).toBeInTheDocument();
  });

  test('accepts valid input', async () => {
    render(<TodoApp />);

    const inputElement = screen.getByLabelText(/công việc/i);
    const submitButton = screen.getByText(/thêm công việc/i);

    fireEvent.change(inputElement, { target: { value: 'Mua sắm' } });
    fireEvent.click(submitButton);

    const errorMessage = screen.queryByText(/nội dung công việc là bắt buộc/i);
    expect(errorMessage).not.toBeInTheDocument();
  });
});
