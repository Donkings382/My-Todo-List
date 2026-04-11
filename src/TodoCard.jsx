import React, { useState, useEffect, useCallback } from 'react';
import './TodoCard.css';

// Format relative time (human-friendly)
function formatRelativeTime(targetDate) {
  const now = new Date();
  const diff = targetDate - now;

  if (diff <= 0) {
    // Overdue
    const absDiff = Math.abs(diff);
    const hours = Math.floor(absDiff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `Overdue by ${days} day${days !== 1 ? 's' : ''}`;
    } else if (hours > 0) {
      return `Overdue by ${hours} hour${hours !== 1 ? 's' : ''}`;
    } else {
      const minutes = Math.floor(absDiff / (1000 * 60));
      return `Overdue by ${minutes} minute${minutes !== 1 ? 's' : ''}`;
    }
  } else {
    // Not yet due
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `Due in ${days} day${days !== 1 ? 's' : ''}`;
    } else if (hours > 0) {
      return `Due in ${hours} hour${hours !== 1 ? 's' : ''}`;
    } else {
      const minutes = Math.floor(diff / (1000 * 60));
      return `Due in ${minutes} minute${minutes !== 1 ? 's' : ''}`;
    }
  }
}

// Format due date for display
function formatDueDate(date) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  return `Due ${month} ${day}, ${year}`;
}

function TodoCard({
  title = "Complete project documentation",
  description = "Write comprehensive documentation for the new API endpoints including usage examples, parameter descriptions, and error handling guidelines.",
  priority = "high",
  dueDate = new Date('2026-02-18T17:00:00'),
  tags = ["Work", "Documentation", "API"],
  status = "In Progress",
  completed = false,
  onToggleComplete,
  onEdit,
  onDelete,
  updateInterval = 30000,
}) {
  const [isCompleted, setIsCompleted] = useState(completed);
  const [timeRemaining, setTimeRemaining] = useState('');
  const [isOverdue, setIsOverdue] = useState(false);

  const updateTimeRemaining = useCallback(() => {
    const relativeTime = formatRelativeTime(dueDate);
    setTimeRemaining(relativeTime);
    setIsOverdue(dueDate <= new Date());
  }, [dueDate]);

  useEffect(() => {
    updateTimeRemaining();
    const interval = setInterval(updateTimeRemaining, updateInterval);
    return () => clearInterval(interval);
  }, [updateTimeRemaining, updateInterval]);

  const handleCheckboxChange = () => {
    const newCompletedState = !isCompleted;
    setIsCompleted(newCompletedState);
    if (onToggleComplete) {
      onToggleComplete(newCompletedState);
    }
  };

  const handleEditClick = () => {
    if (onEdit) {
      onEdit();
    }
  };

  const handleDeleteClick = () => {
    if (onDelete) {
      onDelete();
    }
  };

  const priorityClass = `priority-${priority.toLowerCase()}`;
  const statusClass = `status-${status.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <article
      className={`todo-card ${isCompleted ? 'completed' : ''}`}
      data-testid="test-todo-card"
      role="region"
      aria-label="Todo item"
    >
      {/* Header Section with Checkbox and Title */}
      <div className="todo-header">
        <label className="checkbox-container">
          <input
            type="checkbox"
            data-testid="test-todo-complete-toggle"
            aria-label="Mark task as complete"
            checked={isCompleted}
            onChange={handleCheckboxChange}
          />
          <span className="checkmark"></span>
        </label>
        <h2 className="todo-title" data-testid="test-todo-title">
          {title}
        </h2>
      </div>

      {/* Description */}
      <p className="todo-description" data-testid="test-todo-description">
        {description}
      </p>

      {/* Meta Information Row */}
      <div className="todo-meta">
        {/* Priority Badge */}
        <span
          className={`priority-badge ${priorityClass}`}
          data-testid="test-todo-priority"
        >
          {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
        </span>

        {/* Due Date */}
        <time
          className="due-date"
          data-testid="test-todo-due-date"
          dateTime={dueDate.toISOString()}
        >
          {formatDueDate(dueDate)}
        </time>

        {/* Time Remaining */}
        <time
          className={`time-remaining ${isOverdue ? 'overdue' : ''}`}
          data-testid="test-todo-time-remaining"
          dateTime={timeRemaining}
        >
          {timeRemaining}
        </time>

        {/* Status Indicator */}
        <span
          className={`status-indicator ${statusClass}`}
          data-testid="test-todo-status"
        >
          {isCompleted ? 'Completed' : status}
        </span>
      </div>

      {/* Tags/Categories */}
      <ul
        className="tags-list"
        role="list"
        data-testid="test-todo-tags"
        aria-label="Task categories"
      >
        {tags.map((tag) => (
          <li
            key={tag}
            data-testid={`test-todo-tag-${tag.toLowerCase()}`}
          >
            {tag}
          </li>
        ))}
      </ul>

      {/* Action Buttons */}
      <div className="todo-actions">
        <button
          className="btn btn-edit"
          data-testid="test-todo-edit-button"
          aria-label="Edit task"
          onClick={handleEditClick}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          Edit
        </button>
        <button
          className="btn btn-delete"
          data-testid="test-todo-delete-button"
          aria-label="Delete task"
          onClick={handleDeleteClick}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            <line x1="10" y1="11" x2="10" y2="17" />
            <line x1="14" y1="11" x2="14" y2="17" />
          </svg>
          Delete
        </button>
      </div>
    </article>
  );
}

export default TodoCard;