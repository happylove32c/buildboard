"use client";

import MessageInput from "@/components/MessageInput";
import { Fragment, useState, useEffect } from "react";

export default function Home() {
  const aiGreetings = [
    "What should we do today?",
    "Any new ideas?",
    "Here comes another good one!",
  ];

  const [messages, setMessages] = useState<
    { type: "user" | "ai"; text: string }[]
  >([]);
  const [loading, setLoading] = useState(false);

  // Parse AI text into React nodes with bold and list formatting
  const parseAIResponse = (text: string) => {
    const lines = text.split("\n");

    return lines.map((line, i) => {
      let content: React.ReactNode = line;

      // Bold text **like this**
      const boldPattern = /\*\*(.*?)\*\*/g;
      if (boldPattern.test(line)) {
        const parts = line.split(boldPattern).map((part, idx) => {
          if (idx % 2 === 1) return <strong key={idx}>{part}</strong>;
          return part;
        });
        content = parts;
      }

      // Convert bullets - or * into proper list items
      if (/^\s*[-*]\s+/.test(line)) {
        content = (
          <li key={i} className="ml-4 list-disc">
            {line.replace(/^\s*[-*]\s+/, "")}
          </li>
        );
        return content;
      }

      if (/^\s*[-*]\s+/.test(line)) {
        // Remove the bullet symbol
        let itemText = line.replace(/^\s*[-*]\s+/, "");

        // Replace **bold** with <strong> for React
        const parts: React.ReactNode[] = [];
        const regex = /\*\*(.*?)\*\*/g;
        let lastIndex = 0;
        let match: RegExpExecArray | null;

        while ((match = regex.exec(itemText)) !== null) {
          if (match.index > lastIndex) {
            parts.push(itemText.slice(lastIndex, match.index));
          }
          parts.push(<strong key={i + "-" + lastIndex}>{match[1]}</strong>);
          lastIndex = match.index + match[0].length;
        }
        if (lastIndex < itemText.length) {
          parts.push(itemText.slice(lastIndex));
        }

        content = (
          <li key={i} className="ml-4 list-disc">
            {parts.length > 0 ? parts : itemText}
          </li>
        );
        return content;
      }

      // Normal line as paragraph
      return <p key={i} className="mb-1">{content}</p>;
    });
  };

  useEffect(() => {
    const randomGreeting =
      aiGreetings[Math.floor(Math.random() * aiGreetings.length)];
    setMessages([{ type: "ai", text: randomGreeting }]);
  }, []);

const [projectData, setProjectData] = useState({
  raw_idea: "",
  title: "",
  mvp_description: "",
});

const handleSend = async (text: string) => {
  // Store raw idea
  setProjectData((prev) => ({ ...prev, raw_idea: text }));

  setMessages((prev) => [...prev, { type: "user", text }]);
  setLoading(true);

  try {
    const res = await fetch("/api/generateMvp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content:
              "You are an expert product strategist. The user will give you a raw idea. Turn it into: 1. A nice and suitable short 5-word title 2. A clear MVP description. 3. 3–6 build phases with short explanations. 4. A breakdown of each phase into small, daily tasks. Keep language simple, concise, and actionable.",
          },
          ...messages.map((msg) => ({
            role: msg.type === "user" ? "user" : "assistant",
            content: msg.text,
          })),
          { role: "user", content: text },
        ],
      }),
    });

    const data = await res.json();

    if (data.reply) {
      // Try to extract Title and MVP from AI's reply
      const titleMatch = data.reply.match(/\*\*Title:\*\*\s*(.*)/i);
      const mvpMatch = data.reply.match(/\*\*MVP:\*\*\s*(.*)/i);

      const title = titleMatch ? titleMatch[1].trim() : "";
      const mvp = mvpMatch ? mvpMatch[1].trim() : "";

      setProjectData((prev) => ({
        ...prev,
        title,
        mvp_description: mvp,
      }));

      setMessages((prev) => [...prev, { type: "ai", text: data.reply }]);
    } else if (data.error) {
      setMessages((prev) => [
        ...prev,
        { type: "ai", text: "⚠️ Error: " + data.error },
      ]);
    }
  } catch (err: any) {
    setMessages((prev) => [
      ...prev,
      { type: "ai", text: "⚠️ Network error: " + err.message },
    ]);
  } finally {
    setLoading(false);
  }
};

  return (
    <Fragment>
      <div className="flex flex-col min-h-screen bg-white p-4 pb-24">
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
                  <p className="text-white font-bold">{msg.text}</p>
                </div>
              </div>
            ) : (
              <div
                key={idx}
                className="flex items-start gap-3 justify-end space-x-2"
              >
                <div className="relative bg-white border p-4 rounded-lg max-w-md whitespace-pre-line break-words flex-shrink-0">
                  {parseAIResponse(msg.text)}
                </div>
                <img
                  src="https://i.pravatar.cc/40?img=2"
                  alt="AI"
                  className="h-12 rounded-full"
                />
              </div>
            )
          )}

          {loading && (
            <div className="flex items-start gap-3 justify-end space-x-2">
              <div className="relative bg-white border p-4 rounded-lg max-w-md italic text-gray-500">
                AI is typing…
              </div>
              <img
                src="https://i.pravatar.cc/40?img=2"
                alt="AI"
                className="h-12 rounded-full"
              />
            </div>
          )}
        </div>
      </div>

      <MessageInput onSend={handleSend} />
    </Fragment>
  );
}
