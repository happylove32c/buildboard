// app/project/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ProjectPage() {
  const { id } = useParams();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();

      if (error) console.error("Error fetching project:", error.message);

      setProject(data);
      setLoading(false);
    };

    if (id) fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading project...</p>
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

        {project.build_steps && (
          <div className="mb-4">
            <h2 className="font-semibold">Build Steps</h2>
            <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
              {JSON.stringify(project.build_steps, null, 2)}
            </pre>
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
