import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { mocked } from 'jest-mock';
import * as apiConnect from '../../lib/apiConnect';
import WidgetList from './index';

jest.mock('../../lib/apiConnect');

describe('WidgetList', () => {
  const widgets: apiConnect.Widget[] = [
    { description: 'German movie star', name: 'Widget von Hammersmark', price: 19.45 },
    { description: 'Danish movie star', name: 'Widgette Nielson', price: 19.95 },
  ];

  beforeEach(() => {
    mocked(apiConnect.fetchAllWidgets).mockResolvedValue(widgets);
  });

  it('renders WidgetDisplay for each widget', async () => {
    render(<WidgetList />);

    await waitFor(() => {
      expect(screen.getByText('Widget von Hammersmark')).toBeInTheDocument();
      expect(screen.getByText('Widgette Nielson')).toBeInTheDocument();
    });
  });

  it('displays error message when name is empty', async () => {
    render(<WidgetList />);

    const getButton = screen.getByText('Get Widget By Name');
    fireEvent.click(getButton);

    await waitFor(() => {
      expect(screen.getByText('Name cannot be empty.')).toBeInTheDocument();
    });
  });

  it('fetches widget by name and displays it', async () => {
    const widget = { description: 'German movie star', name: 'Widget von Hammersmark', price: 19.45 };
    mocked(apiConnect.getWidgetData).mockResolvedValue({ status: 200, data: widget });

    render(<WidgetList />);

    const nameInput = screen.getByLabelText('Name');
    fireEvent.change(nameInput, { target: { value: 'Widget von Hammersmark' } });

    const getButton = screen.getByText('Get Widget By Name');
    fireEvent.click(getButton);

    await waitFor(() => {
      expect(screen.getByText('Widget von Hammersmark')).toBeInTheDocument();
      expect(screen.getByText('Widget fetched successfully!')).toBeInTheDocument();
    });
  });

  it('displays error message when fetching widget fails', async () => {
    mocked(apiConnect.getWidgetData).mockRejectedValue({ response: { status: 400, data: { message: 'Bad Request' } } });

    render(<WidgetList />);

    const nameInput = screen.getByLabelText('Name');
    fireEvent.change(nameInput, { target: { value: 'Invalid Widget' } });

    const getButton = screen.getByText('Get Widget By Name');
    fireEvent.click(getButton);

    await waitFor(() => {
      expect(screen.getByText('Bad Request: Bad Request')).toBeInTheDocument();
    });
  });

  it('displays success message when widget is created', async () => {
    const newWidget = { description: 'New Widget', name: 'New Widget', price: 10.0 };
    mocked(apiConnect.createWidget).mockResolvedValue({ status: 201, data: newWidget });

    render(<WidgetList />);

    const addButton = screen.getByText('Add New Widget');
    fireEvent.click(addButton);

    const nameInput = screen.getByLabelText('Name');
    fireEvent.change(nameInput, { target: { value: 'New Widget' } });

    const priceInput = screen.getByLabelText('Price');
    fireEvent.change(priceInput, { target: { value: '10.0' } });

    const descriptionInput = screen.getByLabelText('Description');
    fireEvent.change(descriptionInput, { target: { value: 'New Widget Description' } });

    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('Widget created successfully!')).toBeInTheDocument();
    });
  });

  it('displays error message when widget creation fails', async () => {
    mocked(apiConnect.createWidget).mockRejectedValue({ response: { status: 400, data: { message: 'Bad Request' } } });

    render(<WidgetList />);

    const addButton = screen.getByText('Add New Widget');
    fireEvent.click(addButton);

    const nameInput = screen.getByLabelText('Name');
    fireEvent.change(nameInput, { target: { value: 'Invalid Widget' } });

    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('Bad Request: Bad Request')).toBeInTheDocument();
    });
  });
});