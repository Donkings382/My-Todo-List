# Todo Item Card

A clean, high-fidelity Task Card component built with React. This serves as the core UI element for a productivity app, featuring polished interactions and full testability.

## Features

- **Priority Tabs**: Filter tasks by Low, Medium, or High priority
- **Interactive Checkbox**: Mark tasks as complete with visual feedback
- **Live Time Updates**: Automatically updates time remaining every 30 seconds
- **Human-Friendly Dates**: Displays due dates as "Due Feb 18, 2026", "Due in 3 days", or "Overdue by 2 hours"
- **Fully Responsive**: Works on mobile (320px) to desktop (1200px+)
- **Accessible**: WCAG AA compliant with keyboard navigation and screen reader support
- **Automated Tests**: 39 tests covering rendering, interactions, and accessibility

## Demo

### Priority Tasks
| Priority | Task | Status |
|----------|------|--------|
| High | Walk the dog | In Progress |
| Medium | Do the laundry | Pending |
| Low | Buy groceries | Pending |

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to http://localhost:5173
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm test` | Run automated tests (39 tests) |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Generate coverage report |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

## Project Structure

```
HNG_TODO_LIST/
├── index.html              # HTML entry point
├── style.css               # Global styles
├── package.json            # Project configuration
├── vite.config.js          # Vite & Vitest configuration
├── vitest.setup.js         # Test setup
├── README.md               # This file
└── src/
    ├── main.jsx            # React app with priority tabs
    ├── TodoCard.jsx        # Reusable TodoCard component
    ├── TodoCard.css        # Component styles
    └── TodoCard.test.jsx   # 39 automated tests
```

## Component Props

The `TodoCard` component accepts the following props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | string | "Complete project documentation" | Task title |
| `description` | string | "Write comprehensive..." | Task description |
| `priority` | 'low' \| 'medium' \| 'high' | 'high' | Task priority |
| `dueDate` | Date | Feb 18, 2026 | Due date |
| `tags` | string[] | ['Work', 'Documentation', 'API'] | Category tags |
| `status` | string | 'In Progress' | Task status |
| `completed` | boolean | false | Completion state |
| `onToggleComplete` | function | - | Callback when checkbox toggled |
| `onEdit` | function | - | Callback when edit clicked |
| `onDelete` | function | - | Callback when delete clicked |
| `updateInterval` | number | 30000 | Time update interval (ms) |

## Test Coverage

All 39 tests pass, covering:

- **Rendering** (16 tests): All elements render with correct data-testid
- **Checkbox Toggle** (7 tests): Checkbox state and callbacks
- **Time Remaining** (8 tests): Formatting and auto-updates
- **Button Interactions** (2 tests): Edit and delete callbacks
- **Accessibility** (5 tests): ARIA labels and semantic HTML
- **Default Props** (1 test): Default values render correctly

## Accessibility

- All interactive elements have proper ARIA labels
- Keyboard navigation: Tab → Checkbox → Edit → Delete
- Focus styles are visible and clear
- Screen reader compatible with semantic HTML
- WCAG AA color contrast compliant

## Responsive Design

- **Mobile** (< 640px): Full-width card, stacked layout
- **Tablet/Desktop** (640px+): Max-width 600px, comfortable padding
- Tags wrap nicely with flex-wrap
- No horizontal overflow at any screen size

## License

ISC