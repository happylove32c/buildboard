"use client";

import { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "@/components/AuthModal";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";

export default function Home() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) console.error("Error fetching projects:", error.message);

      setProjects(data || []);
      setLoading(false);
    };

    fetchProjects();
  }, [user]);

  const isRecent = (createdAt: string) => {
    const created = new Date(createdAt).getTime();
    return Date.now() - created < 24 * 60 * 60 * 1000; // 24h
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Fragment>
      <div className="max-w-3xl mx-auto p-6">
        {!user ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <p className="mb-4 text-gray-600">There's nothing here</p>
            <Button onClick={() => setAuthOpen(true)}>Sign in to get started</Button>
          </div>
        ) : projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <p className="mb-4 text-gray-600">No projects yet</p>
            <Button asChild>
              <a href="/new">Add your first project</a>
            </Button>
          </div>
        ) : (
          <>
          <h1 className="text-[24px] font-bold px-2 mb-6">Your Projects</h1>
          <div className="relative p-2">
            {/* Timeline line */}
            <div className="absolute left-4 top-0 h-full w-0.5 bg-gray-300"></div>
            <ul className="space-y-8 p-2 pl-10">
              {projects.map((project) => (
                <li key={project.id} className="relative p-2">
                  <span className="absolute -left-5 top-1/2 -translate-y-1/2 w-3 h-3 bg-black rounded-full"></span>

                  <Link href={`/project/${project.id}`} className="block">
                    {isRecent(project.created_at) ? (
                      <div className="bg-purple-100 border border-purple-400 rounded-lg shadow-lg p-4 hover:bg-purple-200 transition">
                        <h3 className="text-lg font-bold text-purple-800">{project.title}</h3>
                        <p className="mt-2 text-sm text-gray-700">
                          <span className="font-semibold">Idea:</span> {project.raw_idea}
                        </p>
                        <p className="mt-2 text-sm text-gray-600">
                          <span className="font-semibold">MVP:</span> {project.mvp_description}
                        </p>
                      </div>
                    ) : (
                      <div className="bg-white rounded-lg shadow p-4 hover:bg-gray-50 transition">
                        <h3 className="text-lg font-semibold">{project.title}</h3>
                        <p className="text-sm text-gray-500">
                          {new Date(project.created_at).toLocaleDateString()}
                        </p>
                        <p className="mt-2">{project.description}</p>
                      </div>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          </>
        )}
      </div>

      <AuthModal open={authOpen} setOpen={setAuthOpen} />
    </Fragment>
  );
}
