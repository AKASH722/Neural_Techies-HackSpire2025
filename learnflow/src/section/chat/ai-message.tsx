"use client";
import React, { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { ChatMessage } from "@/section/chat/types";
interface AIMessageProps {
  message: ChatMessage;
}

const AIMessage: React.FC<AIMessageProps> = ({ message }) => {
  useEffect(() => {}, [message.id]);

  return (
    <div className="flex w-[80%] flex-col">
      <div className="flex flex-1 items-start gap-2">
        {/* AI Icon */}
        <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#6e56cf]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-bot text-white"
          >
            <path d="M12 8V4H8" />
            <rect width="16" height="12" x="4" y="8" rx="2" />
            <path d="M2 14h2" />
            <path d="M20 14h2" />
            <path d="M15 13v2" />
            <path d="M9 13v2" />
          </svg>
        </div>

        {/* AI Response */}
        <li className="relative my-1 rounded-xl rounded-tl-none bg-indigo-100/65 p-3 text-sm text-indigo-900">
          {message.isThinking ? (
            <div className="mt-1 flex items-center">
              <span className="typing-dots flex space-x-1">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-400"></span>
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-400 delay-150"></span>
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-400 delay-300"></span>
              </span>
            </div>
          ) : (
            <span>
              <ReactMarkdown>{message.text}</ReactMarkdown>
            </span>
          )}
        </li>
      </div>

      {/* Links Section */}
      {message.links && message.links.length > 0 && (
        <div className="flex w-full justify-start pl-9">
          <div className="flex w-full flex-col gap-1">
            {message.links.map((link, idx) => (
              <a
                key={idx}
                href={link.path}
                target="_blank"
                rel="noopener noreferrer"
                className="max-w-full flex-1 truncate rounded-lg border border-indigo-600 bg-indigo-100/65 px-3 py-1.5 text-center text-sm font-normal text-[#6e56cf] transition-all duration-200 ease-in-out hover:bg-[#6e56cf] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIMessage;
