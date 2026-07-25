"use client";

import { useState } from "react";
import { Search, Send, Paperclip, MoreVertical } from "lucide-react";

const conversations = [
  { name: "Leo Martinez", msg: "Could we move our session by 30 mins?", time: "12m ago", active: true, online: true, unread: true },
  { name: "Elena Vance", msg: "Thanks for the resources! The calculus notes were...", time: "2h ago", online: false },
  { name: "Julian Cross", msg: "Can you help with the midterm review tomorrow?", time: "5h ago", online: true },
  { name: "Sarah Chen", msg: "Great session today! See you next week.", time: "1d ago", online: false },
];

export default function MessagesPage() {
  const [selected, setSelected] = useState(0);
  const [input, setInput] = useState("");

  return (
    <div className="bg-background h-screen flex overflow-hidden">
      <div className="w-80 bg-surface border-r border-outline-variant flex flex-col">
        <div className="p-lg border-b border-outline-variant">
          <h2 className="font-headline-sm mb-md">Messages</h2>
          <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-on-surface-variant" /><input className="w-full pl-10 pr-4 py-2 rounded-xl border border-outline-variant bg-surface text-sm outline-none focus:ring-2 focus:ring-primary" placeholder="Search conversations..." /></div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.map((c, i) => (
            <button key={c.name} onClick={() => setSelected(i)} className={`w-full p-lg text-left border-b border-outline-variant hover:bg-surface-container-low transition-colors ${i === selected ? "bg-surface-container-low" : ""}`}>
              <div className="flex gap-md">
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center text-sm font-bold text-on-primary-fixed">{c.name.split(" ").map((n) => n[0]).join("")}</div>
                  {c.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-secondary border-2 border-surface rounded-full"></div>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start"><span className="font-label-md font-bold text-on-surface truncate">{c.name}</span><span className="font-label-sm text-on-surface-variant">{c.time}</span></div>
                  <p className="font-body-sm text-on-surface-variant truncate">{c.msg}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        <div className="p-lg border-b border-outline-variant flex items-center justify-between bg-surface">
          <div className="flex items-center gap-md">
            <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-sm font-bold text-on-primary-fixed">{conversations[selected].name.split(" ").map((n) => n[0]).join("")}</div>
            <div><h3 className="font-label-md font-bold">{conversations[selected].name}</h3><span className="font-label-sm text-secondary">Online</span></div>
          </div>
          <button><MoreVertical className="h-5 w-5 text-on-surface-variant" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-lg space-y-lg bg-surface-container-low">
          {[
            { msg: "Hi! I was reviewing the homework from last session.", sender: "them" },
            { msg: "I had a question about problem #3 - the optimization one.", sender: "them" },
            { msg: "Great question! Let me walk you through it step by step.", sender: "me" },
            { msg: "The key insight is to set up the constraint equation first.", sender: "me" },
          ].map((m, i) => (
            <div key={i} className={`flex ${m.sender === "me" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[70%] p-md rounded-2xl ${m.sender === "me" ? "bg-primary text-on-primary" : "bg-surface border border-outline-variant text-on-surface"}`}>
                <p className="font-body-sm">{m.msg}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="p-lg border-t border-outline-variant bg-surface">
          <div className="flex items-center gap-md bg-surface-container-low rounded-xl px-md py-2">
            <button><Paperclip className="h-5 w-5 text-on-surface-variant" /></button>
            <input value={input} onChange={(e) => setInput(e.target.value)} className="flex-1 bg-transparent border-none outline-none text-sm" placeholder="Type a message..." />
            <button className="p-2 bg-primary text-on-primary rounded-lg"><Send className="h-4 w-4" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
