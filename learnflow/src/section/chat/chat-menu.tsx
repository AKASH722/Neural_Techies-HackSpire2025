import React from "react";
import { motion } from "framer-motion";
import { PiChatSlashFill } from "react-icons/pi";
interface ChatMenuProps {
    language: string;
    setLanguage: (lang: string) => void;
    onClearChat: () => void;
    onClose: () => void;
}

const ChatMenu: React.FC<ChatMenuProps> = ({  onClearChat, onClose }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -10 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="absolute z-[999] top-12 right-3 bg-indigo-50 shadow-lg rounded-lg p-2.5 w-36 text-indigo-950"
        >

            {/* Clear Chat */}
            <button
                onClick={() => {
                    onClearChat();
                    onClose();
                }}
                className="w-full flex gap-2 justify-center items-center text-center text-sm text-[#6e56cf] bg-white hover:bg-[#6e56cf]/75 p-2 rounded mt-2 transition-all duration-200"
            >
                <PiChatSlashFill className="bg-[#6e56cf] " />
                Clear Chat
            </button>
        </motion.div>
    );
};

export default ChatMenu;