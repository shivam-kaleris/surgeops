import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Send, Bot, User, ExternalLink } from "lucide-react";

interface ChatMessage {
  id: string;
  type: "user" | "assistant";
  message: string;
  timestamp: Date;
  sources?: Array<{
    title: string;
    snippet: string;
    uri: string;
  }>;
}

export function SurgeOpsChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      type: "assistant",
      message: "Hello! I'm your SurgeOps AI Assistant. I can help you with vessel scheduling, yard allocations, surge predictions, and operational queries. How can I assist you today?",
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sampleQueries = [
    "Which vessels are arriving in the next 48 hours?",
    "What's the lowest utilized yard block?",
    "Show me current weather impact on operations",
    "Suggest allocation for MV Ocean Grace"
  ];

  const mockResponses = [
    {
      message: "Based on current data, 3 vessels are arriving in the next 48 hours: MV Ocean Grace (1,850 TEU, ETA 14:30), MSC Determination (2,100 TEU, ETA tomorrow 08:15), and COSCO Fortune (1,650 TEU, ETA tomorrow 16:45). Total expected: 5,600 TEU.",
      sources: [
        { title: "Vessel Schedule Database", snippet: "Real-time vessel tracking and ETA updates", uri: "/data/vessels" }
      ]
    },
    {
      message: "Block B5 has the lowest utilization at 62.3% (872/1,400 TEU). It's a Standard category block with 528 TEU available capacity. This makes it ideal for incoming standard container allocations.",
      sources: [
        { title: "Yard Utilization Report", snippet: "Live yard block capacity monitoring", uri: "/data/yards" }
      ]
    },
    {
      message: "Current weather: 28.5°C, wind 18.2 km/h, humidity 76%. Operational impact: Medium. Wind conditions are approaching the 20 km/h threshold that may affect crane operations. Monitor for further increases.",
      sources: [
        { title: "Weather Monitoring System", snippet: "Real-time weather data and operational impact assessment", uri: "/data/weather" }
      ]
    },
    {
      message: "For MV Ocean Grace (1,850 TEU, Reefer cargo), I recommend Block B3 which has 312 TEU available capacity (61.0% utilized). As a Reefer-category block, it's equipped with proper refrigeration infrastructure. Alternative: Block B5 if refrigeration isn't critical.",
      sources: [
        { title: "Cargo Allocation Guidelines", snippet: "Best practices for container type matching", uri: "/docs/allocation-sop" }
      ]
    }
  ];

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      message: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Simulate AI response delay
    setTimeout(() => {
      const responseIndex = Math.floor(Math.random() * mockResponses.length);
      const response = mockResponses[responseIndex];
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        message: response.message,
        timestamp: new Date(),
        sources: response.sources
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleSampleQuery = (query: string) => {
    setInputValue(query);
  };

  return (
    <Card className="bg-card shadow-card border-0 hover:shadow-glow transition-all duration-300 h-[400px] flex flex-col">
      <CardHeader className="flex-shrink-0 bg-gradient-ocean text-white">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-base font-semibold">
            <div className="p-1.5 bg-white/10 rounded-lg">
              <MessageSquare className="h-4 w-4" />
            </div>
            <div>
              <div className="text-white">SurgeOps AI Assistant</div>
              <div className="text-xs text-primary-foreground/80 font-normal">RAG-powered operational queries</div>
            </div>
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <span className="text-xs text-primary-foreground/80">Live</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden flex flex-col pt-4">
        {/* Quick Actions */}
        <div className="flex-shrink-0 mb-4">
          <h3 className="text-xs font-medium text-muted-foreground mb-2">Try asking:</h3>
          <div className="space-y-1">
            {sampleQueries.slice(0, 2).map((query, index) => (
              <button
                key={index}
                onClick={() => setInputValue(query)}
                className="w-full text-left text-xs px-3 py-2 bg-muted/50 hover:bg-muted rounded-lg border border-border/50 hover:border-border transition-colors"
              >
                {query}
              </button>
            ))}
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto space-y-3 min-h-0 mb-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] rounded-lg px-3 py-2 ${
                  message.type === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted/50 text-foreground'
                }`}>
                  <div className="flex items-start gap-2">
                    {message.type === 'assistant' && (
                      <Bot className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="text-xs leading-relaxed">
                        {message.message}
                      </p>
                      {message.sources && (
                        <div className="mt-2 space-y-1">
                          {message.sources.map((source, index) => (
                            <div key={index} className="text-xs">
                              <button className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors">
                                <ExternalLink className="h-3 w-3" />
                                <span className="underline">{source.title}</span>
                              </button>
                              <p className="text-muted-foreground text-xs mt-1">{source.snippet}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-muted/50 rounded-lg px-3 py-2">
                <div className="flex items-center gap-2">
                  <Bot className="h-4 w-4 text-primary" />
                  <div className="flex gap-1">
                    <div className="w-1 h-1 bg-primary rounded-full animate-bounce"></div>
                    <div className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Input section */}
        <div className="flex-shrink-0">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about vessels, yards, weather..."
              className="flex-1 text-xs"
              disabled={isLoading}
            />
            <Button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              size="sm"
              className="px-3"
            >
              <Send className="h-3 w-3" />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}