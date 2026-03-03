import { MessageCircle } from 'lucide-react';
import { Chatbot } from '@/components/chat/Chatbot';

export default function ChatPage() {
  return (
    <div className="space-y-6 pt-12 lg:pt-0">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg hms-gradient-primary flex items-center justify-center">
          <MessageCircle className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Assistente IA</h1>
          <p className="text-muted-foreground">Tire suas dúvidas sobre suas finanças</p>
        </div>
      </div>

      <div className="hms-card p-0 overflow-hidden">
        <Chatbot />
      </div>
    </div>
  );
}
