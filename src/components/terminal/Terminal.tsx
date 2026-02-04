'use client';

import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { useTerminalStore } from '@/stores/terminal-store';
import { COMMAND_LIST } from '@/lib/terminal-commands';

export default function Terminal() {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { entries, executeCommand, navigateHistory } = useTerminalStore();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [entries]);

  const handleSubmit = () => {
    if (input.trim()) {
      executeCommand(input.trim());
      setInput('');
      setSuggestions([]);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const cmd = navigateHistory('up');
      setInput(cmd);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const cmd = navigateHistory('down');
      setInput(cmd);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      if (suggestions.length === 1) {
        setInput(suggestions[0]);
        setSuggestions([]);
      }
    }
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    if (value.trim()) {
      const matches = COMMAND_LIST.filter((cmd) =>
        cmd.toLowerCase().startsWith(value.toLowerCase())
      );
      setSuggestions(matches.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  };

  const focusInput = () => {
    inputRef.current?.focus();
  };

  return (
    <div
      className="w-full max-w-3xl mx-auto bg-[#1a1a1a] rounded-lg overflow-hidden border border-[#333] glow-green"
      onClick={focusInput}
    >
      {/* Terminal Header */}
      <div className="flex items-center gap-2 px-4 py-3 bg-[#2a2a2a] border-b border-[#333]">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
          <div className="w-3 h-3 rounded-full bg-[#27ca40]" />
        </div>
        <span className="ml-4 text-sm text-gray-400 terminal-text">
          afformation@vibe ~ /products
        </span>
      </div>

      {/* Terminal Body */}
      <div
        ref={scrollRef}
        className="h-[400px] overflow-y-auto p-4 terminal-text text-sm no-scrollbar"
      >
        {entries.map((entry) => (
          <div key={entry.id} className="mb-1">
            {entry.type === 'command' ? (
              <div className="text-[#00ff88]">{entry.content}</div>
            ) : entry.type === 'system' ? (
              <div className="text-[#00d4ff]">{entry.content}</div>
            ) : (
              <pre className="text-gray-300 whitespace-pre-wrap font-mono text-sm">
                {entry.content}
              </pre>
            )}
          </div>
        ))}

        {/* Input Line */}
        <div className="flex items-center mt-2">
          <span className="text-[#00ff88] mr-2">$</span>
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent text-[#fafafa] outline-none terminal-text"
              autoFocus
              spellCheck={false}
              autoComplete="off"
            />
            {input === '' && (
              <span className="absolute left-0 top-0 w-2 h-5 bg-[#00ff88] terminal-cursor" />
            )}
          </div>
        </div>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="mt-2 text-gray-500 text-xs">
            Suggestions: {suggestions.join(', ')}
          </div>
        )}
      </div>
    </div>
  );
}
