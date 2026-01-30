import { useState } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { useFinancial } from '@/contexts/FinancialContext';
import { cn } from '@/lib/utils';

export function Chatbot() {
  const { chatMessages, addChatMessage, analysis, expenses } = useFinancial();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const generateResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase();
    
    if (!analysis) {
      return 'Ainda não há análise disponível. Por favor, insira seus dados financeiros na tela "Gerar Análise" e clique em "Gerar Análise Completa" para que eu possa ajudá-lo melhor.';
    }

    // Perguntas sobre aumento de gastos
    if (lowerQuestion.includes('aumentaram') || lowerQuestion.includes('aumento')) {
      if (analysis.evolution.categoriesAtRisk.length > 0) {
        return `Com base nos dados inseridos, identifiquei que as categorias ${analysis.evolution.categoriesAtRisk.join(', ')} apresentaram aumento significativo. ${analysis.evolution.message}`;
      }
      return 'Com base nos padrões identificados, seus gastos estão relativamente estáveis, sem variações significativas de aumento.';
    }

    // Maior categoria
    if (lowerQuestion.includes('maior') || lowerQuestion.includes('pesa') || lowerQuestion.includes('categoria')) {
      return `A categoria que mais representa no seu orçamento é ${analysis.biggestCategory.name}, correspondendo a ${analysis.biggestCategory.percentage}% do total (R$ ${analysis.biggestCategory.value.toLocaleString('pt-BR')}).`;
    }

    // Mudanças recentes
    if (lowerQuestion.includes('mudou') || lowerQuestion.includes('mudança') || lowerQuestion.includes('últimos meses')) {
      const improving = analysis.evolution.categoriesImproving;
      const atRisk = analysis.evolution.categoriesAtRisk;
      
      let response = 'Analisando os dados inseridos:\n\n';
      
      if (improving.length > 0) {
        response += `✅ Categorias com redução: ${improving.join(', ')}\n`;
      }
      if (atRisk.length > 0) {
        response += `⚠️ Categorias com aumento: ${atRisk.join(', ')}\n`;
      }
      
      response += `\n${analysis.evolution.message}`;
      return response;
    }

    // Organização
    if (lowerQuestion.includes('organizar') || lowerQuestion.includes('economizar') || lowerQuestion.includes('melhorar')) {
      if (analysis.potentialSavings > 0) {
        return `Com base nos padrões identificados, há um potencial de organização de aproximadamente R$ ${analysis.potentialSavings.toLocaleString('pt-BR')}. As categorias ${analysis.evolution.categoriesAtRisk.join(' e ')} apresentam oportunidades de revisão.`;
      }
      return 'Seu perfil financeiro atual está bem equilibrado. Continue acompanhando seus gastos mensalmente para manter esse padrão.';
    }

    // Alerta
    if (lowerQuestion.includes('alerta')) {
      if (analysis.alerts.length > 0) {
        const activeAlerts = analysis.alerts.filter(a => a.status === 'active');
        if (activeAlerts.length > 0) {
          return `Você tem ${activeAlerts.length} alerta(s) ativo(s). O principal é: "${activeAlerts[0].title}" - ${activeAlerts[0].description}`;
        }
      }
      return 'Não há alertas ativos no momento. Seus gastos estão dentro dos padrões esperados.';
    }

    // Score
    if (lowerQuestion.includes('score') || lowerQuestion.includes('índice') || lowerQuestion.includes('pontuação')) {
      return `Seu Índice de Organização Financeira atual é ${analysis.organizationScore}/100. ${
        analysis.organizationScore >= 70 ? 'Excelente! Você está muito bem organizado.' :
        analysis.organizationScore >= 50 ? 'Bom resultado, mas há espaço para melhorias.' :
        'Há oportunidades significativas de organização.'
      }`;
    }

    // Resumo geral
    if (lowerQuestion.includes('resumo') || lowerQuestion.includes('geral') || lowerQuestion.includes('como estou')) {
      return `📊 Resumo Financeiro\n\n• Gasto total: R$ ${analysis.totalExpenses.toLocaleString('pt-BR')}\n• Maior categoria: ${analysis.biggestCategory.name} (${analysis.biggestCategory.percentage}%)\n• Índice de organização: ${analysis.organizationScore}/100\n• Status: ${analysis.evolution.status === 'positive' ? '🟢 Evolução positiva' : analysis.evolution.status === 'stable' ? '🟡 Estável' : '🔴 Atenção necessária'}\n\n${analysis.summary}`;
    }

    // Resposta padrão
    return `Entendi sua pergunta sobre "${question}". Com base nos dados financeiros inseridos, posso informar que seu gasto total atual é de R$ ${analysis.totalExpenses.toLocaleString('pt-BR')}, com a categoria ${analysis.biggestCategory.name} representando a maior parte. Seu índice de organização financeira está em ${analysis.organizationScore}/100. Posso ajudar com algo mais específico?`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    
    addChatMessage({ role: 'user', content: userMessage });
    setIsLoading(true);

    // Simular delay de processamento
    await new Promise(resolve => setTimeout(resolve, 1000));

    const response = generateResponse(userMessage);
    addChatMessage({ role: 'assistant', content: response });
    setIsLoading(false);
  };

  const suggestedQuestions = [
    'Por que meus gastos aumentaram?',
    'Qual categoria mais pesa no orçamento?',
    'O que mudou nos últimos meses?',
    'Onde posso organizar melhor?',
    'Como está meu score financeiro?',
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-h-[700px]">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 p-4">
        {chatMessages.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full btg-gradient-primary flex items-center justify-center">
              <Bot className="w-8 h-8 text-primary-foreground" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Assistente Financeiro</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Olá! Sou seu assistente de inteligência financeira. Posso ajudar a entender seus gastos, explicar insights e responder dúvidas sobre sua situação financeira.
            </p>
            
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground mb-2">Perguntas sugeridas:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => setInput(question)}
                    className="text-xs px-3 py-2 rounded-full bg-secondary text-secondary-foreground hover:bg-muted transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          chatMessages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex items-start gap-3 animate-fade-in',
                message.role === 'user' ? 'flex-row-reverse' : ''
              )}
            >
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                message.role === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'btg-gradient-primary text-primary-foreground'
              )}>
                {message.role === 'user' ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Bot className="w-4 h-4" />
                )}
              </div>
              <div className={cn(
                'max-w-[80%] rounded-2xl px-4 py-3',
                message.role === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-foreground'
              )}>
                <p className="text-sm whitespace-pre-line">{message.content}</p>
                <p className={cn(
                  'text-xs mt-1',
                  message.role === 'user' ? 'text-primary-foreground/60' : 'text-muted-foreground'
                )}>
                  {message.timestamp.toLocaleTimeString('pt-BR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </div>
          ))
        )}
        
        {isLoading && (
          <div className="flex items-start gap-3 animate-fade-in">
            <div className="w-8 h-8 rounded-full btg-gradient-primary flex items-center justify-center">
              <Bot className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="bg-muted rounded-2xl px-4 py-3">
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-border">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Faça uma pergunta sobre suas finanças..."
            className="btg-input flex-1"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="btg-button-primary px-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}
