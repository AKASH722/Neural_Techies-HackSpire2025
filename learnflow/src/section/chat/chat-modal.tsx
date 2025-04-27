"use client";
import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import MessageList from "./message-list";
import InputBox from "./input-box";
import ChatMenu from "./chat-menu";
import { BiChat, BiDotsHorizontalRounded } from "react-icons/bi";
import { IoChevronBack } from "react-icons/io5";
import { sendChatMessage } from "@/section/chat/actions";
import { ChatMessage } from "./types";

interface ChatModalProps {
  onClose: () => void;
  messages: ChatMessage[];
  isOpen: boolean;
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

const ChatModal: React.FC<ChatModalProps> = ({
  onClose,
  messages,
  setMessages,
  isOpen,
}) => {
  const [language, setLanguage] = useState("EN");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // This is to reach the latest message(scroll automatically to the end of the message)
  useEffect(() => {
    const scrollToBottom = () => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    };

    const timer = setTimeout(scrollToBottom, 100);

    return () => {
      clearTimeout(timer);
    };
  }, [messages, isOpen]);

  //  Function to handle send button
  const handleSend = async (query: string) => {
    const userMessage: ChatMessage = {
      id: Date.now(),
      sender: "user",
      text: query,
    };
    setMessages((prev) => [...prev, userMessage]);

    const thinkingMessage: ChatMessage = {
      id: Date.now() + 1,
      sender: "ai",
      text: "",
      isThinking: true,
    };
    setMessages((prev) => [...prev, thinkingMessage]);

    try {
      // Call the server action with user query
      const response = await sendChatMessage({
        user_id: "user-" + Math.random().toString(36).substr(2, 9), // Generate a simple user ID
        user_message: query,
      });

      // Remove thinking message and add AI response
      const aiResponse: ChatMessage = {
        id: Date.now() + 2,
        sender: "ai",
        text: response.study_buddy_reply,
      };

      setMessages((prev) =>
        prev.filter((msg) => !msg.isThinking).concat(aiResponse)
      );
    } catch (error) {
      // Handle error case
      const errorMessage: ChatMessage = {
        id: Date.now() + 2,
        sender: "ai",
        text: "Sorry, I'm having trouble connecting right now. Please try again later.",
      };

      setMessages((prev) =>
        prev.filter((msg) => !msg.isThinking).concat(errorMessage)
      );
      console.error("Error sending message:", error);
    }
  };

  // Function to handle the clear chats
  const handleClearChat = () => {
    setMessages([
      { id: Date.now(), sender: "ai", text: "How can I help you today?" },
    ]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, y: 25, transformOrigin: "bottom right" }}
      animate={{ opacity: 1, scale: 1, y: 0, transformOrigin: "bottom right" }}
      exit={{ opacity: 0, scale: 0, y: 25, transformOrigin: "bottom right" }}
      transition={{ type: "spring", stiffness: 200, damping: 21 }}
      className="fixed bottom-20 right-5 z-50 flex max-h-[calc(100vh-8rem)] min-h-[575px] w-[25rem] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-lg border-[1px] border-indigo-100 bg-white shadow-lg"
    >
      {/* Header */}
      <div className="flex flex-col items-center justify-between gap-2 border-b border-b-indigo-100 bg-white p-3 text-zinc-800 shadow-sm">
        <div className="flex w-full items-center justify-between">
          {/* Back Button */}
          <button
            onClick={onClose}
            className="rounded-full bg-indigo-50 p-1 text-center text-indigo-700 hover:opacity-75"
          >
            <IoChevronBack size={18} />
          </button>

          {/* Title */}
          <div className="flex flex-col items-center gap-2">
            <span className="font-semibold text-[#6e56cf]">Cleo</span>
          </div>

          {/* Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="rounded-full bg-indigo-50 p-1 text-center text-indigo-700 transition-all duration-200 hover:opacity-75"
          >
            <BiDotsHorizontalRounded size={18} />
          </button>

          <AnimatePresence>
            {/* Dropdown Menu */}
            {isMenuOpen && (
              <ChatMenu
                language={language}
                setLanguage={setLanguage}
                onClearChat={handleClearChat}
                onClose={() => setIsMenuOpen(false)}
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto bg-indigo-50/30 p-3">
        <MessageList messages={messages} />
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <InputBox onSend={handleSend} />

      {/* Footer */}
      <span className="mx-auto flex w-full items-center justify-center gap-1 bg-[#6e56cf] py-3 text-center text-xs text-white">
        powered by <BiChat />
        <strong>
          <a href="https://github.com/NeuralTechies/" target="_blank">
            Learn Flow
          </a>
        </strong>
      </span>
    </motion.div>
  );
};

export default ChatModal;
