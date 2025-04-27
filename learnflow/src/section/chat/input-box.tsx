"use client";

import React, { useEffect, useRef, useState } from "react";
import { BiMicrophone, BiMicrophoneOff } from "react-icons/bi";
import { sendVoiceMessage } from "./actions";

interface VoiceToTextOptions {
    interimResults?: boolean;
    lang?: string;
    continuous?: boolean;
}

const useVoiceToText = ({ options }: { options: VoiceToTextOptions }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState("");
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        if (typeof window === "undefined" || !("webkitSpeechRecognition" in window)) {
            console.log("Web Speech API not supported");
            return;
        }

        const SpeechRecognitionAPI =
            (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const SpeechGrammarListAPI =
            (window as any).SpeechGrammarList || (window as any).webkitSpeechGrammarList;

        recognitionRef.current = new SpeechRecognitionAPI();
        const recognition = recognitionRef.current;

        recognition.interimResults = options?.interimResults ?? true;
        recognition.lang = options?.lang ?? "en-US";
        recognition.continuous = options?.continuous ?? true;

        if (SpeechGrammarListAPI) {
            const grammar = "#JSGF V1.0; grammar punctuation; public <punc> = , | . | ; | : |! ;";
            const speechRecognitionList = new SpeechGrammarListAPI();
            speechRecognitionList.addFromString(grammar, 1);
            recognition.grammars = speechRecognitionList;
        }

        recognition.onresult = (e: any) => {
            let text = "";
            for (let i = e.resultIndex; i < e.results.length; i++) {
                text += e.results[i][0].transcript;
            }
            setTranscript(text);
        };

        recognition.onerror = (e: any) => {
            console.error("Speech recognition error:", e.error);
            setIsRecording(false);
        };

        recognition.onend = () => {
            setIsRecording(false);
        };

        return () => {
            if (recognition) {
                try {
                    recognition.stop();
                } catch (e) {
                    console.log("Recognition already stopped");
                }
            }
        };
    }, [options?.interimResults, options?.lang, options?.continuous]);

    const startRecording = () => {
        if (recognitionRef.current && !isRecording) {
            try {
                setTranscript("");
                recognitionRef.current.start();
                setIsRecording(true);
            } catch (e) {
                console.error("Could not start recording:", e);
            }
        }
    };

    const stopRecording = () => {
        if (recognitionRef.current && isRecording) {
            try {
                recognitionRef.current.stop();
            } catch (e) {
                console.error("Could not stop recording:", e);
            }
        }
        setIsRecording(false);
    };

    return { isRecording, transcript, startRecording, stopRecording };
};

interface InputBoxProps {
    onSend: (message: string) => void;
}

const InputBox: React.FC<InputBoxProps> = ({ onSend }) => {
    const [message, setMessage] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [isTextToSpeechProcessing, setIsTextToSpeechProcessing] = useState(false);
    const [ttsEnabled, setTtsEnabled] = useState(true);
    const langCode = "en-US";

    const { transcript, isRecording, startRecording, stopRecording } = useVoiceToText({
        options: { lang: langCode, interimResults: true, continuous: true }
    });

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        const savedTtsPreference = localStorage.getItem("ttsEnabled");
        if (savedTtsPreference !== null) {
            setTtsEnabled(savedTtsPreference === "true");
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("ttsEnabled", ttsEnabled.toString());
    }, [ttsEnabled]);

    const adjustTextareaHeight = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 48)}px`;
        }
    };

    useEffect(() => {
        adjustTextareaHeight();
    }, [message]);

    useEffect(() => {
        if (!isRecording && transcript) {
            setMessage((prev) => (prev ? prev + " " : "") + transcript.trim());
        }
    }, [isRecording, transcript]);

    const toggleTTS = () => {
        setTtsEnabled((prev) => !prev);
    };

    const handleSend = async () => {
        if (message.trim() === "") return;

        onSend(message);
        const userMessage = message;
        setMessage("");

        try {
            setIsProcessing(true);

            const response = await sendVoiceMessage({ user_message: userMessage });

            if (response?.audioUrl && ttsEnabled) {
                const audio = new Audio(response.audioUrl);
                audio.play();
            }
        } catch (error) {
            console.error("Error sending message:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleTextToSpeech = async () => {
        if (message.trim() === "") return;

        try {
            setIsTextToSpeechProcessing(true);

            const response = await sendVoiceMessage({ user_message: message });

            if (response?.audioUrl) {
                const audio = new Audio(response.audioUrl);
                audio.play();
            }
        } catch (error) {
            console.error("Error playing text-to-speech:", error);
        } finally {
            setIsTextToSpeechProcessing(false);
        }
    };

    const startStopRecording = () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    const displayValue = isRecording ? message + (transcript ? " " + transcript : "") : message;

    return (
        <div className="flex items-center bg-white">
            <div className="flex items-center w-full bg-white px-3 py-2 border-t border-t-indigo-100">
                {/* TTS Toggle */}
                <button
                    onClick={toggleTTS}
                    className={`mr-2 text-xl p-2 rounded-full ${ttsEnabled ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-600"}`}
                    aria-label="Toggle TTS"
                    title={ttsEnabled ? "Voice responses ON" : "Voice responses OFF"}
                >
                    {ttsEnabled ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                            <line x1="23" y1="9" x2="17" y2="9" />
                            <line x1="23" y1="15" x2="17" y2="15" />
                        </svg>
                    )}
                </button>

                {/* Textarea */}
                <textarea
                    ref={textareaRef}
                    placeholder="Ask a question..."
                    disabled={isProcessing}
                    value={displayValue}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                        }
                    }}
                    className="flex-1 text-sm bg-transparent no-scrollbar overflow-y-scroll outline-none px-1 mt-1 text-indigo-900 resize-none overflow-hidden"
                    style={{ minHeight: "24px", maxHeight: "48px", lineHeight: "20px" }}
                />

                <div className="flex gap-2">
                    {/* Play TTS */}
                    {message.trim() && (
                        <button
                            onClick={handleTextToSpeech}
                            disabled={isProcessing || isTextToSpeechProcessing}
                            className="text-xl text-white hover:bg-indigo-700 p-2 bg-indigo-600 rounded-full"
                            aria-label="Play TTS"
                        >
                            {isTextToSpeechProcessing ? (
                                <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                                </svg>
                            ) : (
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polygon points="5 3 19 12 5 21 5 3" />
                                </svg>
                            )}
                        </button>
                    )}

                    {/* Voice input button */}
                    <button
                        onClick={startStopRecording}
                        disabled={isProcessing}
                        className="text-xl text-white hover:bg-indigo-700 p-2 bg-indigo-600 rounded-full"
                        aria-label="Toggle recording"
                    >
                        {isRecording ? <BiMicrophone className="text-white" /> : <BiMicrophoneOff className="text-white" />}
                    </button>

                    {/* Send button */}
                    {message.trim() && (
                        <button
                            onClick={handleSend}
                            disabled={isProcessing}
                            className="text-xl text-white hover:bg-indigo-700 p-2 bg-indigo-600 rounded-full"
                            aria-label="Send message"
                        >
                            {isProcessing ? (
                                <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                                </svg>
                            ) : (
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" />
                                    <path d="m21.854 2.147-10.94 10.939" />
                                </svg>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InputBox;
