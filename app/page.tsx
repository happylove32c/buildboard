"use client";

import MessageInput from "@/components/MessageInput";
import { Fragment, useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState([
    { type: "user", text: "How do I create a new project?" },
    {
      type: "ai",
      text: 'You can create a new project by clicking on the "New Project" button in the dashboard.',
    },
  ]);

  const handleSend = (text: string) => {
    setMessages([...messages, { type: "user", text }]);
  };

  return (
    <Fragment>
      {/* Chat interface */}
      <div className="flex flex-col min-h-screen bg-gray-100 p-4 pb-24">
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
                <div className="relative bg-white p-4 rounded-lg max-w-xs">
                  <div className="absolute left-0 top-4 -ml-2 w-0 h-0 border-t-8 border-b-8 border-r-8 border-transparent border-r-white"></div>
                  <p className="text-black font-bold">User: {msg.text}</p>
                </div>
              </div>
            ) : (
              <div
                key={idx}
                className="flex items-start gap-3 justify-end space-x-2"
              >
                <div className="relative bg-black p-4 rounded-lg max-w-xs">
                  <div className="absolute right-0 top-4 -mr-2 w-0 h-0 border-t-8 border-b-8 border-l-8 border-transparent border-l-black"></div>
                  <p className="text-white font-bold">AI: {msg.text}</p>
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
