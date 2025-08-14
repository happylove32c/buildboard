"use client";

import MessageInput from "@/components/MessageInput";
import { Fragment, useState, useEffect, useRef } from "react";

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
  const [typingText, setTypingText] = useState("");
  const chatRef = useRef<HTMLDivElement>(null);

  // Smooth scroll to latest chat
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTo({
        top: chatRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, typingText]);

  const parseAIResponse = (text: string) => {
    const lines = text.split("\n");

    return lines.map((line, i) => {
      let content: React.ReactNode = line;

      const boldPattern = /\*\*(.*?)\*\*/g;
      if (boldPattern.test(line)) {
        const parts = line.split(boldPattern).map((part, idx) => {
          if (idx % 2 === 1) return <strong key={idx}>{part}</strong>;
          return part;
        });
        content = parts;
      }

      if (/^\s*[-*]\s+/.test(line)) {
        const itemText = line.replace(/^\s*[-*]\s+/, "");
        const parts: React.ReactNode[] = [];
        let lastIndex = 0;
        let match: RegExpExecArray | null;
        const regex = /\*\*(.*?)\*\*/g;

        while ((match = regex.exec(itemText)) !== null) {
          if (match.index > lastIndex) parts.push(itemText.slice(lastIndex, match.index));
          parts.push(<strong key={i + "-" + lastIndex}>{match[1]}</strong>);
          lastIndex = match.index + match[0].length;
        }
        if (lastIndex < itemText.length) parts.push(itemText.slice(lastIndex));

        content = (
          <li key={i} className="ml-4 list-disc">
            {parts.length > 0 ? parts : itemText}
          </li>
        );
        return content;
      }

      return <p key={i} className="mb-1">{content}</p>;
    });
  };

  // Initial greeting
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
        // Typing animation
        setTypingText("");
        let i = 0;
        const fullText = data.reply;

        const interval = setInterval(() => {
          setTypingText((prev) => prev + fullText[i]);
          i++;
          if (i >= fullText.length) {
            clearInterval(interval);
            setMessages((prev) => [...prev, { type: "ai", text: fullText }]);
            setTypingText("");
          }
        }, 20); // Adjust typing speed (ms per character)
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
        <div
          ref={chatRef}
          className="flex-1 space-y-4 overflow-y-auto mb-4"
        >
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
                  src="/Atmos Logo.png"
                  alt="AI"
                  className="h-20 rounded-full"
                />
              </div>
            )
          )}

          {typingText && (
            <div className="flex items-start gap-3 justify-end space-x-2">
              <div className="relative bg-white border p-4 rounded-lg max-w-md break-words flex-shrink-0">
                {parseAIResponse(typingText)}
              </div>
              <img
                src="/Atmos Logo.png"
                alt="AI"
                className="h-20 rounded-full"
              />
            </div>
          )}
        </div>
      </div>

      <MessageInput onSend={handleSend} />
    </Fragment>
  );
}
