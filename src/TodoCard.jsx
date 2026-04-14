import React, { useState, useEffect, useCallback, useRef } from 'react';
import './TodoCard.css';

// Format relative time (human-friendly)
function formatRelativeTime(targetDate) {
  const now = new Date();
  const diff = targetDate - now;

  if (diff <= 0) {
    // Overdue
    const absDiff = Math.abs(diff);
    const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(absDiff / (1000 * 60 * 60));
    const minutes = Math.floor(absDiff / (1000 * 60));

    if (days > 0) {
      return `Overdue by ${days} day${days !== 1 ? 's' : ''}`;
    } else if (hours > 0) {
      return `Overdue by ${hours} hour${hours !== 1 ? 's' : ''}`;
    } else {
      return `Overdue by ${minutes} minute${minutes !== 1 ? 's' : ''}`;
    }
  } else {
    // Not yet due
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (days > 0) {
      return `Due in ${days} day${days !== 1 ? 's' : ''}`;
    } else if (hours > 0) {
      return `Due in ${hours} hour${hours !== 1 ? 's' : ''}`;
    } else {
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

// Format date for input field
function formatDateForInput(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

const STATUS_OPTIONS = ['Pending', 'In Progress', 'Done'];
const PRIORITY_OPTIONS = ['low', 'medium', 'high'];
const COLLAPSE_THRESHOLD = 150; // characters

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
  const [currentStatus, setCurrentStatus] = useState(status);
  const [timeRemaining, setTimeRemaining] = useState('');
  const [isOverdue, setIsOverdue] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Edit form state
  const [editForm, setEditForm] = useState({
    title,
    description,
    priority,
    dueDate: formatDateForInput(dueDate),
  });
  
  // Track previous status for reverting when unchecking
  const [previousStatus, setPreviousStatus] = useState(status);
  const editButtonRef = useRef(null);
  const collapsibleSectionId = 'todo-collapsible-section';

  // Update time remaining
  const updateTimeRemaining = useCallback(() => {
    if (isCompleted || currentStatus === 'Done') {
      setTimeRemaining('Completed');
      setIsOverdue(false);
      return;
    }
    
    const relativeTime = formatRelativeTime(dueDate);
    setTimeRemaining(relativeTime);
    setIsOverdue(dueDate <= new Date() && currentStatus !== 'Done');
  }, [dueDate, isCompleted, currentStatus]);

  useEffect(() => {
    updateTimeRemaining();
    const interval = setInterval(updateTimeRemaining, updateInterval);
    return () => clearInterval(interval);
  }, [updateTimeRemaining, updateInterval]);

  // Sync checkbox with status - only sync when status changes to/from Done
  useEffect(() => {
    if (currentStatus === 'Done' && !isCompleted) {
      setIsCompleted(true);
    }
  }, [currentStatus]);

  // Sync status when isCompleted changes externally (e.g., from completed prop)
  useEffect(() => {
    if (isCompleted && currentStatus !== 'Done') {
      setPreviousStatus(currentStatus);
      setCurrentStatus('Done');
    } else if (!isCompleted && currentStatus === 'Done') {
      setCurrentStatus(previousStatus || 'Pending');
    }
  }, [isCompleted]);

  const handleCheckboxChange = () => {
    const newCompletedState = !isCompleted;
    setIsCompleted(newCompletedState);
    
    if (newCompletedState) {
      setPreviousStatus(currentStatus);
      setCurrentStatus('Done');
    } else {
      setCurrentStatus(previousStatus || 'Pending');
    }
    
    if (onToggleComplete) {
      onToggleComplete(newCompletedState);
    }
  };

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    
    if (newStatus === 'Done') {
      setPreviousStatus(currentStatus);
      setIsCompleted(true);
    } else if (currentStatus === 'Done' && newStatus !== 'Done') {
      setIsCompleted(false);
    }
    
    setCurrentStatus(newStatus);
  };

  const handleEditClick = () => {
    setEditForm({
      title,
      description,
      priority,
      dueDate: formatDateForInput(dueDate),
    });
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    // Update the component state with new values
    setIsEditing(false);
    if (onEdit) {
      onEdit(editForm);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Return focus to edit button
    if (editButtonRef.current) {
      editButtonRef.current.focus();
    }
  };

  const handleDeleteClick = () => {
    if (onDelete) {
      onDelete();
    }
  };

  const handleExpandToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const shouldCollapse = description.length > COLLAPSE_THRESHOLD;
  const displayDescription = shouldCollapse && !isExpanded 
    ? description.substring(0, COLLAPSE_THRESHOLD) + '...' 
    : description;

  const priorityClass = `priority-${priority.toLowerCase()}`;
  const statusClass = `status-${currentStatus.toLowerCase().replace(/\s+/g, '-')}`;
  const isDone = isCompleted || currentStatus === 'Done';

  // Priority indicator styles
  const getPriorityIndicatorStyle = () => {
    switch (priority.toLowerCase()) {
      case 'high':
        return { backgroundColor: 'var(--high-priority)' };
      case 'medium':
        return { backgroundColor: 'var(--medium-priority)' };
      case 'low':
        return { backgroundColor: 'var(--low-priority)' };
      default:
        return { backgroundColor: 'var(--text-light)' };
    }
  };

  if (isEditing) {
    return (
      <article
        className={`todo-card ${isDone ? 'completed' : ''}`}
        data-testid="test-todo-card"
        role="region"
        aria-label="Todo item"
      >
        <div
          className="todo-edit-form"
          data-testid="test-todo-edit-form"
        >
          <h3 className="edit-form-title">Edit Task</h3>
          
          <div className="form-group">
            <label htmlFor="edit-title" className="form-label">
              Title
            </label>
            <input
              id="edit-title"
              type="text"
              className="form-input"
              data-testid="test-todo-edit-title-input"
              value={editForm.title}
              onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label htmlFor="edit-description" className="form-label">
              Description
            </label>
            <textarea
              id="edit-description"
              className="form-textarea"
              data-testid="test-todo-edit-description-input"
              value={editForm.description}
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              rows={4}
            />
          </div>

          <div className="form-group">
            <label htmlFor="edit-priority" className="form-label">
              Priority
            </label>
            <select
              id="edit-priority"
              className="form-select"
              data-testid="test-todo-edit-priority-select"
              value={editForm.priority}
              onChange={(e) => setEditForm({ ...editForm, priority: e.target.value })}
            >
              {PRIORITY_OPTIONS.map((p) => (
                <option key={p} value={p}>
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="edit-due-date" className="form-label">
              Due Date
            </label>
            <input
              id="edit-due-date"
              type="datetime-local"
              className="form-input"
              data-testid="test-todo-edit-due-date-input"
              value={editForm.dueDate}
              onChange={(e) => setEditForm({ ...editForm, dueDate: e.target.value })}
            />
          </div>

          <div className="edit-form-actions">
            <button
              className="btn btn-save"
              data-testid="test-todo-save-button"
              onClick={handleSaveEdit}
            >
              Save
            </button>
            <button
              className="btn btn-cancel"
              data-testid="test-todo-cancel-button"
              onClick={handleCancelEdit}
            >
              Cancel
            </button>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      className={`todo-card ${isDone ? 'completed' : ''} ${isOverdue ? 'overdue' : ''} priority-${priority.toLowerCase()}`}
      data-testid="test-todo-card"
      role="region"
      aria-label="Todo item"
    >
      {/* Priority Indicator */}
      <div
        className="priority-indicator"
        data-testid="test-todo-priority-indicator"
        style={getPriorityIndicatorStyle()}
        aria-label={`${priority} priority`}
      />

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

      {/* Description with Expand/Collapse */}
      <div
        className={`todo-description-wrapper ${shouldCollapse ? 'collapsible' : ''}`}
        data-testid="test-todo-collapsible-section"
        id={collapsibleSectionId}
      >
        <p className="todo-description" data-testid="test-todo-description">
          {displayDescription}
        </p>
        {shouldCollapse && (
          <button
            type="button"
            className="expand-toggle"
            data-testid="test-todo-expand-toggle"
            onClick={handleExpandToggle}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleExpandToggle();
              }
            }}
            aria-expanded={isExpanded}
            aria-controls={collapsibleSectionId}
          >
            {isExpanded ? 'Show less' : 'Show more'}
          </button>
        )}
      </div>

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
          aria-live="polite"
        >
          {timeRemaining}
        </time>

        {/* Overdue Indicator */}
        {isOverdue && !isDone && (
          <span
            className="overdue-indicator"
            data-testid="test-todo-overdue-indicator"
          >
            Overdue
          </span>
        )}

        {/* Status Control */}
        <div className="status-control-wrapper">
          <label htmlFor="status-control" className="visually-hidden">
            Task status
          </label>
          <select
            id="status-control"
            className="status-control"
            data-testid="test-todo-status-control"
            value={currentStatus}
            onChange={handleStatusChange}
            aria-label="Task status"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
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
          ref={editButtonRef}
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