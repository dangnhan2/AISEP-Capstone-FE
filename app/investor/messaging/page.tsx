"use client";

import { InvestorShell } from "@/components/investor/investor-shell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Video, Phone, Paperclip, Send } from "lucide-react";
import { useState } from "react";

type Conversation = {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread?: number;
  active?: boolean;
};

type Message = {
  id: number;
  sender: "me" | "them";
  content: string;
  timestamp: string;
  offerCard?: {
    id: string;
    amount: string;
    equity: string;
    status: string;
  };
};

const conversations: Conversation[] = [
  {
    id: 1,
    name: "Innovate Solutions",
    avatar: "💡",
    lastMessage: "Sounds good, looking forward to it!",
    timestamp: "10:30 AM",
    unread: 2,
    active: true,
  },
  {
    id: 2,
    name: "Quantum Leap Robotics",
    avatar: "🤖",
    lastMessage: "We're finalizing the pitch deck.",
    timestamp: "Yesterday",
  },
  {
    id: 3,
    name: "Green Eco-Tech",
    avatar: "🌱",
    lastMessage: "Thanks for the feedback!",
    timestamp: "Mar 12",
    unread: 1,
  },
  {
    id: 4,
    name: "Synapse Analytics",
    avatar: "📊",
    lastMessage: "Could you clarify the terms on item 37",
    timestamp: "Feb 28",
  },
];

const messages: Message[] = [
  {
    id: 1,
    sender: "them",
    content:
      "Hi Sarah, we've reviewed your offer for $500K and are excited about the terms. When would be a good time to discuss further?",
    timestamp: "Yesterday, 9:45 AM",
  },
  {
    id: 2,
    sender: "me",
    content:
      "Great to hear! I'm available tomorrow morning. Does 10 AM work for your team?",
    timestamp: "Yesterday, 10:00 AM",
  },
  {
    id: 3,
    sender: "them",
    content:
      "Yes, 10 AM works perfectly. Also, regarding the due diligence documents, could you specify which ones you need first?",
    timestamp: "Yesterday, 10:15 AM",
  },
  {
    id: 4,
    sender: "me",
    content: "Sure, you can review the full offer details here:",
    timestamp: "10:30 AM",
    offerCard: {
      id: "AISEP-INV-00123",
      amount: "$500,000",
      equity: "10%",
      status: "Pending Startup Review",
    },
  },
  {
    id: 5,
    sender: "me",
    content:
      "For the documents, I'll send a separate list. Let me know if you have any questions before then.",
    timestamp: "10:30 AM",
  },
];

const quickReplies = ["Sounds good!", "Will do.", "Let's schedule a call."];

export default function InvestorMessagingPage() {
  const [selectedConversation, setSelectedConversation] = useState(
    conversations[0]
  );
  const [messageInput, setMessageInput] = useState("");

  return (
    <InvestorShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Messaging</h1>
        </div>

        <div className="flex gap-4 h-[calc(100vh-240px)]">
          {/* Conversations List */}
          <div className="w-96 bg-white rounded-lg border border-slate-200 flex flex-col">
            <div className="p-4 border-b border-slate-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search conversations..."
                  className="pl-10 bg-slate-50 border-slate-200"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv)}
                  className={`flex items-start gap-3 p-4 cursor-pointer border-b border-slate-100 hover:bg-slate-50 ${
                    conv.active ? "bg-blue-50" : ""
                  }`}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center text-2xl flex-shrink-0">
                    {conv.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-semibold text-sm text-slate-900 truncate">
                        {conv.name}
                      </h3>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs text-slate-500">
                          {conv.timestamp}
                        </span>
                        {conv.unread && (
                          <Badge className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center p-0">
                            {conv.unread}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 truncate">
                      {conv.lastMessage}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 bg-white rounded-lg border border-slate-200 flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center text-2xl">
                  {selectedConversation.avatar}
                </div>
                <div>
                  <h2 className="font-semibold text-slate-900">
                    {selectedConversation.name}
                  </h2>
                  <Button
                    variant="link"
                    className="text-blue-600 hover:text-blue-700 p-0 h-auto text-sm"
                  >
                    📄 View Profile
                  </Button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="border-slate-300"
                >
                  <Video className="w-5 h-5 text-slate-600" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="border-slate-300"
                >
                  <Phone className="w-5 h-5 text-slate-600" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "me" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[70%] ${
                      message.sender === "me" ? "items-end" : "items-start"
                    } flex flex-col gap-1`}
                  >
                    <div
                      className={`rounded-2xl px-4 py-3 ${
                        message.sender === "me"
                          ? "bg-cyan-500 text-white"
                          : "bg-slate-100 text-slate-900"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>

                    {message.offerCard && (
                      <div className="bg-cyan-500 text-white rounded-2xl p-4 mt-2 space-y-2">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">📄</span>
                          <div>
                            <p className="font-semibold text-sm">
                              Offer ID: {message.offerCard.id}
                            </p>
                            <p className="text-xs opacity-90">
                              Amount: {message.offerCard.amount} | Equity:{" "}
                              {message.offerCard.equity}
                            </p>
                          </div>
                        </div>
                        <Badge className="bg-orange-500 text-white text-xs hover:bg-orange-600 w-full justify-center py-1">
                          {message.offerCard.status}
                        </Badge>
                      </div>
                    )}

                    <span
                      className={`text-xs text-slate-500 px-2 ${
                        message.sender === "me" ? "text-right" : "text-left"
                      }`}
                    >
                      {message.timestamp}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Replies */}
            <div className="px-6 py-3 border-t border-slate-200">
              <div className="flex gap-2 mb-3">
                {quickReplies.map((reply, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="text-xs border-slate-300 hover:bg-slate-50"
                    onClick={() => setMessageInput(reply)}
                  >
                    {reply}
                  </Button>
                ))}
              </div>

              {/* Message Input */}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-slate-600 hover:bg-slate-100"
                >
                  <Paperclip className="w-5 h-5" />
                </Button>
                <Input
                  placeholder="Type your message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  className="flex-1"
                />
                <Button
                  size="icon"
                  className="bg-blue-600 text-white hover:bg-blue-700"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </InvestorShell>
  );
}
