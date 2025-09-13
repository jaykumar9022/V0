"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Rocket, Send, Minimize2, Maximize2, X, Sparkles, Calendar, Users, MapPin } from "lucide-react"

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
  suggestions?: string[]
}

interface AISuggestion {
  type: "conflict" | "optimization" | "recommendation"
  title: string
  description: string
  action: string
  priority: "high" | "medium" | "low"
}

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "assistant",
      content:
        "Hello! I'm your AI scheduling assistant. I can help you optimize timetables, resolve conflicts, and provide intelligent suggestions. How can I assist you today?",
      timestamp: new Date(),
      suggestions: [
        "Check for scheduling conflicts",
        "Optimize classroom utilization",
        "Suggest faculty workload balance",
        "Generate alternative schedules",
      ],
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const suggestions: AISuggestion[] = [
    {
      type: "conflict",
      title: "Faculty Conflict Detected",
      description: "Dr. Smith is scheduled for two classes at 10:00 AM on Monday",
      action: "Reschedule one class",
      priority: "high",
    },
    {
      type: "optimization",
      title: "Classroom Underutilized",
      description: "Room A-101 has only 60% utilization this week",
      action: "Move smaller classes here",
      priority: "medium",
    },
    {
      type: "recommendation",
      title: "Workload Imbalance",
      description: "Prof. Johnson has 8 hours while Dr. Brown has only 4 hours",
      action: "Redistribute subjects",
      priority: "medium",
    },
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputValue)
      setMessages((prev) => [...prev, aiResponse])
      setIsTyping(false)
    }, 1500)
  }

  const generateAIResponse = (userInput: string): Message => {
    const input = userInput.toLowerCase()

    if (input.includes("conflict")) {
      return {
        id: Date.now().toString(),
        type: "assistant",
        content:
          "I've analyzed your current timetable and found 2 scheduling conflicts. Dr. Smith has overlapping classes on Monday at 10:00 AM, and Room B-205 is double-booked on Wednesday at 2:00 PM. Would you like me to suggest alternative time slots?",
        timestamp: new Date(),
        suggestions: ["Show conflict details", "Suggest alternatives", "Auto-resolve conflicts"],
      }
    }

    if (input.includes("optimize") || input.includes("utilization")) {
      return {
        id: Date.now().toString(),
        type: "assistant",
        content:
          "Based on current data, I can improve your schedule efficiency by 23%. I recommend moving 3 classes to underutilized rooms and adjusting 2 time slots to balance faculty workload. This will increase overall classroom utilization from 67% to 85%.",
        timestamp: new Date(),
        suggestions: ["Apply optimizations", "View detailed analysis", "Compare scenarios"],
      }
    }

    if (input.includes("faculty") || input.includes("workload")) {
      return {
        id: Date.now().toString(),
        type: "assistant",
        content:
          "Faculty workload analysis shows some imbalances. Dr. Smith has 12 hours/week while Prof. Davis has only 6 hours. I can redistribute 2 subjects to create a more balanced schedule. This will also reduce potential conflicts.",
        timestamp: new Date(),
        suggestions: ["Balance workload", "View faculty schedules", "Suggest redistributions"],
      }
    }

    if (input.includes("generate") || input.includes("create")) {
      return {
        id: Date.now().toString(),
        type: "assistant",
        content:
          "I can generate an optimized timetable for your selected batches. Using advanced algorithms, I'll consider all constraints including faculty availability, classroom capacity, and student preferences. The process typically takes 2-3 minutes.",
        timestamp: new Date(),
        suggestions: ["Start generation", "Set preferences", "View sample output"],
      }
    }

    // Default response
    return {
      id: Date.now().toString(),
      type: "assistant",
      content:
        "I understand you're looking for help with scheduling. I can assist with conflict resolution, optimization suggestions, faculty workload balancing, and generating new timetables. What specific area would you like to focus on?",
      timestamp: new Date(),
      suggestions: ["Check for conflicts", "Optimize schedules", "Balance faculty workload", "Generate new timetable"],
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "conflict":
        return <Calendar className="w-4 h-4" />
      case "optimization":
        return <Sparkles className="w-4 h-4" />
      case "recommendation":
        return <Users className="w-4 h-4" />
      default:
        return <MapPin className="w-4 h-4" />
    }
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 animate-bounce"
        >
          <Rocket className="w-6 h-6 text-white" />
        </Button>
        <div className="absolute -top-12 right-0 bg-foreground text-background px-3 py-1 rounded-lg text-sm whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity">
          AI Assistant
        </div>
      </div>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className={`w-96 shadow-2xl transition-all duration-300 ${isMinimized ? "h-16" : "h-[600px]"}`}>
        <CardHeader className="pb-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Rocket className="w-4 h-4" />
              </div>
              <div>
                <CardTitle className="text-base">AI Scheduling Assistant</CardTitle>
                <div className="text-xs opacity-90">Online • Ready to help</div>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-white hover:bg-white/20 w-8 h-8 p-0"
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 w-8 h-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0 flex flex-col h-[calc(600px-80px)]">
            {/* AI Suggestions */}
            <div className="p-4 border-b bg-muted/30">
              <h4 className="text-sm font-semibold mb-2 flex items-center">
                <Sparkles className="w-4 h-4 mr-2 text-primary" />
                Smart Suggestions
              </h4>
              <div className="space-y-2">
                {suggestions.slice(0, 2).map((suggestion, index) => (
                  <div key={index} className="flex items-center space-x-2 text-xs">
                    <div className={`w-2 h-2 rounded-full ${getPriorityColor(suggestion.priority)}`}></div>
                    <div className="flex-1">
                      <div className="font-medium">{suggestion.title}</div>
                      <div className="text-muted-foreground">{suggestion.description}</div>
                    </div>
                    {getTypeIcon(suggestion.type)}
                  </div>
                ))}
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.type === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <div className="text-sm">{message.content}</div>
                      {message.suggestions && (
                        <div className="mt-2 space-y-1">
                          {message.suggestions.map((suggestion, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              className="text-xs h-6 mr-1 mb-1 bg-transparent"
                              onClick={() => handleSuggestionClick(suggestion)}
                            >
                              {suggestion}
                            </Button>
                          ))}
                        </div>
                      )}
                      <div className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-muted text-muted-foreground p-3 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-current rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-current rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div ref={messagesEndRef} />
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask me about scheduling..."
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} size="sm" className="px-3">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}
