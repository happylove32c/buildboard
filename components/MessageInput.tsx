"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "./AuthModal";

type MessageInputProps = {
  onSend: (message: string) => void; // takes a string, returns nothing
};

export default function MessageInput({ onSend }: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  const handleSend = () => {
    if (!message.trim()) return;

    // If not logged in, open auth modal
    if (!user) {
      setOpen(true);
      return;
    }

    // If logged in, send normally
    onSend(message);
    setMessage("");
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 p-6 flex justify-center z-50">
        <div className="flex items-center w-full max-w-2xl space-x-2 bg-gray-50 p-3 rounded-lg shadow-sm">
          <input
            type="text"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-black transition-colors duration-200"
          />
          <button
            onClick={handleSend}
            className={`px-4 py-2 rounded-lg text-white ${
              message.trim()
                ? "bg-black hover:bg-gray-800 transition-colors duration-200"
                : "bg-gray-300 cursor-not-allowed"
            }`}
            disabled={!message.trim()}
          >
            Send
          </button>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal open={open} setOpen={setOpen} />
    </>
  );
}
