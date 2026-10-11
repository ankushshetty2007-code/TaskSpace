
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Task = {
  id: number;
  title: string;
  project: string;
  assignee: string;
  dueDate: string;
  priority: "High" | "Medium" | "Low";
  status: "In Progress" | "To Do" | "Completed";
};

export type NewTask = Omit<Task, "id">;

export type TaskComment = {
  id: string;
  taskId: number;
  text: string;
  author: string;
  createdAt: string;
};

export type ActivityEntry = {
  id: string;
  taskId: number;
  taskTitle: string;
  action: string;
  details: string;
  createdAt: string;
};

const initialTasks: Task[] = [
  {
    id: 1,
    title: "Complete DSA assignment",
    project: "College",
    assignee: "Ankush",
    dueDate: "2026-10-12",
    priority: "High",
    status: "In Progress",
  },
  {
    id: 2,
    title: "Build project dashboard",
    project: "Skill 60",
    assignee: "Rahul",
    dueDate: "2026-10-12",
    priority: "High",
    status: "To Do",
  },
  {
    id: 3,
    title: "Prepare presentation",
    project: "Skill 60",
    assignee: "Ankush",
    dueDate: "2026-10-12",
    priority: "Medium",
    status: "In Progress",
  },
  {
    id: 4,
    title: "Review project documentation",
    project: "College",
    assignee: "Priya",
    dueDate: "2026-10-14",
    priority: "Low",
    status: "Completed",
  },
];

type TaskContextType = {
  tasks: Task[];
  comments: TaskComment[];
  activities: ActivityEntry[];
  addTask: (task: NewTask) => void;
  editTask: (id: number, changes: NewTask) => void;
  updateTaskStatus: (
    id: number,
    status: Task["status"]
  ) => void;
  deleteTask: (id: number) => void;
  addComment: (taskId: number, text: string, author: string) => void;
};

const TaskContext = createContext<TaskContextType | undefined>(
  undefined
);

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function TaskProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [comments, setComments] = useState<TaskComment[]>([]);
  const [activities, setActivities] = useState<ActivityEntry[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);

  // Load all saved data before enabling persistence.
  useEffect(() => {
    try {
      const savedTasks = localStorage.getItem("taskspace-tasks");
      const savedComments = localStorage.getItem("taskspace-comments");
      const savedActivities = localStorage.getItem("taskspace-activity");

      if (savedTasks !== null) {
        const parsed: unknown = JSON.parse(savedTasks);
        if (Array.isArray(parsed)) setTasks(parsed as Task[]);
      }

      if (savedComments !== null) {
        const parsed: unknown = JSON.parse(savedComments);
        if (Array.isArray(parsed)) setComments(parsed as TaskComment[]);
      }

      if (savedActivities !== null) {
        const parsed: unknown = JSON.parse(savedActivities);
        if (Array.isArray(parsed)) setActivities(parsed as ActivityEntry[]);
      }
    } catch (error) {
      console.error("Could not load TaskSpace data:", error);
    } finally {
      setHasLoaded(true);
    }
  }, []);

  // Persist data after initial loading has finished.
  useEffect(() => {
    if (!hasLoaded) return;

    try {
      localStorage.setItem("taskspace-tasks", JSON.stringify(tasks));
      localStorage.setItem("taskspace-comments", JSON.stringify(comments));
      localStorage.setItem("taskspace-activity", JSON.stringify(activities));
    } catch (error) {
      console.error("Could not save TaskSpace data:", error);
    }
  }, [tasks, comments, activities, hasLoaded]);

  function recordActivity(
    taskId: number,
    taskTitle: string,
    action: string,
    details: string
  ) {
    const entry: ActivityEntry = {
      id: createId(),
      taskId,
      taskTitle,
      action,
      details,
      createdAt: new Date().toISOString(),
    };

    setActivities((previous) => [entry, ...previous]);
  }

  function addTask(task: NewTask) {
    const newTask: Task = {
      ...task,
      id: Date.now(),
    };

    setTasks((previous) => [...previous, newTask]);
    recordActivity(
      newTask.id,
      newTask.title,
      "Task created",
      `Created in ${newTask.project}.`
    );
  }

  function editTask(id: number, changes: NewTask) {
    const existing = tasks.find((task) => task.id === id);
    if (!existing) return;

    setTasks((previous) =>
      previous.map((task) =>
        task.id === id ? { ...changes, id: task.id } : task
      )
    );

    if (existing.status !== changes.status) {
      recordActivity(
        id,
        changes.title,
        "Status changed",
        `${existing.status} → ${changes.status}`
      );
    }

    recordActivity(
      id,
      changes.title,
      "Task edited",
      "Task details were updated."
    );
  }

  function updateTaskStatus(
    id: number,
    status: Task["status"]
  ) {
    const existing = tasks.find((task) => task.id === id);
    if (!existing || existing.status === status) return;

    setTasks((previous) =>
      previous.map((task) =>
        task.id === id ? { ...task, status } : task
      )
    );

    recordActivity(
      id,
      existing.title,
      "Status changed",
      `${existing.status} → ${status}`
    );
  }

  function deleteTask(id: number) {
    const existing = tasks.find((task) => task.id === id);
    if (!existing) return;

    // Keep the deletion in the activity history.
    recordActivity(
      id,
      existing.title,
      "Task deleted",
      "This task was deleted."
    );

    setTasks((previous) => previous.filter((task) => task.id !== id));
    setComments((previous) =>
      previous.filter((comment) => comment.taskId !== id)
    );
  }

  function addComment(taskId: number, text: string, author: string) {
    const cleanText = text.trim();
    const task = tasks.find((item) => item.id === taskId);

    if (!cleanText || !task) return;

    const comment: TaskComment = {
      id: createId(),
      taskId,
      text: cleanText,
      author: author.trim() || "Team member",
      createdAt: new Date().toISOString(),
    };

    setComments((previous) => [comment, ...previous]);

    recordActivity(
      task.id,
      task.title,
      "Comment added",
      `${comment.author} added a comment.`
    );
  }

  return (
    <TaskContext.Provider
      value={{
        tasks,
        comments,
        activities,
        addTask,
        editTask,
        updateTaskStatus,
        deleteTask,
        addComment,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);

  if (!context) {
    throw new Error("useTasks must be used inside a TaskProvider");
  }

  return context;
}