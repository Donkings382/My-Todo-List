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

## What Changed from Initial TodoCard

This component has evolved from a basic static card to a fully interactive, accessible task management component:

### Core Functionality Enhancements
- **Added Live Time Updates**: Implemented automatic time remaining calculations that update every 30 seconds
- **Granular Time Display**: Changed from static due date to dynamic "Due in X days/hours/minutes" and "Overdue by X" formats
- **Status Management**: Added status dropdown with synchronization to completion checkbox
- **Edit Mode**: Added comprehensive edit form for title, description, priority, and due date
- **Delete Functionality**: Added delete button with callback support

### Interaction Improvements
- **Dual State Sync**: Checkbox and status dropdown now work together seamlessly
- **Previous Status Tracking**: Unchecking a completed task reverts to previous status instead of defaulting to "Pending"
- **Collapsible Descriptions**: Long descriptions automatically collapse with expand/collapse toggle

### Accessibility Enhancements
- **ARIA Labels**: Added comprehensive ARIA labels for all interactive elements
- **Live Regions**: Time remaining uses `aria-live="polite"` for screen reader announcements
- **Keyboard Navigation**: Full keyboard support including Enter/Space for expand toggle
- **Semantic HTML**: Proper use of `<article>`, `<time>`, `<h2>`, `<ul>`, `<button>` elements

### Visual Design Updates
- **Priority Indicators**: Added color-coded left border stripe
- **Overdue Styling**: Added visual and text indicators for overdue tasks
- **Status Badges**: Color-coded priority badges with proper formatting

### Testing Infrastructure
- **Comprehensive Test Suite**: Added 39 automated tests covering rendering, interactions, and accessibility
- **Fake Timer Support**: Tests use Vitest fake timers for reliable time-based testing
- **Data Test IDs**: Added consistent testid attributes for all interactive elements

## New Design Decisions

### Time Display Logic
- **Granular Time Formatting**: The `formatRelativeTime` function displays time in the largest applicable unit only (days > hours > minutes)
  - "Due in 2 days" (even if there are also 5 hours remaining)
  - "Due in 3 hours" (for same-day future dates)
  - "Due in 45 minutes" (for near-future dates)
  - "Overdue by 1 hour" (for past dates)
- **Update Interval**: Default is 30 seconds (configurable via `updateInterval` prop), balancing freshness with performance
- **Completed State**: Shows "Completed" instead of time remaining when task status is "Done"

### Component Architecture
- **Dual State Sync**: Checkbox and status dropdown are synchronized - checking the box sets status to "Done", and changing status to "Done" checks the box
- **Previous Status Tracking**: When unchecking a completed task, it reverts to the previous status (not just "Pending")
- **Collapsible Descriptions**: Descriptions over 150 characters are automatically collapsed with "Show more/Show less" toggle

### Visual Design
- **Priority Indicators**: Color-coded left border stripe (high: red, medium: orange, low: green)
- **Overdue Styling**: Cards get an "overdue" class and show an "Overdue" badge when past due date and not completed
- **Status Badges**: Color-coded priority badges with uppercase first letter

## Known Limitations

### Time Display
- **Single Unit Display**: Time shows only the largest unit (e.g., "Due in 2 days" instead of "Due in 2 days, 5 hours"). This is intentional for simplicity but may lack precision.
- **No Seconds Display**: For tasks due in less than a minute, it shows "Due in 0 minutes" rather than counting down by seconds.
- **Static Update Interval**: The interval is fixed at component mount time and cannot be dynamically changed without remounting the component.

### Component Scope
- **Single Task Focus**: Each `TodoCard` displays only one task. There's no built-in list management or bulk operations.
- **No Persistence**: Changes are not automatically saved to localStorage or a backend. The parent component must handle data persistence via callbacks.
- **Edit Form Limitations**: The edit form doesn't include tag editing or priority changes via the UI (though priority can be changed programmatically).

### Browser Compatibility
- **Modern Browsers Only**: Uses ES6+ features, CSS Grid, and CSS custom properties. Not tested on IE11 or older browsers.
- **DateTime Local Input**: The `datetime-local` input type may have inconsistent styling across browsers.

## Accessibility

### Keyboard Navigation
- **Tab Order**: Logical focus order: Checkbox → Title (non-interactive) → Description (non-interactive) → Priority Badge (non-interactive) → Due Date (non-interactive) → Time Remaining (non-interactive) → Status Select → Tags (non-interactive) → Edit Button → Delete Button
- **Interactive Elements**: All interactive elements (checkbox, status select, edit/delete buttons, expand toggle) are keyboard accessible
- **Enter/Space Support**: The expand/collapse toggle responds to both Enter and Space keys

### Screen Reader Support
- **ARIA Labels**: All interactive elements have descriptive `aria-label` attributes:
  - Checkbox: "Mark task as complete"
  - Status Select: "Task status"
  - Edit Button: "Edit task"
  - Delete Button: "Delete task"
  - Priority Indicator: "{priority} priority"
- **Live Regions**: Time remaining element uses `aria-live="polite"` to announce updates without interrupting the user
- **Semantic HTML**: Uses proper HTML5 elements (`<article>`, `<h2>`, `<time>`, `<ul>`, `<button>`) for meaningful structure
- **Role Attributes**: Card has `role="region"` and `aria-label="Todo item"` for clear identification

### Visual Accessibility
- **Color Contrast**: Meets WCAG AA standards for text and interactive elements
- **Focus Indicators**: Clear, visible focus styles for all interactive elements
- **Non-Color Cues**: Priority and status are indicated by both color and text labels
- **Overdue Indicator**: Uses both text ("Overdue") and visual styling (red color, badge) to convey urgency

### Cognitive Accessibility
- **Clear Language**: Simple, direct labels ("Edit", "Delete", "Show more", "Show less")
- **Consistent Layout**: Predictable card structure with consistent information placement
- **Progressive Disclosure**: Long descriptions are collapsed by default to reduce cognitive load

## Responsive Design

- **Mobile** (< 640px): Full-width card, stacked layout
- **Tablet/Desktop** (640px+): Max-width 600px, comfortable padding
- Tags wrap nicely with flex-wrap
- No horizontal overflow at any screen size

## License

ISC