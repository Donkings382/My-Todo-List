import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import TodoCard from './TodoCard';

// Mock the current date for consistent tests
const mockCurrentDate = new Date('2026-02-15T10:00:00');

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(mockCurrentDate);
});

afterEach(() => {
  vi.useRealTimers();
});

describe('TodoCard', () => {
  describe('Rendering', () => {
    test('renders the card container with correct data-testid', () => {
      render(<TodoCard />);
      const card = screen.getByTestId('test-todo-card');
      expect(card).toBeInTheDocument();
      expect(card.tagName).toBe('ARTICLE');
      expect(card).toHaveAttribute('role', 'region');
    });

    test('renders the task title with correct data-testid', () => {
      const testTitle = 'My Test Task';
      render(<TodoCard title={testTitle} />);
      const title = screen.getByTestId('test-todo-title');
      expect(title).toBeInTheDocument();
      expect(title.tagName).toBe('H2');
      expect(title).toHaveTextContent(testTitle);
    });

    test('renders the task description with correct data-testid', () => {
      const testDescription = 'This is a test description';
      render(<TodoCard description={testDescription} />);
      const description = screen.getByTestId('test-todo-description');
      expect(description).toBeInTheDocument();
      expect(description.tagName).toBe('P');
      expect(description).toHaveTextContent(testDescription);
    });

    test('renders the priority badge with correct data-testid', () => {
      render(<TodoCard priority="high" />);
      const priority = screen.getByTestId('test-todo-priority');
      expect(priority).toBeInTheDocument();
      expect(priority).toHaveTextContent('High Priority');
    });

    test('renders priority badge with correct class for high priority', () => {
      render(<TodoCard priority="high" />);
      const priority = screen.getByTestId('test-todo-priority');
      expect(priority).toHaveClass('priority-high');
    });

    test('renders priority badge with correct class for medium priority', () => {
      render(<TodoCard priority="medium" />);
      const priority = screen.getByTestId('test-todo-priority');
      expect(priority).toHaveClass('priority-medium');
    });

    test('renders priority badge with correct class for low priority', () => {
      render(<TodoCard priority="low" />);
      const priority = screen.getByTestId('test-todo-priority');
      expect(priority).toHaveClass('priority-low');
    });

    test('renders the due date with correct data-testid', () => {
      const testDueDate = new Date('2026-02-18T17:00:00');
      render(<TodoCard dueDate={testDueDate} />);
      const dueDate = screen.getByTestId('test-todo-due-date');
      expect(dueDate).toBeInTheDocument();
      expect(dueDate.tagName).toBe('TIME');
      expect(dueDate).toHaveTextContent('Due Feb 18, 2026');
    });

    test('renders the time remaining with correct data-testid', () => {
      const testDueDate = new Date('2026-02-18T17:00:00');
      render(<TodoCard dueDate={testDueDate} />);
      const timeRemaining = screen.getByTestId('test-todo-time-remaining');
      expect(timeRemaining).toBeInTheDocument();
      expect(timeRemaining.tagName).toBe('TIME');
      expect(timeRemaining).toHaveTextContent('Due in 3 days');
    });

    test('renders the status indicator with correct data-testid', () => {
      render(<TodoCard status="In Progress" />);
      const status = screen.getByTestId('test-todo-status');
      expect(status).toBeInTheDocument();
      expect(status.tagName).toBe('SPAN');
      expect(status).toHaveTextContent('In Progress');
    });

    test('renders the checkbox with correct data-testid', () => {
      render(<TodoCard />);
      const checkbox = screen.getByTestId('test-todo-complete-toggle');
      expect(checkbox).toBeInTheDocument();
      expect(checkbox.type).toBe('checkbox');
    });

    test('renders the tags list with correct data-testid', () => {
      const testTags = ['Work', 'Documentation'];
      render(<TodoCard tags={testTags} />);
      const tagsList = screen.getByTestId('test-todo-tags');
      expect(tagsList).toBeInTheDocument();
      expect(tagsList.tagName).toBe('UL');
      expect(tagsList).toHaveAttribute('role', 'list');
    });

    test('renders individual tags with correct data-testid format', () => {
      const testTags = ['Work', 'Documentation', 'API'];
      render(<TodoCard tags={testTags} />);
      
      expect(screen.getByTestId('test-todo-tag-work')).toBeInTheDocument();
      expect(screen.getByTestId('test-todo-tag-documentation')).toBeInTheDocument();
      expect(screen.getByTestId('test-todo-tag-api')).toBeInTheDocument();
    });

    test('renders tags with correct text content', () => {
      const testTags = ['Work', 'Documentation'];
      render(<TodoCard tags={testTags} />);
      
      expect(screen.getByTestId('test-todo-tag-work')).toHaveTextContent('Work');
      expect(screen.getByTestId('test-todo-tag-documentation')).toHaveTextContent('Documentation');
    });

    test('renders the edit button with correct data-testid', () => {
      render(<TodoCard />);
      const editButton = screen.getByTestId('test-todo-edit-button');
      expect(editButton).toBeInTheDocument();
      expect(editButton.tagName).toBe('BUTTON');
    });

    test('renders the delete button with correct data-testid', () => {
      render(<TodoCard />);
      const deleteButton = screen.getByTestId('test-todo-delete-button');
      expect(deleteButton).toBeInTheDocument();
      expect(deleteButton.tagName).toBe('BUTTON');
    });
  });

  describe('Checkbox Toggle', () => {
    test('checkbox is unchecked by default', () => {
      render(<TodoCard />);
      const checkbox = screen.getByTestId('test-todo-complete-toggle');
      expect(checkbox).not.toBeChecked();
    });

    test('checkbox is checked when completed prop is true', () => {
      render(<TodoCard completed={true} />);
      const checkbox = screen.getByTestId('test-todo-complete-toggle');
      expect(checkbox).toBeChecked();
    });

    test('toggling checkbox updates its state', () => {
      render(<TodoCard />);
      const checkbox = screen.getByTestId('test-todo-complete-toggle');
      
      fireEvent.click(checkbox);
      expect(checkbox).toBeChecked();
      
      fireEvent.click(checkbox);
      expect(checkbox).not.toBeChecked();
    });

    test('toggling checkbox calls onToggleComplete callback', () => {
      const onToggleComplete = vi.fn();
      render(<TodoCard onToggleComplete={onToggleComplete} />);
      const checkbox = screen.getByTestId('test-todo-complete-toggle');
      
      fireEvent.click(checkbox);
      expect(onToggleComplete).toHaveBeenCalledTimes(1);
      expect(onToggleComplete).toHaveBeenCalledWith(true);
      
      fireEvent.click(checkbox);
      expect(onToggleComplete).toHaveBeenCalledTimes(2);
      expect(onToggleComplete).toHaveBeenCalledWith(false);
    });

    test('status changes to Completed when checkbox is checked', () => {
      render(<TodoCard status="In Progress" />);
      const checkbox = screen.getByTestId('test-todo-complete-toggle');
      const status = screen.getByTestId('test-todo-status');
      
      expect(status).toHaveTextContent('In Progress');
      
      fireEvent.click(checkbox);
      expect(status).toHaveTextContent('Completed');
    });

    test('status reverts when checkbox is unchecked', () => {
      render(<TodoCard status="In Progress" />);
      const checkbox = screen.getByTestId('test-todo-complete-toggle');
      const status = screen.getByTestId('test-todo-status');
      
      fireEvent.click(checkbox);
      expect(status).toHaveTextContent('Completed');
      
      fireEvent.click(checkbox);
      expect(status).toHaveTextContent('In Progress');
    });

    test('card gets completed class when checkbox is checked', () => {
      render(<TodoCard />);
      const card = screen.getByTestId('test-todo-card');
      const checkbox = screen.getByTestId('test-todo-complete-toggle');
      
      expect(card).not.toHaveClass('completed');
      
      fireEvent.click(checkbox);
      expect(card).toHaveClass('completed');
    });
  });

  describe('Time Remaining', () => {
    test('displays "Due in X days" for future dates', () => {
      const dueDate = new Date('2026-02-18T17:00:00'); // 3 days from mock date
      render(<TodoCard dueDate={dueDate} />);
      const timeRemaining = screen.getByTestId('test-todo-time-remaining');
      expect(timeRemaining).toHaveTextContent('Due in 3 days');
    });

    test('displays "Due in X hours" for same day future dates', () => {
      const dueDate = new Date('2026-02-15T15:00:00'); // 5 hours from mock date
      render(<TodoCard dueDate={dueDate} />);
      const timeRemaining = screen.getByTestId('test-todo-time-remaining');
      expect(timeRemaining).toHaveTextContent('Due in 5 hours');
    });

    test('displays "Due in X minutes" for near future dates', () => {
      const dueDate = new Date('2026-02-15T10:30:00'); // 30 minutes from mock date
      render(<TodoCard dueDate={dueDate} />);
      const timeRemaining = screen.getByTestId('test-todo-time-remaining');
      expect(timeRemaining).toHaveTextContent('Due in 30 minutes');
    });

    test('displays "Overdue by X days" for past dates', () => {
      const dueDate = new Date('2026-02-12T10:00:00'); // 3 days ago
      render(<TodoCard dueDate={dueDate} />);
      const timeRemaining = screen.getByTestId('test-todo-time-remaining');
      expect(timeRemaining).toHaveTextContent('Overdue by 3 days');
    });

    test('displays "Overdue by X hours" for recent past dates', () => {
      const dueDate = new Date('2026-02-15T05:00:00'); // 5 hours ago
      render(<TodoCard dueDate={dueDate} />);
      const timeRemaining = screen.getByTestId('test-todo-time-remaining');
      expect(timeRemaining).toHaveTextContent('Overdue by 5 hours');
    });

    test('adds overdue class when date is in the past', () => {
      const dueDate = new Date('2026-02-12T10:00:00');
      render(<TodoCard dueDate={dueDate} />);
      const timeRemaining = screen.getByTestId('test-todo-time-remaining');
      expect(timeRemaining).toHaveClass('overdue');
    });

    test('does not add overdue class when date is in the future', () => {
      const dueDate = new Date('2026-02-18T17:00:00');
      render(<TodoCard dueDate={dueDate} />);
      const timeRemaining = screen.getByTestId('test-todo-time-remaining');
      expect(timeRemaining).not.toHaveClass('overdue');
    });

    test('updates time remaining after interval passes', async () => {
      const dueDate = new Date('2026-02-15T10:30:00'); // 30 minutes from mock date
      render(<TodoCard dueDate={dueDate} updateInterval={1000} />);
      const timeRemaining = screen.getByTestId('test-todo-time-remaining');
      
      expect(timeRemaining).toHaveTextContent('Due in 30 minutes');
      
      // Advance time by 10 minutes (this advances both timers and system time)
      await vi.advanceTimersByTimeAsync(10 * 60 * 1000);
      
      expect(timeRemaining).toHaveTextContent('Due in 20 minutes');
    });
  });

  describe('Button Interactions', () => {
    test('edit button calls onEdit callback when clicked', () => {
      const onEdit = vi.fn();
      render(<TodoCard onEdit={onEdit} />);
      const editButton = screen.getByTestId('test-todo-edit-button');
      
      fireEvent.click(editButton);
      expect(onEdit).toHaveBeenCalledTimes(1);
    });

    test('delete button calls onDelete callback when clicked', () => {
      const onDelete = vi.fn();
      render(<TodoCard onDelete={onDelete} />);
      const deleteButton = screen.getByTestId('test-todo-delete-button');
      
      fireEvent.click(deleteButton);
      expect(onDelete).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    test('checkbox has aria-label', () => {
      render(<TodoCard />);
      const checkbox = screen.getByTestId('test-todo-complete-toggle');
      expect(checkbox).toHaveAttribute('aria-label', 'Mark task as complete');
    });

    test('card has aria-label', () => {
      render(<TodoCard />);
      const card = screen.getByTestId('test-todo-card');
      expect(card).toHaveAttribute('aria-label', 'Todo item');
    });

    test('tags list has aria-label', () => {
      render(<TodoCard />);
      const tagsList = screen.getByTestId('test-todo-tags');
      expect(tagsList).toHaveAttribute('aria-label', 'Task categories');
    });

    test('edit button has aria-label', () => {
      render(<TodoCard />);
      const editButton = screen.getByTestId('test-todo-edit-button');
      expect(editButton).toHaveAttribute('aria-label', 'Edit task');
    });

    test('delete button has aria-label', () => {
      render(<TodoCard />);
      const deleteButton = screen.getByTestId('test-todo-delete-button');
      expect(deleteButton).toHaveAttribute('aria-label', 'Delete task');
    });
  });

  describe('Default Props', () => {
    test('renders with default props when none provided', () => {
      render(<TodoCard />);
      
      expect(screen.getByTestId('test-todo-title')).toHaveTextContent('Complete project documentation');
      expect(screen.getByTestId('test-todo-description')).toHaveTextContent(
        'Write comprehensive documentation for the new API endpoints including usage examples, parameter descriptions, and error handling guidelines.'
      );
      expect(screen.getByTestId('test-todo-priority')).toHaveTextContent('High Priority');
      expect(screen.getByTestId('test-todo-status')).toHaveTextContent('In Progress');
    });
  });
});