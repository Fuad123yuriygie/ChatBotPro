"use client";

import { useState } from "react";
import { Plus, Trash2, Users, Play, Moon, Sun, Sparkles, Bot, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import ChatInterface from "@/components/ChatInterface";
import { AgentConfig } from "@/types";

const DEFAULT_AGENTS: AgentConfig[] = [
  {
    name: "The Skeptic",
    system_prompt: "You are a skeptical critic. You question assumptions, demand evidence, and look for flaws in logic. You are not mean, just rigorous."
  },
  {
    name: "The Visionary",
    system_prompt: "You are a visionary futurist. You see the big picture, long-term implications, and optimistic possibilities. You inspire and expand thinking."
  },
  {
    name: "The Pragmatist",
    system_prompt: "You are a grounded pragmatist. You focus on execution, feasibility, and real-world constraints. You care about 'how', not just 'what'."
  }
];

export default function Home() {
  const [started, setStarted] = useState(false);
  const [agents, setAgents] = useState<AgentConfig[]>(DEFAULT_AGENTS);
  const { theme, setTheme } = useTheme();

  const addAgent = () => {
    setAgents([...agents, { name: "New Agent", system_prompt: "You are a helpful assistant." }]);
  };

  const removeAgent = (index: number) => {
    setAgents(agents.filter((_, i) => i !== index));
  };

  const updateAgent = (index: number, field: keyof AgentConfig, value: string) => {
    const newAgents = [...agents];
    newAgents[index] = { ...newAgents[index], [field]: value };
    setAgents(newAgents);
  };

  if (started) {
    return (
      <div className="relative h-screen overflow-hidden bg-black selection:bg-purple-500/30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,_#2a1b3d_0%,_#000000_100%)] opacity-50" />
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[100px]" />
        </div>
        <div className="relative z-10 h-full">
          <ChatInterface agents={agents} />
        </div>
        <button
          onClick={() => setStarted(false)}
          className="absolute top-6 right-6 z-50 p-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full hover:bg-white/10 hover:border-white/20 transition-all text-slate-300 hover:text-white shadow-lg"
          title="Configure Agents"
        >
          <Bot className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <main className="min-h-screen relative text-slate-200 selection:bg-cyan-500/30 overflow-x-hidden font-sans">

      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-purple-900/20 blur-[120px] rounded-full" />
        <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-indigo-600/10 blur-[100px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-900/10 blur-[100px] rounded-full mix-blend-screen" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">

        {/* Header */}
        <header className="flex justify-between items-center mb-24">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-xl blur opacity-40 group-hover:opacity-60 transition-opacity" />
              <div className="relative p-3 bg-black/40 border border-white/10 rounded-xl backdrop-blur-md shadow-2xl">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold tracking-tight text-white">
                Chat Bot <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Pro</span>
              </h1>
              <span className="text-xs text-slate-500 font-medium tracking-wide uppercase">Orchestrate Intelligence</span>
            </div>
          </div>

          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-slate-400 hover:text-white shadow-lg backdrop-blur-md"
          >
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </header>

        {/* Hero Text */}
        <div className="text-center mb-20 space-y-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.1)] backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4" />
            <span className="tracking-wide">AI COUNCIL CONFIGURATION</span>
          </motion.div>

          <h2 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight drop-shadow-2xl">
            Design Your <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-purple-200 to-purple-400">swarms of thought.</span>
          </h2>

          <p className="text-slate-400 max-w-2xl mx-auto text-xl font-light leading-relaxed">
            Assemble a council of specialized AI agents. Define their personas, assign their directives, and watch them synthesize brilliance.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:gglass p-8 rounded-2xl space-y-4rid-cols-3 gap-8 mb-16">
          <AnimatePresence mode="popLayout">
            {agents.map((agent, idx) => (
              <motion.div
                key={idx}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                className="group relative flex flex-col h-full"
              >
                {/* Glass Card */}
                <div className="absolute inset-0 bg-white/[0.02] backdrop-blur-2xl rounded-3xl border border-white/10 group-hover:bg-white/[0.04] group-hover:border-purple-500/20 transition-all duration-500 shadow-xl" />

                {/* Glow Effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-b from-purple-500/20 to-cyan-500/20 rounded-3xl blur opacity-0 group-hover:opacity-100 transition duration-500" />

                <div className="relative flex flex-col p-8 h-full z-10">
                  {/* Remove Button */}
                  {agents.length > 1 && (
                    <button
                      onClick={() => removeAgent(idx)}
                      className="absolute top-4 right-4 p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}

                  {/* Header */}
                  <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl border border-white/10 shadow-inner group-hover:scale-110 transition-transform duration-500">
                      <Bot className="w-6 h-6 text-indigo-300" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Agent Name</label>
                      <input
                        type="text"
                        value={agent.name}
                        onChange={(e) => updateAgent(idx, "name", e.target.value)}
                        className="w-full bg-transparent border-none text-xl font-semibold text-white placeholder-slate-600 focus:ring-0 p-0 focus:text-purple-300 transition-colors truncate"
                        placeholder="Name..."
                      />
                    </div>
                  </div>

                  {/* Body */}
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      System Directive
                      <div className="h-px flex-1 bg-white/10" />
                    </label>
                    <textarea
                      value={agent.system_prompt}
                      onChange={(e) => updateAgent(idx, "system_prompt", e.target.value)}
                      className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-white placeholder-white/20 transition-all"
                      placeholder="Instruct this agent on how to behave..."
                    />
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Add Agent Button */}
            <motion.button
              layout
              onClick={addAgent}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group relative flex flex-col items-center justify-center gap-5 min-h-[350px] rounded-3xl border border-dashed border-white/10 hover:border-cyan-500/30 bg-white/[0.01] hover:bg-cyan-900/5 transition-all duration-300"
            >
              <div className="p-5 bg-white/5 rounded-full group-hover:bg-cyan-500/10 group-hover:scale-110 transition-all duration-300 shadow-lg">
                <Plus className="w-8 h-8 text-slate-400 group-hover:text-cyan-400" />
              </div>
              <div className="text-center">
                <span className="block text-base font-medium text-slate-300 group-hover:text-cyan-300 transition-colors">Summon New Agent</span>
                <span className="text-xs text-slate-500 mt-1 block">Add another perspective to the council</span>
              </div>
            </motion.button>
          </AnimatePresence>
        </div>

        {/* Footer / CTA */}
        <div className="flex justify-center pb-20">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setStarted(true)}
            className="group relative px-10 py-5 bg-white text-black rounded-full font-bold text-lg shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_-15px_rgba(255,255,255,0.5)] transition-all overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-200 via-white to-cyan-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative flex items-center gap-3">
              <Play className="w-5 h-5 fill-current" />
              Initialize Session
            </span>
          </motion.button>
        </div>

      </div>
    </main>
  );
}
