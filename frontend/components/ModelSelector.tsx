"use client";

import { useState, useEffect } from "react";
import { ChevronDown, Database } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ModelSelectorProps {
    selectedModel: string;
    onModelSelect: (model: string) => void;
}

export default function ModelSelector({ selectedModel, onModelSelect }: ModelSelectorProps) {
    const [models, setModels] = useState<string[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    // Fetch models on mount
    useEffect(() => {
        async function fetchModels() {
            try {
                const res = await fetch("http://localhost:8000/models");
                if (res.ok) {
                    const data = await res.json();
                    // LM Studio returns a list of model IDs.
                    const modelList = data.models;
                    setModels(modelList);

                    // Auto-select first model if none selected and models exist
                    if (!selectedModel && modelList.length > 0) {
                        onModelSelect(modelList[0]);
                    }
                }
            } catch (e) {
                console.error("Failed to fetch models", e);
                setModels([]); // No fallback, be honest
            } finally {
                setLoading(false);
            }
        }
        fetchModels();
    }, [selectedModel, onModelSelect]);

    return (
        <div className="relative z-50">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 bg-white/5 dark:bg-slate-900/30 hover:bg-white/10 dark:hover:bg-slate-900/50 backdrop-blur-md border border-white/10 dark:border-white/10 hover:border-white/20 rounded-xl px-4 py-2 text-xs text-slate-200 transition-all font-medium shadow-lg shadow-black/20"
            >
                <Database className="w-3.5 h-3.5 text-cyan-400" />
                <span>{selectedModel || (loading ? "Connecting..." : "No Model Loaded")}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full right-0 mt-2 w-64 bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden ring-1 ring-black/50"
                    >
                        <div className="p-1 max-h-60 overflow-y-auto custom-scrollbar">
                            {models.map((m) => (
                                <button
                                    key={m}
                                    onClick={() => {
                                        onModelSelect(m);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full text-left px-3 py-2.5 text-xs rounded-lg transition-all border border-transparent ${selectedModel === m
                                            ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/30 font-semibold"
                                            : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                                        }`}
                                >
                                    <span className="line-clamp-1">{m}</span>
                                </button>
                            ))}
                            {models.length === 0 && !loading && (
                                <div className="px-4 py-3 text-xs text-slate-500 text-center">
                                    No models found in LM Studio.<br />
                                    <span className="opacity-70">Ensure Server is ON (Port 1234).</span>
                                </div>
                            )}
                            {loading && (
                                <div className="px-4 py-3 text-xs text-slate-500 text-center animate-pulse">
                                    Searching for models...
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
