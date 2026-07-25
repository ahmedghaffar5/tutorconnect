"use client";

import { useState } from "react";
import { Search, Send, Paperclip, MoreVertical } from "lucide-react";

const conversations = [
  { name: "Leo Martinez", msg: "Could we move our session by 30 mins?", time: "12m ago", active: true, online: true, img: "/images/stitch/collaboration_messaging_center-0.jpg" },
  { name: "Elena Vance", msg: "Thanks for the resources! The calculus notes were...", time: "2h ago", online: false, img: "/images/stitch/collaboration_messaging_center-1.jpg" },
  { name: "Julian Cross", msg: "Can you help with the midterm review tomorrow?", time: "5h ago", online: true, img: "/images/stitch/collaboration_messaging_center-2.jpg" },
  { name: "Sarah Chen", msg: "Great session today! See you next week.", time: "1d ago", online: false, img: "/images/stitch/collaboration_messaging_center-3.jpg" },
];

export default function MessagesPage() {
  const [selected, setSelected] = useState(0);
  const [input, setInput] = useState("");

  return (
    <div className="bg-[#f8f9ff] h-screen flex overflow-hidden">
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-5 border-b border-gray-100">
          <h2 className="text-xl font-bold mb-4">Messages</h2>
          <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" /><input className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:ring-2 focus:ring-indigo-400" placeholder="Search conversations..." /></div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.map((c, i) => (
            <button key={c.name} onClick={() => setSelected(i)} className={`w-full p-4 text-left border-b border-gray-50 hover:bg-gray-50 transition-colors ${i === selected ? "bg-indigo-50" : ""}`}>
              <div className="flex gap-3"><img src={c.img} alt="" className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" />
                <div className="flex-1 min-w-0"><div className="flex justify-between items-start"><span className="text-sm font-bold text-gray-900 truncate">{c.name}</span><span className="text-xs text-gray-400">{c.time}</span></div><p className="text-xs text-gray-400 truncate mt-0.5">{c.msg}</p></div>
              </div>
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <img src={conversations[selected].img} alt="" className="w-10 h-10 rounded-full object-cover" />
            <div><h3 className="text-sm font-bold text-gray-900">{conversations[selected].name}</h3><span className="text-xs text-emerald-600 font-medium">Online</span></div>
          </div>
          <button><MoreVertical className="h-5 w-5 text-gray-400" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50">
          {[
            { msg: "Hi! I was reviewing the homework from last session.", sender: "them" },
            { msg: "I had a question about problem #3 - the optimization one.", sender: "them" },
            { msg: "Great question! Let me walk you through it step by step.", sender: "me" },
            { msg: "The key insight is to set up the constraint equation first.", sender: "me" },
          ].map((m, i) => (
            <div key={i} className={`flex ${m.sender === "me" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[70%] p-4 rounded-2xl ${m.sender === "me" ? "bg-indigo-600 text-white" : "bg-white border border-gray-100 text-gray-900"}`}>
                <p className="text-sm">{m.msg}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-2"><button><Paperclip className="h-5 w-5 text-gray-400" /></button>
            <input value={input} onChange={(e) => setInput(e.target.value)} className="flex-1 bg-transparent border-none outline-none text-sm" placeholder="Type a message..." />
            <button className="p-2 bg-indigo-600 text-white rounded-lg"><Send className="h-4 w-4" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
