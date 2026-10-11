# TaskSpace — Student Task Management System

TaskSpace is a web-based task management application designed to help students organize assignments, manage project deadlines, track progress, and maintain a clear record of task-related activities.

The application provides a centralized dashboard with multiple ways to view and manage tasks, making it easier to plan academic and project work.

## Features

### 1. Dashboard

* View total tasks, pending tasks, tasks in progress, and completed tasks.
* Track overdue tasks.
* Get an overview of current work.

### 2. Task Management

* Create new tasks.
* Edit existing task details.
* Delete tasks with confirmation.
* Assign a project, team member, due date, priority, and status to each task.

### 3. Kanban Board

* Organize tasks into three columns:

  * To Do
  * In Progress
  * Completed
* Update task status directly from the board.

### 4. Table View

* View task details in a structured table.
* Update task status.
* Open task comments and edit or delete tasks.

### 5. Search, Filters, and Sorting

* Search tasks by title, project, or assignee.
* Filter tasks by status, priority, project, and assignee.
* Sort tasks by due date and priority.

### 6. Overdue Task Tracking

* Identify unfinished tasks whose due dates have passed.
* Highlight overdue tasks to help prioritize work.

### 7. Task Comments

* Add comments to individual tasks.
* View previous comments associated with each task.
* Keep task-related notes together.

### 8. Activity Log

* Record task creation and editing.
* Track task status changes.
* Record task deletion and comment activity.
* Review recent activity in the dashboard.

### 9. Local Data Persistence

* Save tasks, comments, and activity history using browser localStorage.
* Retain saved data after refreshing the browser.

## Technology Stack

* **Next.js** — React-based web application framework.
* **React** — Component-based user interface.
* **TypeScript** — Type safety and more maintainable code.
* **Bootstrap 5** — Responsive layout and styling.
* **localStorage** — Browser-based data persistence.

## Project Structure

```text
student task manager/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── context/
│   └── TaskContext.tsx
├── public/
├── package.json
├── package-lock.json
├── tsconfig.json
├── next.config.ts
├── .gitignore
└── README.md
```

The project may contain additional configuration and documentation files depending on the development setup.

## Installation and Setup

### Prerequisites

Install Node.js and npm before running the project.

Verify the installation:

```bash
node -v
npm -v
```

### Step 1: Open the Project

Open the project folder in Visual Studio Code.

### Step 2: Install Dependencies

Open the terminal in the project directory and run:

```bash
npm install
```

### Step 3: Start the Development Server

```bash
npm run dev
```

### Step 4: Open the Application

Open the following address in your browser:

http://localhost:3000

## How to Use TaskSpace

1. Open the dashboard and review the task statistics.
2. Create a task by entering its title, project, assignee, due date, priority, and status.
3. View tasks using the Kanban board or table view.
4. Use search, filters, and sorting to find specific tasks.
5. Update task status as work progresses.
6. Open a task's details to add and view comments.
7. Review the activity log to track recorded changes.
8. Refresh the browser to verify that task data persists.

## Testing

The following areas should be tested before release:

* Task creation, editing, and deletion.
* Task status updates.
* Kanban and table view switching.
* Search, filters, and sorting.
* Overdue task indicators.
* Adding and viewing task comments.
* Activity log entries.
* Data persistence after a browser refresh.
* Successful production build.

Run the production build check using:

```bash
npm run build
```

## Current Limitations

* Data is stored in the browser using localStorage.
* Data is not automatically synchronized between different devices or users.
* The current version does not include user authentication or a shared backend database.
* The comment author is currently predefined in the application.

## Future Enhancements

* Database integration for shared data storage.
* User authentication and role-based access.
* Real-time team collaboration.
* Subtasks and checklists.
* Notifications and deadline reminders.
* Advanced project analytics.

## Contributed
-Ankush Shetty

## Conclusion

TaskSpace provides a structured way to manage student tasks, monitor deadlines, organize work, record comments, and track activity. It combines task management with a dashboard, Kanban board, table view, and browser-based persistence to support academic and team projects.

---


