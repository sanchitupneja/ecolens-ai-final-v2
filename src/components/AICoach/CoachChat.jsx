import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useCarbon } from '../../hooks/useCarbon';
import { getCoachResponse } from '../../utils/mockAIResponse';

/**
 * Interactive Coach panel with chat assistant interface and tips.
 */
export function CoachChat() {
  const { totals, activities } = useCarbon();
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'coach',
      text: 'Welcome! I am your AI Sustainability Coach. I have analyzed your carbon ledger. How can I help you reduce emissions today?'
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [announcement, setAnnouncement] = useState('');

  const chatEndRef = useRef(null);

  // Auto-scroll chat window
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = useCallback((e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const userText = inputVal.trim();
    setInputVal('');

    // Append user message
    setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'user', text: userText }]);
    setIsTyping(true);

    // Simulate AI thinking and output
    setTimeout(() => {
      const responseText = getCoachResponse(userText, totals.grandTotal, activities);
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), sender: 'coach', text: responseText }]);
      setIsTyping(false);
      
      // Update screen reader live-region announcement
      setAnnouncement(`AI Coach responds: ${responseText}`);
    }, 800);
  }, [inputVal, totals.grandTotal, activities]);

  return (
    <div 
      className="dashboard-grid"
      style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1.5rem' }}
    >
      {/* Screen Reader Announcements */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </div>

      {/* Main Chat Interface */}
      <section 
        className="glass-card" 
        style={{ gridColumn: 'span 8', minHeight: '450px', display: 'flex', flexDirection: 'column' }}
        aria-labelledby="coach-chat-title"
      >
        <h3 id="coach-chat-title" className="sr-only">Interactive Sustainability Coach Chat</h3>
        
        <div style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
          <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem' }}>🤖 AI Sustainability Coach</h4>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Get instant tailored advice to trim emissions</p>
        </div>

        {/* Message Window */}
        <div 
          style={{
            flex: 1,
            maxHeight: '300px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            paddingRight: '0.5rem',
            marginBottom: '1rem'
          }}
          tabIndex="0"
          aria-label="Coach dialogue logs"
        >
          {messages.map((msg) => (
            <div 
              key={msg.id}
              style={{
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                backgroundColor: msg.sender === 'user' ? 'var(--brand-emerald-glow)' : 'var(--bg-tertiary)',
                border: '1px solid',
                borderColor: msg.sender === 'user' ? 'hsla(158, 64%, 48%, 0.3)' : 'var(--glass-border)',
                color: 'var(--text-primary)',
                padding: '0.75rem 1rem',
                borderRadius: msg.sender === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                maxWidth: '80%',
                fontSize: '0.9rem',
                whiteSpace: 'pre-line'
              }}
            >
              <strong>{msg.sender === 'user' ? 'You' : 'Coach'}:</strong>
              <p style={{ marginTop: '0.25rem' }}>{msg.text}</p>
            </div>
          ))}
          {isTyping && (
            <div 
              style={{
                alignSelf: 'flex-start',
                color: 'var(--text-muted)',
                fontSize: '0.85rem',
                fontStyle: 'italic'
              }}
            >
              Coach is analyzing your carbon footprint...
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input area */}
        <form onSubmit={handleSend} style={{ display: 'flex', gap: '0.5rem' }}>
          <label htmlFor="coach-chat-input" className="sr-only">Type message to sustainability coach</label>
          <input 
            id="coach-chat-input"
            type="text"
            className="form-input"
            style={{ flex: 1 }}
            placeholder="Ask: 'How do I reduce energy emissions?'"
            required
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            disabled={isTyping}
          />
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isTyping}
            style={{ padding: '0.75rem 1.25rem' }}
          >
            Send
          </button>
        </form>
      </section>

      {/* Suggested prompts & static smart actions list */}
      <section 
        className="glass-card" 
        style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: '1rem' }}
        aria-labelledby="coach-suggestions-title"
      >
        <h3 id="coach-suggestions-title" style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem' }}>
          💡 Smart Quick Prompts
        </h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Click any question to ask your AI coach immediately:</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button 
            onClick={() => setInputVal('Analyze my carbon footprint')}
            className="btn btn-secondary"
            style={{ fontSize: '0.85rem', justifyContent: 'flex-start', textAlign: 'left' }}
            disabled={isTyping}
          >
            📊 Analyze my carbon footprint
          </button>
          <button 
            onClick={() => setInputVal('How to reduce transport emissions?')}
            className="btn btn-secondary"
            style={{ fontSize: '0.85rem', justifyContent: 'flex-start', textAlign: 'left' }}
            disabled={isTyping}
          >
            🚗 Transport reduction tips
          </button>
          <button 
            onClick={() => setInputVal('Tips for saving energy')}
            className="btn btn-secondary"
            style={{ fontSize: '0.85rem', justifyContent: 'flex-start', textAlign: 'left' }}
            disabled={isTyping}
          >
            ⚡ Energy efficiency strategies
          </button>
          <button 
            onClick={() => setInputVal('What is a sustainable food diet?')}
            className="btn btn-secondary"
            style={{ fontSize: '0.85rem', justifyContent: 'flex-start', textAlign: 'left' }}
            disabled={isTyping}
          >
            🍎 Low carbon diet advice
          </button>
        </div>

        <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '1rem', marginTop: 'auto' }}>
          <h4 style={{ fontSize: '0.9rem', color: 'var(--brand-emerald)', marginBottom: '0.5rem' }}>Coach Recommendation Summary</h4>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Switching home lighting to LEDs reduces energy emissions by 80%. Consider buying refurbished smartphones to save 85 kg CO2e per upgrade.
          </p>
        </div>
      </section>
    </div>
  );
}
export default CoachChat;
