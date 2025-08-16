"use client";

import { Fragment, useRef, useState } from "react";
import { FaSave } from "react-icons/fa";
import { supabase } from "@/lib/supabaseClient";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "@/context/AuthContext";
import Toaster from "@/components/Toaster";

export default function NewIdea() {
  const { user } = useAuth();
  const [title] = useState("New Idea");
  const firstLetter = title.charAt(0).toUpperCase();

  const nameRef = useRef<HTMLTextAreaElement | null>(null);
  const descRef = useRef<HTMLTextAreaElement | null>(null);

  const [loading, setLoading] = useState(false);
  const [steps, setSteps] = useState<any[]>([]);
   const [toast, setToast] = useState<{ message: string; type?: "success" | "error" | "info" } | null>(null);

  // 🔹 Save project to Supabase
  const handleSave = async () => {
    if (!user) {
      setToast({message: "You must be logged in to save projects."});
      return;
    }

    const idea = nameRef.current?.value || "";
    const description = descRef.current?.value || "";

    if (!idea || !description || steps.length === 0) {
      setToast({message: "Please enter idea, description, and generate steps first."});
      return;
    }

    const { error } = await supabase.from("projects").insert([{
      // id: uuidv4(),
      // id should start from 20 and increment by 1
      id: 20 + (await supabase.from("projects").select("*").then(res => res.data?.length || 0)),
      user_id: user.id,
      title: idea,
      raw_idea: idea,
      mvp_description: description,
      build_steps: {steps},
      status: "draft",
    }]);

    if (error) {
      console.error("Error saving project:", error.message);
      setToast({message: "Error saving project. Check console."});
    } else {
      setToast({message: "✅ Project saved successfully!"});
    }
  };

  const handleKeyDown = async (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
    nextRef?: React.RefObject<HTMLTextAreaElement | null>
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      if (e.currentTarget === descRef.current) {
        const idea = nameRef.current?.value || "";
        const description = descRef.current?.value || "";

        if (idea && description) {
          setLoading(true);
          setSteps([]);
          try {
            const res = await fetch("/api/generateMvp", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ idea, description }),
            });
            const data = await res.json();

            if (data.steps) {
              setSteps(data.steps);
            } else if (data.reply) {
              const parsed = JSON.parse(data.reply);
              setSteps(parsed.steps || []);
            }
          } catch (err) {
            console.error(err);
            setSteps([]);
          } finally {
            setLoading(false);
          }
        }
      }

      nextRef?.current?.focus();
    }
  };

  return (
    <Fragment>
      <main className="bg-gray-100 min-h-screen flex flex-col items-center">
        {/* Toolbar */}
        <div className="sticky top-0 z-50 bg-white shadow-md flex items-center justify-between px-6 py-3 w-full">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white font-bold text-lg">
              {firstLetter}
            </div>
            <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-gray-100 text-gray-800 flex items-center justify-center gap-3 font-bold text-lg rounded-md hover:bg-gray-200 transition"
            >
              <FaSave /> Save
            </button>
          </div>
        </div>

        {/* Centered A4-style container */}
        <div className="flex-1 w-full flex justify-center py-8">
          <div className="bg-white shadow-lg w-full max-w-[794px] aspect-[210/297] p-8 flex flex-col gap-6 rounded-sm">
            {/* Idea Title */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Idea Name
              </label>
              <textarea
                ref={nameRef}
                rows={3}
                placeholder="Enter the name of the project..."
                onKeyDown={(e) => handleKeyDown(e, descRef)}
                className="w-full px-4 py-2 border border-gray-300 border-dashed resize-none focus:outline-none"
              />
            </div>

            {/* Idea Description */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Idea Description
              </label>
              <textarea
                ref={descRef}
                rows={5}
                placeholder="Describe your idea in detail..."
                onKeyDown={(e) => handleKeyDown(e)}
                className="w-full px-4 py-2 border border-gray-300 border-dashed resize-none focus:outline-none"
              />
            </div>

            {/* Build Steps */}
            <div className="relative">
              <label className="block text-gray-700 font-medium mb-2">
                Build Steps
              </label>

              {loading ? (
                <div className="h-[100vh] flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-purple-500"></div>
                </div>
              ) : steps.length > 0 ? (
                <ul className="space-y-6">
                  {steps.map((step: any) => (
                    <li key={step.step} className="border p-4 rounded-md">
                      <h3 className="font-bold text-lg mb-2">
                        Step {step.step}: {step.title}
                      </h3>
                      <ul className="list-disc list-inside space-y-1 pl-4">
                        {step.tasks.map((task: any) => (
                          <li key={task.day}>
                            Day {task.day}: {task.task}{" "}
                            {/* <span className="text-gray-400 text-sm">
                              ({task.completed ? "Done" : "Pending"})
                            </span> */}
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400">No steps yet...</p>
              )}
            </div>
          </div>
        </div>
      </main>

            {toast && (
        <Toaster
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </Fragment>
  );
}
