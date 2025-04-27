export interface ChatMessage {
    id: number;
    sender: "ai" | "user";
    text: string;
    links?: Array<{ label: string; path: string }>;
    isThinking?: boolean;
}