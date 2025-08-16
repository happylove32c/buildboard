// app/dashboard/page.tsx
// automatically loads latest project.
// option to chat with AI via updates on the app
// options to delete projects
// option to edit project details
// option to mark tasks as completed
// option to view current and next steps
// option to view project history
// option to view project status

"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type Task = {
  id: string;
  title: string;
  status: "todo" | "in_progress" | "done";
};

type Project = {
  id: string;
  title: string;
  raw_idea: string;
  mvp_description: string;
  build_steps: any[];
  status: string;
  tasks?: Task[];
  created_at: string;
};

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch latest project
  useEffect(() => {
    if (!user) {
      router.push("/");
      return;
    }

    const fetchLatestProject = async () => {
      setLoading(true);
      setError("");

      try {
        const { data: projectsData, error: projectsError } = await supabase
          .from("projects")
          .select("*, tasks(*)")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (projectsError) throw projectsError;

        setProject(projectsData);
      } catch (err: any) {
        setError(err.message || "Failed to load project");
      } finally {
        setLoading(false);
      }
    };

    fetchLatestProject();
  }, [user, router]);

  // Actions
  const handleDelete = async () => {
    if (!project) return;
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", project.id);

      if (error) throw error;
      alert("Project deleted!");
      router.refresh();
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  const handleMarkTaskComplete = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from("tasks")
        .update({ status: "done" })
        .eq("id", taskId);

      if (error) throw error;
      // Update local state
      setProject((prev) =>
        prev
          ? {
              ...prev,
              tasks: prev.tasks?.map((t) =>
                t.id === taskId ? { ...t, status: "done" } : t
              ),
            }
          : prev
      );
    } catch (err: any) {
      alert("Error updating task: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 animate-pulse">Loading project...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-100 text-red-700 p-4 rounded-md">
        <p>{error}</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-gray-600">No projects found.</p>
        <Button onClick={() => router.push("/new")}>Create New Project</Button>
      </div>
    );
  }

  // Filter tasks by status
  const todoTasks = project.tasks?.filter((t) => t.status === "todo") || [];
  const inProgressTasks =
    project.tasks?.filter((t) => t.status === "in_progress") || [];
  const doneTasks = project.tasks?.filter((t) => t.status === "done") || [];

  const completionPercent =
    project.tasks && project.tasks.length > 0
      ? Math.round((doneTasks.length / project.tasks.length) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">{project.title}</h1>
        <div className="flex gap-2">
          <Button onClick={handleDelete} variant="destructive">
            Delete
          </Button>
          {/* Placeholder for Edit */}
          <Button onClick={() => alert("Edit project modal coming soon!")}>
            Edit
          </Button>
          <Button onClick={() => alert("AI Chat coming soon!")}>AI Chat</Button>
        </div>
      </div>

      <p className="mb-4 text-gray-700">
        <strong>Status:</strong> {project.status} |{" "}
        <strong>Completion:</strong> {completionPercent}%
      </p>

      <p className="mb-4 text-gray-700">
        <strong>Raw Idea:</strong> {project.raw_idea}
      </p>

      <p className="mb-6 text-gray-700">
        <strong>MVP Description:</strong>{" "}
        {project.mvp_description || "Not generated yet"}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <TaskColumn
          title="Todo"
          tasks={todoTasks}
          onMarkComplete={handleMarkTaskComplete}
        />
        <TaskColumn
          title="In Progress"
          tasks={inProgressTasks}
          onMarkComplete={handleMarkTaskComplete}
        />
        <TaskColumn
          title="Done"
          tasks={doneTasks}
          onMarkComplete={handleMarkTaskComplete}
        />
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Build Steps</h2>
        <pre className="bg-white p-4 rounded-md shadow">{JSON.stringify(project.build_steps, null, 2)}</pre>
      </div>
    </div>
  );
}

// Reusable Kanban column
function TaskColumn({
  title,
  tasks,
  onMarkComplete,
}: {
  title: string;
  tasks: Task[];
  onMarkComplete: (taskId: string) => void;
}) {
  return (
    <div className="bg-white p-4 rounded-md shadow flex flex-col">
      <h3 className="font-semibold mb-2">{title}</h3>
      {tasks.length === 0 && <p className="text-gray-400 text-sm">No tasks</p>}
      <ul className="space-y-2">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="flex justify-between items-center p-2 border rounded-md"
          >
            <span>{task.title}</span>
            {task.status !== "done" && (
              <Button
                size="sm"
                onClick={() => onMarkComplete(task.id)}
              >
                Complete
              </Button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
