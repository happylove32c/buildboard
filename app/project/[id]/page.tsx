// app/project/[id]/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/Spinner";

export default function ProjectPage() {
  const { id } = useParams();
  const numericId = Number(id);
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchProject = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", numericId)
      .single();

    if (error) {
      console.error("Error fetching project:", error.message);
    } else {
      setProject(data);
    }
    setLoading(false);
  }, [numericId]);

  useEffect(() => {
    if (!isNaN(numericId)) fetchProject();
  }, [numericId, fetchProject]);

  if (loading) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-white/80 z-50">
        <div className="flex flex-col items-center justify-center space-x-2">
          <Spinner size="lg" className="text-black" />
          <span className="text-gray-600">Loading project...</span>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <p className="text-center text-gray-500">Project not found</p>
        <div className="mt-4 flex justify-center">
          <Button asChild>
            <Link href="/">Back to Projects</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-4">
        <Button asChild variant="outline">
          <Link href="/">← Back to Projects</Link>
        </Button>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-2">{project.title}</h1>
        <p className="text-sm text-gray-500 mb-4">
          Created: {new Date(project.created_at).toLocaleString()}
        </p>

        {project.raw_idea && (
          <div className="mb-4">
            <h2 className="font-semibold">Raw Idea</h2>
            <p className="text-gray-700">{project.raw_idea}</p>
          </div>
        )}

        {project.mvp_description && (
          <div className="mb-4">
            <h2 className="font-semibold">MVP Description</h2>
            <p className="text-gray-700">{project.mvp_description}</p>
          </div>
        )}

        {project.build_steps?.steps && (
          <div className="mb-4">
            <h2 className="font-semibold mb-2">Build Steps</h2>
            <ol className="list-decimal ml-5 space-y-4">
              {project.build_steps.steps.map((step: any) => (
                <li key={step.step}>
                  <p className="font-bold">
                    Step {step.step}: {step.title}
                  </p>
                  <ul className="list-none ml-2 mt-2">
                    {step.tasks.map((task: any, taskIndex: number) => (
                      <li key={task.day} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={!!task.completed}
                          onChange={async (e) => {
                            const completedVal = e.target.checked;

                            // Optimistic UI update
                            setProject((prev: any) => {
                              const updated = { ...prev };
                              updated.build_steps.steps[step.step - 1].tasks[taskIndex].completed =
                                completedVal;
                              return updated;
                            });

                            const { error } = await supabase.rpc(
                              "update_task_completion_by_day",
                              {
                                project_id: numericId,
                                task_day: task.day,
                                completed_val: completedVal,
                              }
                            );

                            if (error) {
                              console.error("Error updating completion:", error);
                              // rollback
                              setProject((prev: any) => {
                                const updated = { ...prev };
                                updated.build_steps.steps[step.step - 1].tasks[taskIndex].completed =
                                  !completedVal;
                                return updated;
                              });
                              return;
                            }

                            // Refetch from backend to confirm persisted data
                            await fetchProject();
                          }}
                          className="w-4 h-4"
                        />
                        <span
                          className={`${
                            task.completed
                              ? "line-through text-gray-400"
                              : "text-gray-800"
                          }`}
                        >
                          <span className="font-semibold">Day {task.day}:</span>{" "}
                          {task.task}
                        </span>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </div>
        )}

        {project.status && (
          <p>
            <span className="font-semibold">Status:</span> {project.status}
          </p>
        )}
      </div>
    </div>
  );
}
