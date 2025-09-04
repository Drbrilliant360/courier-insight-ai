import { useState } from "react";
import { Send, Bot, User, Sparkles } from "lucide-react";
import { MetricCard } from "@/components/ui/metric-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Message {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: Date;
}

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm your AI Delivery Intelligence Assistant. I can help you with courier performance analysis, delivery predictions, and anomaly detection. What would you like to know?",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");

  const suggestedQueries = [
    "Which courier has the highest reliability score today?",
    "Which city had the most anomalies this week?",
    "Predict ETA for Order ID #12345",
    "Show me delivery performance trends",
    "Which zones need more couriers?",
    "What's the average delivery time in Manhattan?"
  ];

  const botResponses = {
    reliability: "Based on today's data, John Smith has the highest reliability score of 98/100 with 156 deliveries completed and 98.7% on-time rate. He's earned the ⚡ Speed Demon and 🏆 Champion badges.",
    anomalies: "This week, Manhattan had the most anomalies with 5 incidents detected. The main issues were route deviations (60%) and extended delays (40%). Brooklyn and Queens had significantly fewer with 3 and 2 anomalies respectively.",
    eta: "For Order ID #12345: Predicted ETA is 18 minutes with 94% confidence. The delivery is currently on track, assigned to Maria Garcia who has a 96% reliability score.",
    trends: "Delivery performance trends show: Peak efficiency between 10-11 AM (22 min avg), highest volume at 1 PM (85 deliveries/hour), and 92.7% overall completion rate this week - up 2.3% from last week.",
    zones: "Zone analysis indicates Queens and Staten Island need additional courier coverage. Current average delivery times: Queens (28 min) and Staten Island (35 min) exceed our 25-minute target.",
    manhattan: "Manhattan's average delivery time is 22 minutes with 425 total deliveries today. Performance is excellent with only 5 anomalies detected and 94% on-time completion rate."
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Simulate bot response
    setTimeout(() => {
      let botResponse = "I understand your question. Let me analyze the current delivery data and provide you with insights...";
      
      // Simple keyword matching for demo
      const query = inputValue.toLowerCase();
      if (query.includes("reliability") || query.includes("highest")) {
        botResponse = botResponses.reliability;
      } else if (query.includes("anomal") || query.includes("city")) {
        botResponse = botResponses.anomalies;
      } else if (query.includes("eta") || query.includes("12345")) {
        botResponse = botResponses.eta;
      } else if (query.includes("trend") || query.includes("performance")) {
        botResponse = botResponses.trends;
      } else if (query.includes("zone") || query.includes("courier")) {
        botResponse = botResponses.zones;
      } else if (query.includes("manhattan") || query.includes("average")) {
        botResponse = botResponses.manhattan;
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: botResponse,
        isBot: true,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    }, 1000);

    setInputValue("");
  };

  const handleSuggestedQuery = (query: string) => {
    setInputValue(query);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">AI Assistant</h1>
        <p className="text-muted-foreground mt-1">
          Ask questions about delivery performance, predictions, and analytics
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Interface */}
        <MetricCard title="Chat with AI Assistant" className="lg:col-span-2" glow>
          <div className="space-y-4">
            {/* Messages */}
            <div className="h-96 overflow-y-auto space-y-4 p-4 bg-muted/20 rounded-lg">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start space-x-3 ${
                    message.isBot ? "justify-start" : "justify-end"
                  }`}
                >
                  {message.isBot && (
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                      message.isBot
                        ? "bg-card border border-border"
                        : "bg-primary text-primary-foreground"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                  {!message.isBot && (
                    <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="flex space-x-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask me about delivery analytics..."
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1"
              />
              <Button onClick={handleSendMessage} className="px-3">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </MetricCard>

        {/* Suggested Queries */}
        <MetricCard title="Suggested Questions">
          <div className="space-y-3">
            <div className="flex items-center space-x-2 mb-4">
              <Sparkles className="w-5 h-5 text-accent" />
              <span className="text-sm font-medium text-foreground">Try asking:</span>
            </div>
            {suggestedQueries.map((query, index) => (
              <button
                key={index}
                onClick={() => handleSuggestedQuery(query)}
                className="w-full text-left p-3 bg-muted/30 hover:bg-muted/50 rounded-lg transition-colors border border-transparent hover:border-primary/20"
              >
                <p className="text-sm text-foreground">{query}</p>
              </button>
            ))}
          </div>
        </MetricCard>
      </div>

      {/* AI Capabilities */}
      <MetricCard title="AI Assistant Capabilities">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Bot className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-medium text-foreground mb-2">Performance Analysis</h3>
            <p className="text-sm text-muted-foreground">
              Get insights on courier performance, delivery times, and completion rates
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-6 h-6 text-secondary" />
            </div>
            <h3 className="font-medium text-foreground mb-2">Predictive Analytics</h3>
            <p className="text-sm text-muted-foreground">
              Get ETA predictions, demand forecasting, and route optimization suggestions
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Bot className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-medium text-foreground mb-2">Anomaly Detection</h3>
            <p className="text-sm text-muted-foreground">
              Identify unusual patterns, potential fraud, and optimization opportunities
            </p>
          </div>
        </div>
      </MetricCard>
    </div>
  );
}