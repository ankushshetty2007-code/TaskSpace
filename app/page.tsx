
"use client";

import { useState, type FormEvent } from "react";
import {
  TaskProvider,
  useTasks,
  type Task,
} from "../context/TaskContext";

const statuses: Task["status"][] = [
  "To Do",
  "In Progress",
  "Completed",
];

const priorities: Task["priority"][] = [
  "High",
  "Medium",
  "Low",
];

const projects = ["College", "Skill 60", "Personal"];
const assignees = ["Ankush", "Rahul", "Priya"];

type SortOption =
  | "none"
  | "due-asc"
  | "due-desc"
  | "priority-high"
  | "priority-low";

function getLocalDateString() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function isOverdue(task: Task) {
  return (
    task.status !== "Completed" &&
    task.dueDate !== "" &&
    task.dueDate < getLocalDateString()
  );
}

function Dashboard() {
  const {
    tasks,
    addTask,
    editTask,
    updateTaskStatus,
    deleteTask,
  } = useTasks();

  const [view, setView] = useState<"board" | "table">("board");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Filter controls
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [projectFilter, setProjectFilter] = useState("All");
  const [assigneeFilter, setAssigneeFilter] = useState("All");
  const [sortBy, setSortBy] = useState<SortOption>("none");

  // Task form
  const [title, setTitle] = useState("");
  const [project, setProject] = useState("College");
  const [assignee, setAssignee] = useState("Ankush");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] =
    useState<Task["priority"]>("Medium");
  const [status, setStatus] = useState<Task["status"]>("To Do");

  // Dashboard statistics use all tasks, not only filtered tasks.
  const total = tasks.length;
  const todo = tasks.filter((t) => t.status === "To Do").length;
  const progress = tasks.filter(
    (t) => t.status === "In Progress"
  ).length;
  const completed = tasks.filter(
    (t) => t.status === "Completed"
  ).length;
  const overdueCount = tasks.filter(isOverdue).length;

  // Search and filter tasks.
  const filteredTasks = tasks.filter((task) => {
    const searchText =
      `${task.title} ${task.project} ${task.assignee}`.toLowerCase();

    const matchesSearch = searchText.includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || task.status === statusFilter;
    const matchesPriority =
      priorityFilter === "All" || task.priority === priorityFilter;
    const matchesProject =
      projectFilter === "All" || task.project === projectFilter;
    const matchesAssignee =
      assigneeFilter === "All" || task.assignee === assigneeFilter;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesPriority &&
      matchesProject &&
      matchesAssignee
    );
  });

  // Sort a copy of the filtered tasks.
  const priorityRank: Record<Task["priority"], number> = {
    High: 3,
    Medium: 2,
    Low: 1,
  };

  const visibleTasks = [...filteredTasks].sort((a, b) => {
    switch (sortBy) {
      case "due-asc":
        return a.dueDate.localeCompare(b.dueDate);
      case "due-desc":
        return b.dueDate.localeCompare(a.dueDate);
      case "priority-high":
        return priorityRank[b.priority] - priorityRank[a.priority];
      case "priority-low":
        return priorityRank[a.priority] - priorityRank[b.priority];
      default:
        return 0;
    }
  });

  function resetFilters() {
    setSearch("");
    setStatusFilter("All");
    setPriorityFilter("All");
    setProjectFilter("All");
    setAssigneeFilter("All");
    setSortBy("none");
  }

  function resetForm() {
    setTitle("");
    setProject("College");
    setAssignee("Ankush");
    setDueDate("");
    setPriority("Medium");
    setStatus("To Do");
    setEditingTask(null);
    setShowForm(false);
  }

  function openCreateForm() {
    resetForm();
    setShowForm(true);
  }

  function openEditForm(task: Task) {
    setEditingTask(task);
    setTitle(task.title);
    setProject(task.project);
    setAssignee(task.assignee);
    setDueDate(task.dueDate);
    setPriority(task.priority);
    setStatus(task.status);
    setShowForm(true);

    window.setTimeout(() => {
      document
        .getElementById("add-task")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!title.trim() || !dueDate) return;

    const taskData = {
      title: title.trim(),
      project,
      assignee,
      dueDate,
      priority,
      status,
    };

    if (editingTask) {
      editTask(editingTask.id, taskData);
    } else {
      addTask(taskData);
    }

    resetForm();
  }

  function priorityClass(value: Task["priority"]) {
    if (value === "High") return "kanban-priority-high";
    if (value === "Medium") return "kanban-priority-medium";
    return "kanban-priority-low";
  }

  function statusClass(value: Task["status"]) {
    if (value === "To Do") return "kanban-status-todo";
    if (value === "In Progress") return "kanban-status-progress";
    return "kanban-status-completed";
  }

  function handleDelete(task: Task) {
    if (window.confirm(`Delete "${task.title}"?`)) {
      deleteTask(task.id);

      if (editingTask?.id === task.id) {
        resetForm();
      }
    }
  }

  function renderOverdue(task: Task) {
    if (!isOverdue(task)) return null;

    return (
      <span className="badge text-bg-danger ms-2">
        Overdue
      </span>
    );
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <aside className="col-md-2 taskspace-sidebar p-4">
          <div className="taskspace-brand mb-5">TaskSpace.</div>

          <p className="small text-uppercase taskspace-muted fw-bold">
            Workspace
          </p>

          <a href="#dashboard" className="taskspace-nav-link active">
            ◫ Dashboard
          </a>

          <a
            href="#tasks"
            className="taskspace-nav-link"
            onClick={() => setView("board")}
          >
            ▦ Kanban Board
          </a>

          <a
            href="#tasks"
            className="taskspace-nav-link"
            onClick={() => setView("table")}
          >
            ☷ All Tasks
          </a>

          <a
            href="#add-task"
            className="taskspace-nav-link"
            onClick={openCreateForm}
          >
            ＋ Add Task
          </a>

          <hr className="my-4" />

          <p className="small taskspace-muted">
            Plan better. Work smarter. Finish strong.
          </p>

          <div className="mt-4 fw-semibold">Ankush Shetty</div>
          <div className="small taskspace-muted">
            Student workspace
          </div>
        </aside>

        <main
          className="col-md-10 p-3 p-lg-5"
          id="dashboard"
        >
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
            <div>
              <p className="small taskspace-muted mb-1">
                MY WORKSPACE
              </p>
              <h2 className="fw-bold mb-1">
                Good evening, Ankush 👋
              </h2>
              <p className="taskspace-muted mb-0">
                Plan your work and make today productive.
              </p>
            </div>

            <button
              className="btn btn-primary px-4 py-2"
              onClick={openCreateForm}
            >
              + New Task
            </button>
          </div>

          {/* Dashboard statistics */}
          <div className="row g-3 mb-4">
            <StatCard title="Total Tasks" value={total} />
            <StatCard title="To Do" value={todo} />
            <StatCard title="In Progress" value={progress} />
            <StatCard title="Completed" value={completed} />
            <StatCard title="Overdue" value={overdueCount} />
          </div>

          {/* Create and edit task form */}
          {showForm && (
            <section
              className="taskspace-card p-3 p-lg-4 mb-4"
              id="add-task"
            >
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h5 className="fw-bold mb-1">
                    {editingTask ? "Edit Task" : "Create a New Task"}
                  </h5>
                  <p className="taskspace-muted small mb-0">
                    {editingTask
                      ? "Update the details and save your changes."
                      : "Fill in the details to add a task to your board."}
                  </p>
                </div>

                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close task form"
                  onClick={resetForm}
                />
              </div>

              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-lg-4">
                    <label htmlFor="task-title" className="form-label">
                      Task name
                    </label>
                    <input
                      id="task-title"
                      className="form-control"
                      placeholder="e.g. Complete DSA assignment"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div className="col-lg-2 col-sm-6">
                    <label htmlFor="task-project" className="form-label">
                      Project
                    </label>
                    <select
                      id="task-project"
                      className="form-select"
                      value={project}
                      onChange={(e) => setProject(e.target.value)}
                    >
                      {projects.map((option) => (
                        <option key={option}>{option}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-lg-2 col-sm-6">
                    <label htmlFor="task-assignee" className="form-label">
                      Assignee
                    </label>
                    <select
                      id="task-assignee"
                      className="form-select"
                      value={assignee}
                      onChange={(e) => setAssignee(e.target.value)}
                    >
                      {assignees.map((option) => (
                        <option key={option}>{option}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-lg-2 col-sm-6">
                    <label htmlFor="task-date" className="form-label">
                      Due date
                    </label>
                    <input
                      id="task-date"
                      type="date"
                      className="form-control"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      required
                    />
                  </div>

                  <div className="col-lg-2 col-sm-6">
                    <label htmlFor="task-priority" className="form-label">
                      Priority
                    </label>
                    <select
                      id="task-priority"
                      className="form-select"
                      value={priority}
                      onChange={(e) =>
                        setPriority(e.target.value as Task["priority"])
                      }
                    >
                      {priorities.map((option) => (
                        <option key={option}>{option}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-lg-3 col-sm-6">
                    <label htmlFor="task-status" className="form-label">
                      Status
                    </label>
                    <select
                      id="task-status"
                      className="form-select"
                      value={status}
                      onChange={(e) =>
                        setStatus(e.target.value as Task["status"])
                      }
                    >
                      {statuses.map((option) => (
                        <option key={option}>{option}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-12 d-flex justify-content-end gap-2 mt-4">
                    <button
                      type="button"
                      className="btn btn-outline-secondary px-4"
                      onClick={resetForm}
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="btn btn-primary px-4"
                    >
                      {editingTask ? "Save Changes" : "Create Task"}
                    </button>
                  </div>
                </div>
              </form>
            </section>
          )}

          {/* Tasks area */}
          <section id="tasks">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3">
              <div>
                <h4 className="fw-bold mb-1">
                  {view === "board" ? "Kanban Board" : "All Tasks"}
                </h4>
                <p className="taskspace-muted small mb-0">
                  Showing {visibleTasks.length} of {tasks.length} tasks
                </p>
              </div>

              <div className="d-flex gap-2 flex-wrap">
                <button
                  className={`btn ${
                    view === "board"
                      ? "btn-primary"
                      : "btn-outline-secondary"
                  }`}
                  onClick={() => setView("board")}
                >
                  ▦ Board
                </button>

                <button
                  className={`btn ${
                    view === "table"
                      ? "btn-primary"
                      : "btn-outline-secondary"
                  }`}
                  onClick={() => setView("table")}
                >
                  ☷ Table
                </button>
              </div>
            </div>

            {/* Search, filters, and sorting */}
            <div className="taskspace-card p-3 mb-4">
              <h6 className="fw-bold mb-3">Search, Filter & Sort</h6>

              <div className="row g-3">
                <div className="col-12 col-md-6 col-xl-4">
                  <label htmlFor="task-search" className="form-label">
                    Search
                  </label>
                  <input
                    id="task-search"
                    className="form-control"
                    placeholder="Search title, project, assignee..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                <div className="col-6 col-md-3 col-xl-2">
                  <label htmlFor="filter-status" className="form-label">
                    Status
                  </label>
                  <select
                    id="filter-status"
                    className="form-select"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="All">All statuses</option>
                    {statuses.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </div>

                <div className="col-6 col-md-3 col-xl-2">
                  <label htmlFor="filter-priority" className="form-label">
                    Priority
                  </label>
                  <select
                    id="filter-priority"
                    className="form-select"
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                  >
                    <option value="All">All priorities</option>
                    {priorities.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </div>

                <div className="col-6 col-md-3 col-xl-2">
                  <label htmlFor="filter-project" className="form-label">
                    Project
                  </label>
                  <select
                    id="filter-project"
                    className="form-select"
                    value={projectFilter}
                    onChange={(e) => setProjectFilter(e.target.value)}
                  >
                    <option value="All">All projects</option>
                    {projects.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </div>

                <div className="col-6 col-md-3 col-xl-2">
                  <label htmlFor="filter-assignee" className="form-label">
                    Assignee
                  </label>
                  <select
                    id="filter-assignee"
                    className="form-select"
                    value={assigneeFilter}
                    onChange={(e) => setAssigneeFilter(e.target.value)}
                  >
                    <option value="All">All assignees</option>
                    {assignees.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </div>

                <div className="col-12 col-md-6 col-xl-5">
                  <label htmlFor="sort-tasks" className="form-label">
                    Sort by
                  </label>
                  <select
                    id="sort-tasks"
                    className="form-select"
                    value={sortBy}
                    onChange={(e) =>
                      setSortBy(e.target.value as SortOption)
                    }
                  >
                    <option value="none">Default order</option>
                    <option value="due-asc">Due date: earliest first</option>
                    <option value="due-desc">Due date: latest first</option>
                    <option value="priority-high">
                      Priority: High to Low
                    </option>
                    <option value="priority-low">
                      Priority: Low to High
                    </option>
                  </select>
                </div>

                <div className="col-12 col-md-6 col-xl-7 d-flex align-items-end justify-content-md-end">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={resetFilters}
                  >
                    Reset Search & Filters
                  </button>
                </div>
              </div>

              {overdueCount > 0 && (
                <p className="small text-danger mt-3 mb-0">
                  <strong>{overdueCount}</strong>{" "}
                  overdue {overdueCount === 1 ? "task needs" : "tasks need"}{" "}
                  attention. Completed tasks are excluded.
                </p>
              )}
            </div>

            {/* Kanban board */}
            {view === "board" && (
              <div className="row g-3 align-items-start">
                {statuses.map((columnStatus) => {
                  const columnTasks = visibleTasks.filter(
                    (task) => task.status === columnStatus
                  );

                  return (
                    <div className="col-12 col-lg-4" key={columnStatus}>
                      <div className="kanban-column">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <div className="d-flex align-items-center gap-2">
                            <span
                              className={`kanban-dot ${statusClass(
                                columnStatus
                              )}`}
                            />
                            <h6 className="fw-bold mb-0">
                              {columnStatus}
                            </h6>
                          </div>

                          <span className="kanban-count">
                            {columnTasks.length}
                          </span>
                        </div>

                        <div className="d-flex flex-column gap-3">
                          {columnTasks.map((task) => (
                            <article
                              className="kanban-card"
                              key={task.id}
                            >
                              <div className="d-flex justify-content-between align-items-start gap-2 mb-3">
                                <div className="d-flex flex-wrap gap-1">
                                  <span
                                    className={`kanban-priority ${priorityClass(
                                      task.priority
                                    )}`}
                                  >
                                    {task.priority} Priority
                                  </span>
                                  {renderOverdue(task)}
                                </div>

                                <button
                                  type="button"
                                  className="btn-close"
                                  style={{ fontSize: "0.65rem" }}
                                  aria-label={`Delete ${task.title}`}
                                  onClick={() => handleDelete(task)}
                                />
                              </div>

                              <h6 className="fw-bold kanban-task-title">
                                {task.title}
                              </h6>

                              <p className="small taskspace-muted mb-3">
                                {task.project}
                              </p>

                              <div className="kanban-details">
                                <div>
                                  <span className="taskspace-muted">
                                    Due date
                                  </span>
                                  <div
                                    className={
                                      isOverdue(task)
                                        ? "fw-bold text-danger"
                                        : "fw-semibold"
                                    }
                                  >
                                    {task.dueDate}
                                  </div>
                                </div>

                                <div className="text-end">
                                  <span className="taskspace-muted">
                                    Assignee
                                  </span>
                                  <div className="fw-semibold">
                                    {task.assignee}
                                  </div>
                                </div>
                              </div>

                              <div className="mt-3 pt-3 border-top">
                                <label
                                  className="form-label small taskspace-muted"
                                  htmlFor={`status-${task.id}`}
                                >
                                  Move task
                                </label>

                                <select
                                  id={`status-${task.id}`}
                                  className="form-select form-select-sm"
                                  value={task.status}
                                  onChange={(e) =>
                                    updateTaskStatus(
                                      task.id,
                                      e.target.value as Task["status"]
                                    )
                                  }
                                >
                                  {statuses.map((option) => (
                                    <option key={option}>{option}</option>
                                  ))}
                                </select>
                              </div>

                              <button
                                type="button"
                                className="btn btn-outline-secondary btn-sm w-100 mt-3"
                                onClick={() => openEditForm(task)}
                              >
                                ✎ Edit Task
                              </button>
                            </article>
                          ))}

                          {columnTasks.length === 0 && (
                            <div className="kanban-empty">
                              <div className="fs-3 mb-2">＋</div>
                              <p className="small mb-0">
                                No matching tasks
                              </p>
                            </div>
                          )}
                        </div>

                        <button
                          className="btn btn-sm btn-outline-secondary w-100 mt-3"
                          onClick={openCreateForm}
                        >
                          + Add a task
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Table view */}
            {view === "table" && (
              <div className="taskspace-card p-3 p-lg-4">
                <div className="table-responsive">
                  <table className="table taskspace-table mb-0">
                    <thead>
                      <tr>
                        <th>Task</th>
                        <th>Project</th>
                        <th>Assignee</th>
                        <th>Due date</th>
                        <th>Priority</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {visibleTasks.map((task) => (
                        <tr key={task.id}>
                          <td className="fw-semibold">
                            {task.title}
                            {renderOverdue(task)}
                          </td>
                          <td>{task.project}</td>
                          <td>{task.assignee}</td>
                          <td>
                            <span
                              className={
                                isOverdue(task)
                                  ? "text-danger fw-bold"
                                  : ""
                              }
                            >
                              {task.dueDate}
                            </span>
                          </td>
                          <td>
                            <span
                              className={`kanban-priority ${priorityClass(
                                task.priority
                              )}`}
                            >
                              {task.priority}
                            </span>
                          </td>
                          <td>
                            <select
                              className="form-select form-select-sm"
                              aria-label={`Status for ${task.title}`}
                              value={task.status}
                              onChange={(e) =>
                                updateTaskStatus(
                                  task.id,
                                  e.target.value as Task["status"]
                                )
                              }
                            >
                              {statuses.map((option) => (
                                <option key={option}>{option}</option>
                              ))}
                            </select>
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-secondary"
                                onClick={() => openEditForm(task)}
                              >
                                Edit
                              </button>

                              <button
                                type="button"
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDelete(task)}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}

                      {visibleTasks.length === 0 && (
                        <tr>
                          <td
                            colSpan={7}
                            className="text-center py-4"
                          >
                            No tasks match your search or filters.
                            <div className="mt-2">
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-secondary"
                                onClick={resetFilters}
                              >
                                Clear filters
                              </button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>

          <p className="text-center taskspace-muted small mt-4">
            TaskSpace · Organize your work, one task at a time.
          </p>
        </main>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div className="col-6 col-xl">
      <div className="taskspace-card p-3 p-lg-4 h-100">
        <div className="taskspace-muted small mb-2">
          {title}
        </div>
        <div className="taskspace-stat-number">{value}</div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <TaskProvider>
      <Dashboard />
    </TaskProvider>
  );
}