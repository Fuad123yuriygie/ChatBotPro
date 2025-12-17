export interface Message {
    role: "user" | "assistant" | "system";
    content: string;
    sender_name?: string;
}

export interface ChatResponse {
    messages: Message[];
    final_synthesis: string;
}

export interface AgentConfig {
    name: string;
    system_prompt: string;
}
