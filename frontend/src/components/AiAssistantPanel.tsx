import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import type { PlanStop } from '../App';
import './AiAssistantPanel.css';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

type AddStopOptions = {
  index?: number;
  select?: boolean;
};

type AiAssistantPanelProps = {
  planTitle: string | null;
  stops: PlanStop[];
  selectedStop: PlanStop | null;
  selectedStopIndex: number | null;
  onAddStop?: (stop: PlanStop, options?: AddStopOptions) => void;
  onUpdateStop?: (index: number, updates: Partial<PlanStop>) => void;
  onRemoveStop?: (index: number) => void;
  onMoveStop?: (fromIndex: number, toIndex: number) => void;
};

const QUICK_PROMPTS = [
  'Add a stop for Brackendale Eagle Provincial Park after the current one.',
  'Rename stop 2 to Granville Island Market.',
  'Move stop 4 to position 2.',
];

const WELCOME_MESSAGE: Message = {
  id: 'assistant-welcome',
  role: 'assistant',
  content: 'Hi! I focus on British Columbia routes. Ask for BC stop ideas or tell me to add, remove, rename, or move stops and I will update your itinerary.',
};

type BCIdea = {
  area: string;
  keywords: string[];
  suggestions: string[];
};

const BC_IDEAS: BCIdea[] = [
  {
    area: 'Sea-to-Sky Corridor',
    keywords: ['whistler', 'squamish', 'sea-to-sky', 'garibaldi', 'porteau'],
    suggestions: [
      'Cruise the Sea-to-Sky: start in Vancouver, pause for views at Porteau Cove, then ride the Squamish Sea to Sky Gondola before landing in Whistler Village for alpine dining.',
      'Detour to Brandywine Falls Provincial Park between Squamish and Whistler for a quick hike and waterfall photo stop.',
      'Add a wildlife swing through Brackendale Eagle Provincial Park during winter for stellar bald eagle sightings.',
    ],
  },
  {
    area: 'Vancouver Island',
    keywords: ['victoria', 'tofino', 'nanaimo', 'cowichan', 'island', 'pacific rim'],
    suggestions: [
      'Sail to Victoria, stroll the Inner Harbour, and cap it with sunset views from Dallas Road or Ogden Point.',
      'Roll north toward Cowichan Valley for a farm-to-table lunch, then finish in Nanaimo with a harbour walk and classic Nanaimo bar.',
      'Head to Pacific Rim National Park Reserve near Tofino for the Rainforest Trail and a Long Beach sunset bonfire.',
    ],
  },
  {
    area: 'Vancouver City',
    keywords: ['vancouver', 'gastown', 'granville', 'kitsilano', 'stanley'],
    suggestions: [
      'Pair Stanley Park’s Seawall cycle with a stop at the Lost Lagoon nature house and finish at Prospect Point for views over Lions Gate Bridge.',
      'Design a False Creek loop: Granville Island Market brunch, Olympic Village beer tasting, and sunset at Kitsilano Beach.',
      'Explore Gastown’s historic core, then head up to Queen Elizabeth Park for skyline views and the Bloedel Conservatory.',
    ],
  },
  {
    area: 'Okanagan Valley',
    keywords: ['okanagan', 'kelowna', 'penticton', 'naramata', 'wine'],
    suggestions: [
      'Spend a wine-focused day: bike the Naramata Bench, taste at three boutique wineries, then cool off with a Penticton lakeshore paddle.',
      'Climb Knox Mountain Park in Kelowna for morning views, grab lunch at a lakeside patio, and finish with Myra Canyon trestle bridges.',
      'Pair peach season in Summerland with a visit to Dirty Laundry Vineyard and a Kettle Valley Rail Trail stroll.',
    ],
  },
  {
    area: 'Kootenay Rockies',
    keywords: ['nelson', 'kootenay', 'fernie', 'revelstoke', 'yoho'],
    suggestions: [
      'Link Yoho and Glacier National Parks: Emerald Lake canoeing, Takakkaw Falls viewing, then Rogers Pass discovery centre.',
      'Base in Nelson: hit the Hot Springs at Ainsworth, walk Baker Street boutiques, and close with a craft beer crawl.',
      'Ride the Fernie Alpine Resort chairlift for alpine trails and lakeside relaxation at Island Lake Lodge.',
    ],
  },
  {
    area: 'British Columbia',
    keywords: [],
    suggestions: [
      'Combine a Vancouver foodie morning with a Sea-to-Sky afternoon—think Granville Island brunch, Porteau Cove pit stop, and Whistler Village dinner.',
      'Catch a ferry to Victoria for parliament architecture, then road-trip the Malahat SkyWalk and Mill Bay cider farms.',
      'Trace an interior loop: Kelowna vineyards, Kamloops desert trails, and back to Vancouver via the Fraser Canyon viewpoints.',
    ],
  },
];

function toOrdinal(index: number): string {
  const value = index + 1;
  const suffix = (() => {
    const remainder = value % 100;
    if (remainder >= 11 && remainder <= 13) {
      return 'th';
    }
    switch (value % 10) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  })();
  return `${value}${suffix}`;
}

