"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "./AuthModal";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

type MessageInputProps = {
  onSend: (message: string) => void;
};

export default function MessageInput({ onSend }: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleSend = () => {
    if (!message.trim()) return;

    if (!user) {
      setOpen(true);
      return;
    }

    onSend(message);
    setMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-resize textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 p-4 sm:p-6 flex justify-center z-50">
        <motion.div
          className="relative w-full max-w-2xl"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="relative">
            <textarea
              ref={textareaRef}
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-gray-300/50 backdrop-blur-md resize-none overflow-hidden text-base rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary px-4 py-3 pr-20 sm:pr-24 min-h-[3rem] max-h-40"
              rows={1}
            />

            <AnimatePresence>
              {message.trim() && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-[20%] right-2"
                >
                  <Button
                    onClick={handleSend}
                    className="px-3 sm:px-4 py-2 text-sm shadow-sm"
                  >
                    Send
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      <AuthModal open={open} setOpen={setOpen} />
    </>
  );
}
