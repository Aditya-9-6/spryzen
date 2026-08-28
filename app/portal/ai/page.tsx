'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, Loader2, ThumbsUp, ThumbsDown, Sparkles, X } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: string[];
  timestamp: Date;
  feedback?: 'up' | 'down' | null;
}

const EXAMPLE_QUESTIONS = [
  'Why was IP 203.0.113.42 blocked?',
  'Explain my latest security report',
  'What is the Tartarus Engine?',
  'How do I upgrade my plan?',
  'What are the most common attacks on my site?',
  'How does Ouroboros self-evolution work?',
];

export default function AIAssistantPage() {
  const [messages, setMessages]     = useState<Message[]>([]);
  const [input, setInput]           = useState('');
  const [loading, setLoading]       = useState(false);
  const [sessionId]                 = useState(() => crypto.randomUUID());
  const bottomRef                   = useRef<HTMLDivElement>(null);
  const inputRef                    = useRef<HTMLTextAreaElement>(null);

  // Load chat history on mount
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const res = await fetch(`/api/portal/ai/history?session=${sessionId}`);
        if (res.ok) {
          const data = await res.json();
          setMessages(data.messages || []);
        }
      } catch { /* fresh session */ }

      // Welcome message
      setMessages([{
        id: 'welcome',
        role: 'assistant',
        content: "👋 I'm your Sovereign AI Assistant, powered by Spryzen+'s RAG engine and Phi-3. I can answer questions about your security setup, explain attack events, summarize your reports, and help you get the most out of Spryzen+. What would you like to know?",
        timestamp: new Date(),
      }]);
    };
    loadHistory();
  }, [sessionId]);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text?: string) => {
    const q = (text || input).trim();
    if (!q || loading) return;
    setInput('');

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: q,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    // Placeholder assistant message for streaming
    const assistantId = crypto.randomUUID();
    setMessages(prev => [...prev, {
      id: assistantId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
    }]);

    try {
      const res = await fetch('/api/portal/ai/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q, session_id: sessionId }),
      });

      if (!res.body) throw new Error('No stream body');

      const reader  = res.body.getReader();
      const decoder = new TextDecoder();
      let full = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        full += chunk;

        setMessages(prev =>
          prev.map(m =>
            m.id === assistantId ? { ...m, content: full } : m
          )
        );
      }
    } catch {
      setMessages(prev =>
        prev.map(m =>
          m.id === assistantId
            ? { ...m, content: "I'm having trouble connecting to the AI engine right now. Please check your backend connection and try again." }
            : m
        )
      );
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleFeedback = async (msgId: string, feedback: 'up' | 'down') => {
    setMessages(prev => prev.map(m => m.id === msgId ? { ...m, feedback } : m));
    await fetch('/api/portal/ai/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message_id: msgId, feedback, session_id: sessionId }),
    }).catch(() => {});
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 72px - 4rem)', maxHeight: 800 }}>
      {/* Header */}
      <div style={{ marginBottom: '1.25rem', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: 42, height: 42, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--neon-cyan), #a855f7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Bot size={22} style={{ color: '#000' }} />
          </div>
          <div>
            <h1 style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Sovereign AI <Sparkles size={18} style={{ color: 'var(--neon-gold)' }} />
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Powered by RAG + Phi-3 · Your data stays on-premise
            </p>
          </div>
        </div>
      </div>

      {/* Chat container */}
      <div
        className="glass-card"
        style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}
      >
        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* Example questions (shown when only welcome msg) */}
          {messages.length <= 1 && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
              {EXAMPLE_QUESTIONS.map(q => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  style={{
                    padding: '0.75rem 1rem',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--text-secondary)',
                    fontSize: '0.8125rem',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,212,255,0.3)';
                    (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--glass-border)';
                    (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
                  }}
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          <AnimatePresence initial={false}>
            {messages.map(msg => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}
              >
                {msg.role === 'assistant' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.375rem' }}>
                    <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'linear-gradient(135deg, var(--neon-cyan), #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Bot size={11} style={{ color: '#000' }} />
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Sovereign AI</span>
                  </div>
                )}

                <div className={msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}>
                  {msg.content || (loading && msg.role === 'assistant' && (
                    <Loader2 size={16} style={{ animation: 'spin-slow 1s linear infinite', color: 'var(--neon-cyan)' }} />
                  ))}
                  {msg.role === 'assistant' && !msg.content && !loading && '...'}
                </div>

                {/* Feedback buttons */}
                {msg.role === 'assistant' && msg.id !== 'welcome' && msg.content && (
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <button
                      onClick={() => handleFeedback(msg.id, 'up')}
                      style={{
                        background: msg.feedback === 'up' ? 'var(--neon-emerald-dim)' : 'none',
                        border: 'none', cursor: 'pointer',
                        color: msg.feedback === 'up' ? 'var(--neon-emerald)' : 'var(--text-muted)',
                        padding: '0.25rem',
                      }}
                    >
                      <ThumbsUp size={14} />
                    </button>
                    <button
                      onClick={() => handleFeedback(msg.id, 'down')}
                      style={{
                        background: msg.feedback === 'down' ? 'var(--neon-crimson-dim)' : 'none',
                        border: 'none', cursor: 'pointer',
                        color: msg.feedback === 'down' ? 'var(--neon-crimson)' : 'var(--text-muted)',
                        padding: '0.25rem',
                      }}
                    >
                      <ThumbsDown size={14} />
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          <div ref={bottomRef} />
        </div>

        {/* Input bar */}
        <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid var(--glass-border)', flexShrink: 0 }}>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end' }}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about your security setup..."
              disabled={loading}
              rows={1}
              style={{
                flex: 1,
                background: 'var(--bg-surface)',
                border: '1px solid var(--glass-border)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-primary)',
                padding: '0.75rem 1rem',
                fontFamily: 'Inter',
                fontSize: '0.9375rem',
                resize: 'none',
                outline: 'none',
                transition: 'border-color 0.2s',
                minHeight: 44,
                maxHeight: 120,
              }}
              onFocus={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--neon-cyan)'}
              onBlur={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--glass-border)'}
            />
            <button
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              className="btn btn-primary"
              style={{ padding: '0.75rem', flexShrink: 0 }}
            >
              {loading ? <Loader2 size={18} style={{ animation: 'spin-slow 1s linear infinite' }} /> : <Send size={18} />}
            </button>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-disabled)', marginTop: '0.5rem' }}>
            Press Enter to send · Shift+Enter for new line · All data processed on-premise
          </p>
        </div>
      </div>
    </div>
  );
}