function stripPunctuation(value: string): string {
  return value.replace(/[.,!?]/g, '').trim();
}

function titleCase(value: string): string {
  return value
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function resolveStopIndex(identifier: string, stops: PlanStop[]): number | null {
  const cleaned = stripPunctuation(identifier).toLowerCase();
  if (!cleaned) {
    return null;
  }

  const stopNumberMatch = cleaned.match(/^stop\s*(\d+)$/);
  if (stopNumberMatch) {
    const index = Number.parseInt(stopNumberMatch[1], 10) - 1;
    return Number.isInteger(index) && index >= 0 && index < stops.length ? index : null;
  }

  const numberMatch = cleaned.match(/^(\d+)$/);
  if (numberMatch) {
    const index = Number.parseInt(numberMatch[1], 10) - 1;
    return Number.isInteger(index) && index >= 0 && index < stops.length ? index : null;
  }

  const directMatch = stops.findIndex((stop) => stop.label?.toLowerCase() === cleaned);
  if (directMatch !== -1) {
    return directMatch;
  }

  const partialMatch = stops.findIndex((stop) => {
    const label = stop.label?.toLowerCase();
    return label ? label.includes(cleaned) : false;
  });
  return partialMatch !== -1 ? partialMatch : null;
}

function pickBcIdea(prompt: string, selectedStop: PlanStop | null): BCIdea {
  const normalizedPrompt = prompt.toLowerCase();

  for (const idea of BC_IDEAS) {
    if (idea.keywords.some((keyword) => normalizedPrompt.includes(keyword))) {
      return idea;
    }
  }

  if (selectedStop?.label) {
    const selectedLabel = selectedStop.label.toLowerCase();
    for (const idea of BC_IDEAS) {
      if (idea.keywords.some((keyword) => selectedLabel.includes(keyword))) {
        return idea;
      }
    }
  }

  return BC_IDEAS[BC_IDEAS.length - 1];
}

function buildBcResponse(
  prompt: string,
  selectedStop: PlanStop | null,
  planTitle: string | null,
): string {
  const idea = pickBcIdea(prompt, selectedStop);
  const highlights = idea.suggestions.slice(0, 2);
  const intro = planTitle
    ? `Keeping ${planTitle} focused on British Columbia, here are a couple of ${idea.area.toLowerCase()} ideas:`
    : `Here are a couple of British Columbia ideas around the ${idea.area.toLowerCase()}:`;
  const bullets = highlights.map((line) => `• ${line}`);
  const outro = selectedStop?.label
    ? `Ask me to add, tweak, or move stops around ${selectedStop.label} and I will handle the updates.`
    : 'Ask me to add, tweak, or move any stops and I will update the plan for you.';
  return [intro, ...bullets, outro].join('\n');
}

function AiAssistantPanel({
  planTitle,
  stops,
  selectedStop,
  selectedStopIndex,
  onAddStop,
  onUpdateStop,
  onRemoveStop,
  onMoveStop,
}: AiAssistantPanelProps) {
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

  const attemptAddStop = (prompt: string): string | null => {
    if (!onAddStop) {
      return null;
    }
    if (!/\badd\b/i.test(prompt) || !/\bstop\b/i.test(prompt)) {
      return null;
    }

    const match = prompt.match(/add(?:\s+(?:a|another))?\s+stop(?:\s+(?:called|named|at|in))?\s+(.+)/i);
    if (!match) {
      return null;
    }

    let remainder = match[1].trim();
    if (!remainder) {
      return 'Let me know what the stop should be called, and I will add it to the plan.';
    }

    let insertionIndex: number | undefined;

    const afterMatch = remainder.match(/(.+?)\s+after\s+(?:stop\s+)?(.+)/i);
    if (afterMatch) {
      remainder = afterMatch[1].trim();
      const reference = afterMatch[2].trim();
      const index = resolveStopIndex(reference, stops);
      if (index === null) {
        return `I could not find the stop "${reference}" to insert after.`;
      }
      insertionIndex = index + 1;
    } else {
      const beforeMatch = remainder.match(/(.+?)\s+before\s+(?:stop\s+)?(.+)/i);
      if (beforeMatch) {
        remainder = beforeMatch[1].trim();
        const reference = beforeMatch[2].trim();
        const index = resolveStopIndex(reference, stops);
        if (index === null) {
          return `I could not find the stop "${reference}" to insert before.`;
        }
        insertionIndex = index;
      } else {
        const positionMatch = remainder.match(/(.+?)\s+at\s+(?:position|slot|spot)\s+(\d+)/i);
        if (positionMatch) {
          remainder = positionMatch[1].trim();
          const position = Number.parseInt(positionMatch[2], 10);
          if (!Number.isInteger(position) || position < 1) {
            return 'Give me a positive position number and I can place the stop there.';
          }
          insertionIndex = position - 1;
        }
      }
    }

    let label = stripPunctuation(remainder);
    if (!label) {
      return 'I need a name for that stop before I can add it.';
    }
    label = titleCase(label);

    const stop: PlanStop = {
      label,
      description: '',
    };

    const targetIndex = insertionIndex ?? (
      selectedStopIndex !== null ? selectedStopIndex + 1 : stops.length
    );

    onAddStop(stop, { index: targetIndex, select: true });

    if (targetIndex >= stops.length) {
      return `Added ${label} to the end of the route.`;
    }
    return `Added ${label} at the ${toOrdinal(Math.max(0, Math.min(targetIndex, stops.length)))} spot.`;
  };

  const attemptRemoveStop = (prompt: string): string | null => {
    if (!onRemoveStop) {
      return null;
    }
    const match = prompt.match(/(?:remove|delete)\s+stop\s+(.+)/i);
    if (!match) {
      return null;
    }
    if (!stops.length) {
      return 'There are no stops to remove right now.';
    }

    const identifier = match[1].trim();
    const index = resolveStopIndex(identifier, stops);
    if (index === null) {
      return `I could not find a stop matching "${identifier}".`;
    }

    const removed = stops[index];
    onRemoveStop(index);
    return `Removed ${removed.label ?? `the ${toOrdinal(index)} stop`} from the plan.`;
  };

  const attemptMoveStop = (prompt: string): string | null => {
    if (!onMoveStop) {
      return null;
    }
    const match = prompt.match(/(?:move|reorder)\s+stop\s+(.+?)\s+to\s+(?:position\s+)?(\d+)/i);
    if (!match) {
      return null;
    }
    if (!stops.length) {
      return 'There are no stops to rearrange right now.';
    }

    const identifier = match[1].trim();
    const destination = Number.parseInt(match[2], 10);
    if (!Number.isInteger(destination) || destination < 1) {
      return 'Give me a positive position number to move that stop to.';
    }

    const fromIndex = resolveStopIndex(identifier, stops);
    if (fromIndex === null) {
      return `I could not find a stop matching "${identifier}" to move.`;
    }

    const toIndex = Math.min(destination - 1, stops.length - 1);
    if (fromIndex === toIndex) {
      return 'That stop is already sitting in that position.';
    }

    onMoveStop(fromIndex, toIndex);
    return `Moved ${stops[fromIndex].label ?? 'that stop'} to the ${toOrdinal(toIndex)} spot.`;
  };

  const attemptRenameStop = (prompt: string): string | null => {
    if (!onUpdateStop) {
      return null;
    }
    const match = prompt.match(/(?:rename|retitle|call|name)\s+stop\s+(.+?)\s+(?:to|as)\s+(.+)/i);
    if (!match) {
      return null;
    }

    const identifier = match[1].trim();
    const newLabelRaw = match[2].trim();
    if (!newLabelRaw) {
      return 'Tell me the new name you want and I will rename the stop.';
    }

    const index = resolveStopIndex(identifier, stops);
    if (index === null) {
      return `I could not find a stop matching "${identifier}" to rename.`;
    }

    const newLabel = titleCase(stripPunctuation(newLabelRaw)) || titleCase(newLabelRaw);
    onUpdateStop(index, { label: newLabel });
    return `Renamed the ${toOrdinal(index)} stop to ${newLabel}.`;
  };

  const attemptDescriptionUpdate = (prompt: string): string | null => {
    if (!onUpdateStop) {
      return null;
    }
    const match = prompt.match(/(?:set|update|change)\s+stop\s+(.+?)\s+(?:description|details)\s+(?:to|as)\s+(.+)/i);
    if (!match) {
      return null;
    }

    const identifier = match[1].trim();
    const description = match[2].trim();
    if (!description) {
      return 'Share the description you want me to use and I will update the stop.';
    }

    const index = resolveStopIndex(identifier, stops);
    if (index === null) {
      return `I could not find a stop matching "${identifier}" to update.`;
    }

    onUpdateStop(index, { description });
    return `Updated the description for ${stops[index].label ?? `the ${toOrdinal(index)} stop`}.`;
  };

  const processPrompt = (prompt: string): string => {
    const responders = [
      attemptAddStop,
      attemptRemoveStop,
      attemptMoveStop,
      attemptRenameStop,
      attemptDescriptionUpdate,
    ];

    for (const responder of responders) {
      const outcome = responder(prompt);
      if (outcome) {
        return outcome;
      }
    }

    return buildBcResponse(prompt, selectedStop, planTitle);
  };

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

    try {
      const reply = processPrompt(prompt);
      // Provide a short delay so the UI feels responsive but not instant.
      await new Promise((resolve) => setTimeout(resolve, 200));

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: reply,
      };

      const updatedHistory = [...historyRef.current, assistantMessage];
      historyRef.current = updatedHistory;
      setMessages(updatedHistory);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went sideways. Try asking again.';
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
        <p>All suggestions stay within British Columbia. Ask for BC route ideas or tell me which stop to add, rename, move, or delete.</p>
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
          placeholder="Ask for BC route ideas or tell me how to modify the stops."
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
