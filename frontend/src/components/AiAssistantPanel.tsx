import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import './AiAssistantPanel.css';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

const QUICK_PROMPTS = [
  'Suggest a scenic detour near the next stop.',
  'Find a cozy café for a midday break.',
  'Add an evening activity with live music.',
];

const WELCOME_MESSAGE: Message = {
  id: 'assistant-welcome',
  role: 'assistant',
  content: 'Hey there! Tell me what kind of vibe you want for your next stop and I will whip up a few ideas.',
};

function AiAssistantPanel() {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const historyRef = useRef<Message[]>([WELCOME_MESSAGE]);

  useEffect(() => {
    historyRef.current = messages;
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendPrompt = async (rawPrompt: string) => {
    const prompt = rawPrompt.trim();
    if (!prompt || isSending) {
      setInput(rawPrompt);
      return;
    }

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: prompt,
    };

    const currentHistory = [...historyRef.current, userMessage];
    historyRef.current = currentHistory;
    setMessages(currentHistory);
    setInput('');
    setError(null);
    setIsSending(true);

    const context = currentHistory
      .slice(-6)
      .map((entry) => ({ role: entry.role, content: entry.content }));

    try {
      const response = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: prompt, context }),
      });

      if (!response.ok) {
        throw new Error('Assistant is taking a break. Please try again.');
      }

      const payload: { reply: string } = await response.json();
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: payload.reply.trim() || "I'm still thinking about that…",
      };

      const updatedHistory = [...historyRef.current, assistantMessage];
      historyRef.current = updatedHistory;
      setMessages(updatedHistory);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to reach the assistant right now.';
      setError(message);
    } finally {
      setIsSending(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendPrompt(input);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendPrompt(input);
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    if (isSending) {
      return;
    }
    sendPrompt(prompt);
  };

  return (
    <aside className="assistant">
      <div className="assistant__header">
        <p className="assistant__eyebrow">AI Assist</p>
        <h3>Travel Coach</h3>
        <p>Ask for new stops, food ideas, or time-saving tweaks. I will respond with quick suggestions.</p>
      </div>

      <div className="assistant__suggestions">
        <span className="assistant__hint">Try a quick prompt:</span>
        <div className="assistant__chips">
          {QUICK_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              type="button"
              className="assistant__chip"
              onClick={() => handleQuickPrompt(prompt)}
              disabled={isSending}
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      <div className="assistant__messages">
        {messages.map((message) => (
          <div key={message.id} className={`assistant__message assistant__message--${message.role}`}>
            <span className="assistant__message-role">{message.role === 'user' ? 'You' : 'Assistant'}</span>
            <span className="assistant__message-content">{message.content}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {error ? <div className="assistant__error">{error}</div> : null}

      <form className="assistant__form" onSubmit={handleSubmit}>
        <textarea
          className="assistant__textarea"
          placeholder="Ask for a brunch spot with a view, a short hike, or anything else you need."
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isSending}
        />
        <div className="assistant__footer">
          <span className="assistant__hint">Press Enter to send, Shift + Enter for a new line.</span>
          <button type="submit" className="assistant__submit" disabled={isSending || !input.trim()}>
            {isSending ? 'Thinking…' : 'Send'}
          </button>
        </div>
      </form>
    </aside>
  );
}

export default AiAssistantPanel;
