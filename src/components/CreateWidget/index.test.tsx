import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Widget } from '../../lib/apiConnect';
import CreateWidget from './index';

describe('CreateWidget', () => {
  const widget: Widget = { description: 'German movie star', name: 'Widget von Hammersmark', price: 19.45 };

  it('renders the CreateWidget form', () => {
    render(<CreateWidget />);

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
  });

  it('displays validation errors for empty fields', async () => {
    render(<CreateWidget />);

    const saveButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText(/name must be between 3 and 100 characters/i)).toBeInTheDocument();
      expect(screen.getByText(/description must be between 5 and 1000 characters/i)).toBeInTheDocument();
      expect(screen.getByText(/price must be between 1 and 20000 with up to 2 decimal places/i)).toBeInTheDocument();
    });
  });

  it('submits the form with valid data', async () => {
    const handleSave = jest.fn();
    render(<CreateWidget />);

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: widget.name } });
    fireEvent.change(screen.getByLabelText(/price/i), { target: { value: widget.price.toString() } });
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: widget.description } });

    const saveButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(handleSave).toHaveBeenCalledWith(widget);
    });
  });

  it('displays error message when widget creation fails', async () => {
    const handleSave = jest.fn().mockRejectedValue({ response: { status: 400, data: { message: 'Bad Request' } } });
    render(<CreateWidget />);

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: widget.name } });
    fireEvent.change(screen.getByLabelText(/price/i), { target: { value: widget.price.toString() } });
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: widget.description } });

    const saveButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText(/bad request/i)).toBeInTheDocument();
    });
  });
});