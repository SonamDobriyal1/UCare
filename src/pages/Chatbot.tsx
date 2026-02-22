import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Bot, User, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Layout from "@/components/Layout";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const botResponses = [
  "I hear you, and I want you to know that your feelings are completely valid. It takes courage to share what you're going through.",
  "Thank you for trusting me with that. Remember, healing isn't linear — every small step forward counts.",
  "It sounds like you're carrying a lot right now. Would you like to explore some grounding techniques that might help?",
  "You're not alone in this. Many people have walked a similar path and found their way to recovery.",
  "That's a really important insight. Recognizing patterns is one of the first steps toward positive change.",
  "I'm here for you, anytime you need to talk. There's no judgment here — only support.",
  "Have you considered reaching out to our community forum? Sometimes connecting with others who understand can make a real difference.",
  "Let's take a moment to breathe together. Inhale for 4 counts, hold for 4, exhale for 4. How does that feel?",
];

const suggestedPrompts = [
  "I'm feeling overwhelmed today",
  "How can I support a loved one?",
  "Tell me about coping strategies",
  "I need someone to talk to",
];

const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      text: "Hi there! I'm UCare's AI companion. I'm here to listen, support, and guide you. How are you feeling today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: messages.length,
      text: text.trim(),
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const botMsg: Message = {
        id: messages.length + 1,
        text: botResponses[Math.floor(Math.random() * botResponses.length)],
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 1200 + Math.random() * 800);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <Layout>
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-2xl mx-auto mb-10"
          >
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary mb-3">
              AI Companion
            </span>
            <h1 className="text-3xl md:text-4xl font-serif font-semibold text-foreground mb-4">
              Talk to UCare
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              A safe, judgment-free space to express yourself. Our AI companion is here to listen and support you 24/7.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-card border border-border rounded-2xl overflow-hidden flex flex-col h-[520px]">
              {/* Chat header */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-border bg-secondary/50">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">UCare AI</p>
                  <p className="text-xs text-muted-foreground">Always here for you</p>
                </div>
                <div className="ml-auto flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-xs text-muted-foreground">Online</span>
                </div>
              </div>

              {/* Messages */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className={`flex gap-3 ${msg.sender === "user" ? "flex-row-reverse" : ""}`}
                  >
                    <Avatar className="w-8 h-8 shrink-0">
                      <AvatarFallback className={msg.sender === "bot" ? "bg-primary/10 text-primary" : "bg-accent text-accent-foreground"}>
                        {msg.sender === "bot" ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                        msg.sender === "user"
                          ? "bg-primary text-primary-foreground rounded-br-md"
                          : "bg-secondary text-foreground rounded-bl-md"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </motion.div>
                ))}

                {isTyping && (
                  <div className="flex gap-3">
                    <Avatar className="w-8 h-8 shrink-0">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-secondary rounded-2xl rounded-bl-md px-4 py-3 flex gap-1">
                      <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:0ms]" />
                      <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:150ms]" />
                      <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:300ms]" />
                    </div>
                  </div>
                )}
              </div>

              {/* Suggested prompts */}
              {messages.length <= 1 && (
                <div className="px-5 pb-2 flex flex-wrap gap-2">
                  {suggestedPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => sendMessage(prompt)}
                      className="text-xs border border-border rounded-full px-3 py-1.5 text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
                    >
                      <Sparkles className="inline h-3 w-3 mr-1" />
                      {prompt}
                    </button>
                  ))}
                </div>
              )}

              {/* Input */}
              <form onSubmit={handleSubmit} className="flex items-center gap-2 px-4 py-3 border-t border-border">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 border-0 bg-secondary/50 focus-visible:ring-1"
                />
                <Button type="submit" size="icon" disabled={!input.trim() || isTyping}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Chatbot;
