"use client";
import React, { useEffect, useState } from "react";
import ChatModal from "./chat-modal";
import { motion, AnimatePresence } from "framer-motion";
import { CgClose } from "react-icons/cg";
import { ChatMessage } from "./types";

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: Date.now(),
      sender: "ai",
      text: "How can I help you today?",
    },
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Floating Chat Button */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        animate={{
          rotate: isOpen ? 180 : 0,
        }}
        transition={{
          duration: 0.25,
          delay: -0.2,
          ease: "easeOut",
        }}
        onClick={() => setIsOpen((prev) => !prev)}
        className="hover:bg-[#6e56cf]transition-all fixed bottom-5 right-5 z-50 flex items-center justify-center rounded-full bg-[#6e56cf] p-4 text-2xl text-white shadow-lg"
      >
        {isOpen ? (
          <CgClose size={24} />
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-bot"
          >
            <path d="M12 8V4H8" />
            <rect width="16" height="12" x="4" y="8" rx="2" />
            <path d="M2 14h2" />
            <path d="M20 14h2" />
            <path d="M15 13v2" />
            <path d="M9 13v2" />
          </svg>
        )}
      </motion.button>

      {/* Chat Modal with Animation */}
      <AnimatePresence>
        {isOpen && (
          <ChatModal
            messages={messages}
            setMessages={setMessages}
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatWidget;
