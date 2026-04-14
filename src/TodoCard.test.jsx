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

    test('renders the status control with correct data-testid', () => {
      render(<TodoCard status="In Progress" />);
      const statusControl = screen.getByTestId('test-todo-status-control');
      expect(statusControl).toBeInTheDocument();
      expect(statusControl.tagName).toBe('SELECT');
      expect(statusControl).toHaveValue('In Progress');
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

    test('renders the priority indicator with correct data-testid', () => {
      render(<TodoCard priority="high" />);
      const priorityIndicator = screen.getByTestId('test-todo-priority-indicator');
      expect(priorityIndicator).toBeInTheDocument();
    });

    test('renders the collapsible section with correct data-testid', () => {
      render(<TodoCard />);
      const collapsibleSection = screen.getByTestId('test-todo-collapsible-section');
      expect(collapsibleSection).toBeInTheDocument();
    });

    test('renders the status control with correct data-testid', () => {
      render(<TodoCard />);
      const statusControl = screen.getByTestId('test-todo-status-control');
      expect(statusControl).toBeInTheDocument();
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

    test('checkbox is checked when status is Done', () => {
      render(<TodoCard status="Done" />);
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
      const statusControl = screen.getByTestId('test-todo-status-control');
      
      expect(statusControl).toHaveValue('In Progress');
      
      fireEvent.click(checkbox);
      expect(statusControl).toHaveValue('Done');
    });

    test('status reverts when checkbox is unchecked', () => {
      render(<TodoCard status="In Progress" />);
      const checkbox = screen.getByTestId('test-todo-complete-toggle');
      const statusControl = screen.getByTestId('test-todo-status-control');
      
      fireEvent.click(checkbox);
      expect(statusControl).toHaveValue('Done');
      
      fireEvent.click(checkbox);
      expect(statusControl).toHaveValue('In Progress');
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

  describe('Status Control', () => {
    test('status control has correct options', () => {
      render(<TodoCard status="Pending" />);
      const statusControl = screen.getByTestId('test-todo-status-control');
      
      const options = statusControl.querySelectorAll('option');
      expect(options).toHaveLength(3);
      expect(options[0]).toHaveTextContent('Pending');
      expect(options[1]).toHaveTextContent('In Progress');
      expect(options[2]).toHaveTextContent('Done');
    });

    test('status control reflects initial status', () => {
      render(<TodoCard status="In Progress" />);
      const statusControl = screen.getByTestId('test-todo-status-control');
      expect(statusControl).toHaveValue('In Progress');
    });

    test('changing status to Done checks the checkbox', () => {
      render(<TodoCard status="Pending" />);
      const statusControl = screen.getByTestId('test-todo-status-control');
      const checkbox = screen.getByTestId('test-todo-complete-toggle');
      
      expect(checkbox).not.toBeChecked();
      
      fireEvent.change(statusControl, { target: { value: 'Done' } });
      expect(checkbox).toBeChecked();
    });

    test('changing status from Done to other unchecks the checkbox', () => {
      render(<TodoCard status="Done" completed={true} />);
      const statusControl = screen.getByTestId('test-todo-status-control');
      const checkbox = screen.getByTestId('test-todo-complete-toggle');
      
      expect(checkbox).toBeChecked();
      
      fireEvent.change(statusControl, { target: { value: 'Pending' } });
      expect(checkbox).not.toBeChecked();
    });

    test('status control has accessible label', () => {
      render(<TodoCard />);
      const statusControl = screen.getByTestId('test-todo-status-control');
      expect(statusControl).toHaveAttribute('aria-label', 'Task status');
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

    test('displays "Completed" when status is Done', () => {
      render(<TodoCard status="Done" completed={true} />);
      const timeRemaining = screen.getByTestId('test-todo-time-remaining');
      expect(timeRemaining).toHaveTextContent('Completed');
    });

    test('time remaining has aria-live attribute', () => {
      render(<TodoCard />);
      const timeRemaining = screen.getByTestId('test-todo-time-remaining');
      expect(timeRemaining).toHaveAttribute('aria-live', 'polite');
    });
  });

  describe('Overdue Indicator', () => {
    test('shows overdue indicator when task is overdue', () => {
      const dueDate = new Date('2026-02-12T10:00:00');
      render(<TodoCard dueDate={dueDate} status="Pending" />);
      const overdueIndicator = screen.getByTestId('test-todo-overdue-indicator');
      expect(overdueIndicator).toBeInTheDocument();
      expect(overdueIndicator).toHaveTextContent('Overdue');
    });

    test('does not show overdue indicator when task is not overdue', () => {
      const dueDate = new Date('2026-02-18T17:00:00');
      render(<TodoCard dueDate={dueDate} />);
      const overdueIndicator = screen.queryByTestId('test-todo-overdue-indicator');
      expect(overdueIndicator).not.toBeInTheDocument();
    });

    test('does not show overdue indicator when task is completed', () => {
      const dueDate = new Date('2026-02-12T10:00:00');
      render(<TodoCard dueDate={dueDate} status="Done" />);
      const overdueIndicator = screen.queryByTestId('test-todo-overdue-indicator');
      expect(overdueIndicator).not.toBeInTheDocument();
    });

    test('card has overdue class when task is overdue', () => {
      const dueDate = new Date('2026-02-12T10:00:00');
      render(<TodoCard dueDate={dueDate} status="Pending" />);
      const card = screen.getByTestId('test-todo-card');
      expect(card).toHaveClass('overdue');
    });
  });

  describe('Edit Mode', () => {
    test('enters edit mode when edit button is clicked', () => {
      render(<TodoCard />);
      const editButton = screen.getByTestId('test-todo-edit-button');
      fireEvent.click(editButton);
      
      expect(screen.getByTestId('test-todo-edit-form')).toBeInTheDocument();
      expect(screen.getByTestId('test-todo-edit-title-input')).toBeInTheDocument();
      expect(screen.getByTestId('test-todo-edit-description-input')).toBeInTheDocument();
      expect(screen.getByTestId('test-todo-edit-priority-select')).toBeInTheDocument();
      expect(screen.getByTestId('test-todo-edit-due-date-input')).toBeInTheDocument();
      expect(screen.getByTestId('test-todo-save-button')).toBeInTheDocument();
      expect(screen.getByTestId('test-todo-cancel-button')).toBeInTheDocument();
    });

    test('edit form is populated with current values', () => {
      const testTitle = 'Test Title';
      const testDescription = 'Test Description';
      render(<TodoCard title={testTitle} description={testDescription} priority="medium" />);
      
      fireEvent.click(screen.getByTestId('test-todo-edit-button'));
      
      expect(screen.getByTestId('test-todo-edit-title-input')).toHaveValue(testTitle);
      expect(screen.getByTestId('test-todo-edit-description-input')).toHaveValue(testDescription);
      expect(screen.getByTestId('test-todo-edit-priority-select')).toHaveValue('medium');
    });

    test('save button exits edit mode', () => {
      render(<TodoCard />);
      fireEvent.click(screen.getByTestId('test-todo-edit-button'));
      
      expect(screen.getByTestId('test-todo-edit-form')).toBeInTheDocument();
      
      fireEvent.click(screen.getByTestId('test-todo-save-button'));
      
      expect(screen.queryByTestId('test-todo-edit-form')).not.toBeInTheDocument();
    });

    test('cancel button exits edit mode', () => {
      render(<TodoCard />);
      fireEvent.click(screen.getByTestId('test-todo-edit-button'));
      
      expect(screen.getByTestId('test-todo-edit-form')).toBeInTheDocument();
      
      fireEvent.click(screen.getByTestId('test-todo-cancel-button'));
      
      expect(screen.queryByTestId('test-todo-edit-form')).not.toBeInTheDocument();
    });

    test('edit form fields have labels', () => {
      const { container } = render(<TodoCard />);
      fireEvent.click(screen.getByTestId('test-todo-edit-button'));
      
      const titleInput = screen.getByTestId('test-todo-edit-title-input');
      const descriptionInput = screen.getByTestId('test-todo-edit-description-input');
      const prioritySelect = screen.getByTestId('test-todo-edit-priority-select');
      const dueDateInput = screen.getByTestId('test-todo-edit-due-date-input');
      
      expect(screen.getByLabelText('Title')).toBeInTheDocument();
      expect(titleInput).toHaveAttribute('id', 'edit-title');
      expect(container.querySelector('label[for="edit-title"]')).toBeInTheDocument();
      
      expect(screen.getByLabelText('Description')).toBeInTheDocument();
      expect(descriptionInput).toHaveAttribute('id', 'edit-description');
      expect(container.querySelector('label[for="edit-description"]')).toBeInTheDocument();
      
      expect(screen.getByLabelText('Priority')).toBeInTheDocument();
      expect(prioritySelect).toHaveAttribute('id', 'edit-priority');
      expect(container.querySelector('label[for="edit-priority"]')).toBeInTheDocument();
      
      expect(screen.getByLabelText('Due Date')).toBeInTheDocument();
      expect(dueDateInput).toHaveAttribute('id', 'edit-due-date');
      expect(container.querySelector('label[for="edit-due-date"]')).toBeInTheDocument();
    });

    test('onEdit callback is called when save is clicked', () => {
      const onEdit = vi.fn();
      render(<TodoCard onEdit={onEdit} title="Original Title" />);
      fireEvent.click(screen.getByTestId('test-todo-edit-button'));
      
      const titleInput = screen.getByTestId('test-todo-edit-title-input');
      fireEvent.change(titleInput, { target: { value: 'Updated Title' } });
      
      fireEvent.click(screen.getByTestId('test-todo-save-button'));
      
      expect(onEdit).toHaveBeenCalledTimes(1);
      expect(onEdit).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Updated Title'
      }));
    });
  });

  describe('Expand/Collapse', () => {
    test('shows expand toggle for long descriptions', () => {
      const longDescription = 'This is a very long description. '.repeat(20);
      render(<TodoCard description={longDescription} />);
      
      const expandToggle = screen.getByTestId('test-todo-expand-toggle');
      expect(expandToggle).toBeInTheDocument();
      expect(expandToggle).toHaveTextContent('Show more');
    });

    test('does not show expand toggle for short descriptions', () => {
      const shortDescription = 'Short description';
      render(<TodoCard description={shortDescription} />);
      
      const expandToggle = screen.queryByTestId('test-todo-expand-toggle');
      expect(expandToggle).not.toBeInTheDocument();
    });

    test('expand toggle shows full description when clicked', () => {
      const longDescription = 'This is a very long description. '.repeat(20);
      render(<TodoCard description={longDescription} />);
      
      const expandToggle = screen.getByTestId('test-todo-expand-toggle');
      fireEvent.click(expandToggle);
      
      expect(expandToggle).toHaveTextContent('Show less');
      expect(screen.getByTestId('test-todo-description')).toHaveTextContent(longDescription.trim());
    });

    test('expand toggle has correct aria attributes', () => {
      const longDescription = 'This is a very long description. '.repeat(20);
      render(<TodoCard description={longDescription} />);
      
      const expandToggle = screen.getByTestId('test-todo-expand-toggle');
      expect(expandToggle).toHaveAttribute('aria-expanded', 'false');
      expect(expandToggle).toHaveAttribute('aria-controls', 'todo-collapsible-section');
    });

    test('collapsible section has correct id', () => {
      render(<TodoCard />);
      const collapsibleSection = screen.getByTestId('test-todo-collapsible-section');
      expect(collapsibleSection).toHaveAttribute('id', 'todo-collapsible-section');
    });
  });

  describe('Priority Indicator', () => {
    test('priority indicator has correct style for high priority', () => {
      render(<TodoCard priority="high" />);
      const indicator = screen.getByTestId('test-todo-priority-indicator');
      expect(indicator).toBeInTheDocument();
    });

    test('card has priority class', () => {
      render(<TodoCard priority="high" />);
      const card = screen.getByTestId('test-todo-card');
      expect(card).toHaveClass('priority-high');
    });

    test('card has correct priority class for medium', () => {
      render(<TodoCard priority="medium" />);
      const card = screen.getByTestId('test-todo-card');
      expect(card).toHaveClass('priority-medium');
    });

    test('card has correct priority class for low', () => {
      render(<TodoCard priority="low" />);
      const card = screen.getByTestId('test-todo-card');
      expect(card).toHaveClass('priority-low');
    });
  });

  describe('Button Interactions', () => {
    test('edit button enters edit mode when clicked', () => {
      render(<TodoCard />);
      const editButton = screen.getByTestId('test-todo-edit-button');
      
      fireEvent.click(editButton);
      
      expect(screen.getByTestId('test-todo-edit-form')).toBeInTheDocument();
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

    test('priority indicator has aria-label', () => {
      render(<TodoCard priority="high" />);
      const indicator = screen.getByTestId('test-todo-priority-indicator');
      expect(indicator).toHaveAttribute('aria-label', 'high priority');
    });
  });

  describe('Default Props', () => {
    test('renders with default props when none provided', () => {
      render(<TodoCard />);
      
      expect(screen.getByTestId('test-todo-title')).toHaveTextContent('Complete project documentation');
      expect(screen.getByTestId('test-todo-description')).toBeInTheDocument();
      expect(screen.getByTestId('test-todo-priority')).toHaveTextContent('High Priority');
      expect(screen.getByTestId('test-todo-status-control')).toHaveValue('In Progress');
    });
  });

  describe('Keyboard Navigation', () => {
    test('expand toggle is keyboard accessible with Enter', () => {
      const longDescription = 'This is a very long description. '.repeat(20);
      render(<TodoCard description={longDescription} />);
      
      const expandToggle = screen.getByTestId('test-todo-expand-toggle');
      
      fireEvent.keyDown(expandToggle, { key: 'Enter', code: 'Enter' });
      expect(expandToggle).toHaveTextContent('Show less');
    });

    test('expand toggle is keyboard accessible with Space', () => {
      const longDescription = 'This is a very long description. '.repeat(20);
      render(<TodoCard description={longDescription} />);
      
      const expandToggle = screen.getByTestId('test-todo-expand-toggle');
      
      fireEvent.keyDown(expandToggle, { key: ' ', code: 'Space' });
      expect(expandToggle).toHaveTextContent('Show less');
    });
  });
});