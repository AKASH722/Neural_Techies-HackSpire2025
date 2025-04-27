import React from "react";
import AIMessage from "./ai-message";
import { ChatMessage } from "@/section/chat/types";
interface MessageListProps {
  messages: ChatMessage[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  return (
    <ul className="m-0 flex list-none flex-col p-0">
      {messages.map((msg) => (
        <React.Fragment key={msg.id}>
          {msg.sender === "ai" ? (
            <AIMessage message={msg} />
          ) : (
            <li className="relative my-2 max-w-[75%] self-end rounded-xl rounded-tr-none bg-[#6e56cf] px-4 py-2 text-sm text-white">
              {msg.text}
            </li>
          )}
        </React.Fragment>
      ))}
    </ul>
  );
};

export default MessageList;
