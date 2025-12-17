"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, Brain } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import ModelSelector from "./ModelSelector";
import { Message, ChatResponse, AgentConfig } from "../types";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ChatInterfaceProps {
    agents: AgentConfig[];
}

export default function ChatInterface({ agents }: ChatInterfaceProps) {
    const [input, setInput] = useState("");
    const [history, setHistory] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedModel, setSelectedModel] = useState<string>(""); // Empty by default, let Selector populate
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [history, loading]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        if (!selectedModel) {
            setHistory((prev) => [...prev, { role: "system", content: "Please select a model from the top right menu first (Ensure LM Studio is running)." }]);
            return;
        }

        const userMsg: Message = { role: "user", content: input };
        setHistory((prev) => [...prev, userMsg]);
        setInput("");
        setLoading(true);

        try {
            const res = await fetch("http://localhost:8000/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: userMsg.content,
                    history: history,
                    model: selectedModel
                }),
            });

            if (!res.ok) throw new Error("Failed to fetch response");

            const data: ChatResponse = await res.json();

            setHistory((prev) => [
                ...prev,
                ...data.messages,
                { role: "assistant", content: data.final_synthesis, sender_name: "Synthesizer" }
            ]);
        } catch (error) {
            console.error(error);
            setHistory((prev) => [
                ...prev,
                { role: "assistant", content: "Error communicating with AI swarm. Check backend logs.", sender_name: "System" }
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-screen text-slate-100 overflow-hidden font-sans selection:bg-cyan-500/30">
            {/* Header with Glass Effect */}
            <header className="px-6 py-4 border-b border-white/5 bg-slate-900/30 backdrop-blur-xl sticky top-0 z-10 z-[100]">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-xl border border-white/10 shadow-[0_0_15px_rgba(6,182,212,0.15)] backdrop-blur-md">
                            <Brain className="w-6 h-6 text-cyan-400" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 tracking-tight">
                                AI Consensus Engine
                            </h1>
                            <p className="text-[11px] font-medium text-slate-400 tracking-wide uppercase">Multi-Agent Discussion Protocol</p>
                        </div>
                    </div>
                    <ModelSelector selectedModel={selectedModel} onModelSelect={setSelectedModel} />
                </div>
            </header>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar" ref={scrollRef}>
                <div className="max-w-5xl mx-auto space-y-8 pb-4">
                    <AnimatePresence initial={false}>
                        {history.length === 0 && (
                            <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4 opacity-50"
                            >
                                <Sparkles className="w-12 h-12 text-cyan-500/50" />
                                <p className="text-lg font-light text-slate-400">Ready to synthesize intelligence.</p>
                            </motion.div>
                        )}

                        {history.map((msg, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                                className={cn(
                                    "flex gap-5",
                                    msg.role === "user" ? "justify-end" : "justify-start"
                                )}
                            >
                                {msg.role !== "user" && (
                                    <div className={cn(
                                        "w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-lg ring-1 ring-white/10",
                                        msg.sender_name === "Synthesizer" ? "bg-gradient-to-br from-fuchsia-600/30 to-purple-600/30 backdrop-blur-md" :
                                            msg.sender_name === "System" ? "bg-red-500/20" :
                                                "bg-slate-800/50 backdrop-blur-md"
                                    )}>
                                        {msg.sender_name === "Synthesizer" ? <Sparkles className="w-5 h-5 text-fuchsia-300" /> :
                                            <Bot className="w-5 h-5 text-slate-300" />}
                                    </div>
                                )}

                                <div className={cn(
                                    "relative max-w-[85%] sm:max-w-[70%] rounded-2xl p-5 shadow-xl backdrop-blur-md border",
                                    msg.role === "user"
                                        ? "bg-cyan-600/20 border-cyan-500/20 text-cyan-50 rounded-tr-none shadow-cyan-900/10"
                                        : "bg-slate-900/60 border-white/5 text-slate-200 rounded-tl-none shadow-black/20"
                                )}>
                                    {msg.sender_name && (
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className={cn(
                                                "text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full border",
                                                msg.sender_name === "Synthesizer" ? "bg-fuchsia-500/10 border-fuchsia-500/20 text-fuchsia-400" :
                                                    "bg-slate-700/30 border-slate-600/30 text-slate-400"
                                            )}>
                                                {msg.sender_name}
                                            </span>
                                        </div>
                                    )}
                                    <div className="prose prose-invert prose-sm max-w-none leading-relaxed prose-p:my-1 prose-headings:text-slate-200 prose-strong:text-cyan-300">
                                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                                    </div>
                                </div>

                                {msg.role === "user" && (
                                    <div className="w-10 h-10 rounded-full bg-cyan-600/20 border border-cyan-500/20 flex items-center justify-center shrink-0 backdrop-blur-md">
                                        <User className="w-5 h-5 text-cyan-300" />
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {loading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex gap-5"
                        >
                            <div className="w-10 h-10 rounded-full bg-slate-800/40 border border-white/10 flex items-center justify-center animate-pulse">
                                <Bot className="w-5 h-5 text-slate-500" />
                            </div>
                            <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-4 flex items-center gap-3 text-slate-400 backdrop-blur-sm">
                                <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.3s] shadow-[0_0_10px_rgba(34,211,238,0.5)]"></span>
                                <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.15s] shadow-[0_0_10px_rgba(34,211,238,0.5)]"></span>
                                <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce shadow-[0_0_10px_rgba(34,211,238,0.5)]"></span>
                                <span className="text-sm ml-2 font-medium tracking-wide">Deliberating...</span>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Input Area */}
            <div className="p-6 bg-slate-950/40 backdrop-blur-2xl border-t border-white/5 sticky bottom-0 z-20">
                <div className="max-w-5xl mx-auto">
                    <form onSubmit={handleSubmit} className="relative group">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={selectedModel ? "Ask the swarm..." : "Select a model first..."}
                            disabled={loading}
                            className="w-full bg-black/40 border border-white/10 text-slate-200 rounded-2xl py-5 pl-6 pr-16 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/30 transition-all placeholder:text-slate-600 shadow-inner backdrop-blur-sm"
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || loading}
                            className="absolute right-3 top-3 bottom-3 aspect-square bg-gradient-to-br from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all transform hover:scale-105 active:scale-95"
                        >
                            <Send className="w-5 h-5" />
                        </button>

                        {/* Glow effect */}
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl blur opacity-0 group-focus-within:opacity-10 transition duration-700 -z-10"></div>
                    </form>
                    <div className="text-center mt-4">
                        <p className="text-[10px] text-slate-600 font-medium tracking-[0.2em] uppercase">
                            AI Consensus Engine v1.0 • Local Swarm Protocol
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
