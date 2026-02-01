import { useState } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { useFinancial } from '@/contexts/FinancialContext';
import { useCommercialScoring } from '@/hooks/useCommercialScoring';
import { useFamilyIntelligence } from '@/hooks/useFamilyIntelligence';
import { cn } from '@/lib/utils';

export function Chatbot() {
  const { chatMessages, addChatMessage, analysis, expenses } = useFinancial();
  const { commercialScores, rankedProducts } = useCommercialScoring();
  const { familyIntelligence, familyDashboard, familyGoals, familyOffers } = useFamilyIntelligence();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const generateResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase();
    
    if (!analysis) {
      return 'Ainda não há análise disponível. Por favor, insira seus dados financeiros na tela "Gerar Análise" e clique em "Gerar Análise Completa" para que eu possa ajudá-lo melhor.';
    }

    // === OFERTAS INTELIGENTES ===
    if (lowerQuestion.includes('oferta') || lowerQuestion.includes('produto') || lowerQuestion.includes('investimento') || lowerQuestion.includes('investir')) {
      if (commercialScores && rankedProducts.length > 0) {
        const topProduct = rankedProducts[0];
        return `📊 **Ofertas Personalizadas**\n\nCom base no seu perfil, identifiquei as melhores oportunidades:\n\n🏆 **Produto Recomendado:** ${topProduct.name}\n• Compatibilidade: ${topProduct.compatibility}%\n• Retorno estimado: ${topProduct.estimatedReturn}%\n• Risco: ${topProduct.riskLevel}\n• ${topProduct.description}\n\n💡 Seus scores comerciais:\n• Investimento: ${commercialScores.investment}/100\n• Crédito: ${commercialScores.credit}/100\n• Planejamento: ${commercialScores.planning}/100\n\nAcesse "Ofertas Inteligentes" no menu para simular e contratar!`;
      }
      return 'Para ver ofertas personalizadas, primeiro gere uma análise financeira. Assim poderei recomendar os melhores produtos para seu perfil.';
    }

    // Scores comerciais
    if (lowerQuestion.includes('score comercial') || lowerQuestion.includes('propensão') || lowerQuestion.includes('crédito')) {
      if (commercialScores) {
        return `📈 **Seus Scores Comerciais**\n\n• Score de Investimento: ${commercialScores.investment}/100\n• Score de Crédito: ${commercialScores.credit}/100\n• Score de Planejamento: ${commercialScores.planning}/100\n• Score de Proteção: ${commercialScores.protection}/100\n• Score de Consumo: ${commercialScores.consumption}/100\n\nEsses scores são calculados com base no seu perfil comportamental e histórico financeiro.`;
      }
      return 'Gere uma análise financeira para calcular seus scores comerciais personalizados.';
    }

    // === FAMÍLIA ===
    if (lowerQuestion.includes('família') || lowerQuestion.includes('familiar') || lowerQuestion.includes('cônjuge') || lowerQuestion.includes('filho')) {
      if (familyIntelligence && familyDashboard) {
        return `👨‍👩‍👧‍👦 **Inteligência Familiar**\n\n• Score Familiar: ${familyIntelligence.familyScore}/100\n• Renda Familiar: R$ ${familyDashboard.totalIncome.toLocaleString('pt-BR')}\n• Gastos Familiares: R$ ${familyDashboard.totalExpenses.toLocaleString('pt-BR')}\n• Patrimônio: R$ ${familyDashboard.patrimony.toLocaleString('pt-BR')}\n• Estabilidade: ${familyIntelligence.stability}\n\n🎯 Metas familiares ativas: ${familyGoals.length}\n\nAcesse o módulo "Família" para ver o dashboard completo e ofertas familiares!`;
      }
      return 'O módulo Família permite agregar dados de cônjuge, filhos e dependentes para uma visão consolidada. Acesse "Família" no menu para começar.';
    }

    // Metas familiares
    if (lowerQuestion.includes('meta') || lowerQuestion.includes('objetivo') || lowerQuestion.includes('planejamento')) {
      if (familyGoals.length > 0) {
        const goalsText = familyGoals.slice(0, 3).map(g => 
          `• ${g.title}: ${g.progress}% concluído (R$ ${g.currentValue.toLocaleString('pt-BR')} de R$ ${g.targetValue.toLocaleString('pt-BR')})`
        ).join('\n');
        return `🎯 **Suas Metas**\n\n${goalsText}\n\nContinue acompanhando seu progresso no módulo "Família".`;
      }
      return 'Você ainda não tem metas cadastradas. Acesse o módulo "Família" para definir objetivos como educação dos filhos, moradia e aposentadoria.';
    }

    // Ofertas familiares
    if (lowerQuestion.includes('oferta familiar') || lowerQuestion.includes('investir para família')) {
      if (familyOffers.length > 0) {
        const topOffer = familyOffers[0];
        return `👨‍👩‍👧 **Oferta Familiar Prioritária**\n\n🏆 ${topOffer.productName}\n• Objetivo: ${topOffer.objective}\n• Compatibilidade: ${topOffer.compatibility}%\n• Valor sugerido: R$ ${topOffer.suggestedValue.toLocaleString('pt-BR')}\n• Horizonte: ${topOffer.timeHorizon}\n• Retorno estimado: ${topOffer.estimatedReturn}%\n\nAcesse "Família" > "Ofertas Familiares" para contratar!`;
      }
      return 'Para ver ofertas familiares personalizadas, cadastre membros da família no módulo "Família".';
    }

    // === PERGUNTAS ORIGINAIS ===
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
      let response = `Seu Índice de Organização Financeira atual é ${analysis.organizationScore}/100. ${
        analysis.organizationScore >= 70 ? 'Excelente! Você está muito bem organizado.' :
        analysis.organizationScore >= 50 ? 'Bom resultado, mas há espaço para melhorias.' :
        'Há oportunidades significativas de organização.'
      }`;
      
      if (commercialScores) {
        response += `\n\n📊 Scores Comerciais: Investimento ${commercialScores.investment}, Crédito ${commercialScores.credit}, Planejamento ${commercialScores.planning}.`;
      }
      
      return response;
    }

    // Resumo geral
    if (lowerQuestion.includes('resumo') || lowerQuestion.includes('geral') || lowerQuestion.includes('como estou')) {
      let response = `📊 **Resumo Financeiro Completo**\n\n• Gasto total: R$ ${analysis.totalExpenses.toLocaleString('pt-BR')}\n• Maior categoria: ${analysis.biggestCategory.name} (${analysis.biggestCategory.percentage}%)\n• Índice de organização: ${analysis.organizationScore}/100\n• Status: ${analysis.evolution.status === 'positive' ? '🟢 Evolução positiva' : analysis.evolution.status === 'stable' ? '🟡 Estável' : '🔴 Atenção necessária'}`;
      
      if (commercialScores) {
        response += `\n\n💼 **Scores Comerciais**\n• Investimento: ${commercialScores.investment}/100\n• Crédito: ${commercialScores.credit}/100`;
      }
      
      if (familyIntelligence) {
        response += `\n\n👨‍👩‍👧‍👦 **Família**\n• Score Familiar: ${familyIntelligence.familyScore}/100`;
      }
      
      response += `\n\n${analysis.summary}`;
      return response;
    }

    // Resposta padrão com contexto completo
    return `Entendi sua pergunta sobre "${question}". Com base nos dados financeiros inseridos:\n\n• Gasto total: R$ ${analysis.totalExpenses.toLocaleString('pt-BR')}\n• Maior categoria: ${analysis.biggestCategory.name}\n• Score de organização: ${analysis.organizationScore}/100\n\n💡 Dica: Pergunte sobre "ofertas", "família", "metas" ou "scores comerciais" para informações específicas desses módulos!`;
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
    'Quais ofertas são ideais para mim?',
    'Como está minha família financeira?',
    'Quais são meus scores comerciais?',
    'Me dá um resumo geral',
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
