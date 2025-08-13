"use client";

import MessageInput from "@/components/MessageInput";
import { Fragment, useState, useEffect } from "react";

export default function Home() {
  const aiGreetings = [
    "What should we do today?",
    "Any new ideas?",
    "Here comes another good one!",
  ];

  // Pick a random greeting on mount
  const [messages, setMessages] = useState<
    { type: "user" | "ai"; text: string }[]
  >([]);

  useEffect(() => {
    const randomGreeting =
      aiGreetings[Math.floor(Math.random() * aiGreetings.length)];
    setMessages([{ type: "ai", text: randomGreeting }]);
  }, []);

  const handleSend = (text: string) => {
    setMessages((prev) => [...prev, { type: "user", text }]);
  };

  return (
    <Fragment>
      {/* Chat interface */}
      <div className="flex flex-col min-h-screen bg-white p-4 pb-24">
        {/* Chat messages */}
        <div className="flex-1 space-y-4 overflow-y-auto mb-4">
          {messages.map((msg, idx) =>
            msg.type === "user" ? (
              <div key={idx} className="flex gap-3 items-start">
                <img
                  src="https://i.pravatar.cc/40?img=1"
                  alt="User"
                  className="h-12 rounded-full"
                />
                <div className="relative bg-black p-4 rounded-lg max-w-xs">
                  <p className="text-white font-bold">User: {msg.text}</p>
                </div>
              </div>
            ) : (
              <div
                key={idx}
                className="flex items-start gap-3 justify-end space-x-2"
              >
                <div className="relative bg-white border p-4 rounded-lg max-w-xs">
                  {/* <div className="absolute border right-0 top-4 -mr-2 w-0 h-0 border-t-8 border-b-8 border-l-8 border-transparent border-l-black"></div> */}
                  <p className="text-black font-bold">AI: {msg.text}</p>
                </div>
                <img
                  src="https://i.pravatar.cc/40?img=2"
                  alt="AI"
                  className="h-12 rounded-full"
                />
              </div>
            )
          )}
        </div>
      </div>

      {/* Fixed input at bottom */}
      <MessageInput onSend={handleSend} />
    </Fragment>
  );
}
