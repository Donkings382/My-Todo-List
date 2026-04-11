import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import TodoCard from './TodoCard';
import './TodoCard.css';

// Task data organized by priority
const tasksByPriority = {
  high: {
    title: 'Walk the dog',
    description: 'Take the dog for a 30-minute walk around the neighborhood.',
    priority: 'high',
    dueDate: new Date('2026-02-16T19:00:00'),
    tags: ['Pets', 'Exercise'],
    status: 'In Progress',
  },
  medium: {
    title: 'Do the laundry',
    description: 'Wash, dry, and fold all dirty clothes. Separate colors and whites.',
    priority: 'medium',
    dueDate: new Date('2026-02-17T18:00:00'),
    tags: ['Household', 'Chores'],
    status: 'Pending',
  },
  low: {
    title: 'Buy groceries',
    description: 'Get milk, eggs, bread, vegetables, and other essentials from the supermarket.',
    priority: 'low',
    dueDate: new Date('2026-02-18T20:00:00'),
    tags: ['Shopping', 'Food'],
    status: 'Pending',
  },
};

function App() {
  const [selectedPriority, setSelectedPriority] = useState('high');
  const currentTask = tasksByPriority[selectedPriority];

  const handleToggleComplete = (completed) => {
    console.log(`Task "${currentTask.title}" completion status:`, completed);
  };

  const handleEdit = () => {
    alert('Edit clicked');
  };

  const handleDelete = () => {
    alert('Delete clicked');
  };

  const priorities = ['low', 'medium', 'high'];
  const priorityLabels = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
  };

  return (
    <main className="app-container">
      {/* Priority Tabs */}
      <div className="priority-tabs" role="tablist" aria-label="Filter by priority">
        {priorities.map((priority) => (
          <button
            key={priority}
            className={`priority-tab priority-tab-${priority} ${
              selectedPriority === priority ? 'active' : ''
            }`}
            role="tab"
            aria-selected={selectedPriority === priority}
            aria-controls="todo-card-panel"
            id={`tab-${priority}`}
            onClick={() => setSelectedPriority(priority)}
            data-testid={`test-priority-tab-${priority}`}
          >
            {priorityLabels[priority]}
          </button>
        ))}
      </div>

      {/* Todo Card */}
      <div
        id="todo-card-panel"
        role="tabpanel"
        aria-labelledby={`tab-${selectedPriority}`}
      >
        <TodoCard
          title={currentTask.title}
          description={currentTask.description}
          priority={currentTask.priority}
          dueDate={currentTask.dueDate}
          tags={currentTask.tags}
          status={currentTask.status}
          onToggleComplete={handleToggleComplete}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </main>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);