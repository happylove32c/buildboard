"use client";

import { Fragment, useState } from "react";
import { FaSave } from "react-icons/fa";

export default function NewIdea() {
  const [title, setTitle] = useState("New Idea");
  const firstLetter = title.charAt(0).toUpperCase();

  return (
    <Fragment>
      <main className="bg-gray-100 min-h-screen flex flex-col items-center">
        {/* Toolbar */}
        <div className="sticky top-0 z-50 bg-white shadow-md flex items-center justify-between px-6 py-3 w-full">
          {/* Left section: Logo / Title */}
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white font-bold text-lg">
              {firstLetter}
            </div>
            <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
          </div>

          {/* Right section: Input and Buttons */}
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-gray-100 text-gray-800 flex items-center justify-center gap-3 font-bold text-lg rounded-md hover:bg-gray-200 transition">
              <FaSave /> Save
            </button>
          </div>
        </div>

        {/* Centered A4-style container */}
        <div className="flex-1 w-full flex justify-center py-8">
          <div className="bg-white shadow-lg w-full max-w-[794px] aspect-[210/297] p-8 flex flex-col gap-6 rounded-sm">
            {/* Idea Title */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Idea Name</label>
              <textarea
                rows={3}
                placeholder="Enter the name of the project you want to build..."
                className="w-full px-4 py-2 border border-gray-300 border-dashed resize-none focus:outline-none focus:ring-none transition"
              />
            </div>

            {/* Idea Description */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Idea Description</label>
              <textarea
                rows={5}
                placeholder="Describe your idea in detail..."
                className="w-full px-4 py-2 border border-gray-300 border-dashed resize-none focus:outline-none focus:ring-none transition"
              />
            </div>

            {/* Build Steps */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Build Steps</label>
              <textarea
                // rows={20}
                placeholder="List the steps to build this idea..."
                className="w-full px-4 py-2 h-[100vh] border border-gray-300 border-dashed resize-none focus:outline-none focus:ring-none transition"
              />
            </div>
          </div>
        </div>
      </main>
    </Fragment>
  );
}
