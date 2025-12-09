import { useEffect, useRef, useState } from 'react';
import { useTerminalGame } from '@/hooks/use-terminal';
import { cn } from '@/lib/utils';

export function TerminalView() {
  const { history, path, executeCommand, scrollRef } = useTerminalGame();
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input
  useEffect(() => {
    const focusInput = () => inputRef.current?.focus();
    focusInput();
    window.addEventListener('click', focusInput);
    return () => window.removeEventListener('click', focusInput);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeCommand(inputValue);
      setInputValue('');
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[var(--color-terminal-bg)] font-[family-name:var(--font-terminal)] text-[var(--color-terminal-text)] p-4 md:p-8 overflow-hidden flex flex-col">
      {/* CRT Effects */}
      <div className="scanline pointer-events-none fixed inset-0 z-50" />
      <div className="crt-flicker pointer-events-none fixed inset-0 z-40" />
      <div className="pointer-events-none fixed inset-0 z-30 bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.4)_100%)]" />

      {/* Terminal Content */}
      <div 
        ref={scrollRef}
        className="relative z-10 flex-1 overflow-y-auto pb-4 scroll-smooth"
      >
        {history.map((entry) => (
          <div key={entry.id} className="mb-2 break-words whitespace-pre-wrap">
            {entry.type === 'command' && (
              <div className="flex items-center text-[var(--color-terminal-dim)]">
                <span className="mr-2">{'>'}</span>
                <span className="text-[var(--color-terminal-text)]">{entry.content}</span>
              </div>
            )}
            
            {entry.type === 'output' && (
              <div className="text-glow animate-[typing_0.5s_ease-out_forwards] overflow-hidden">
                {entry.content}
              </div>
            )}

            {entry.type === 'ascii' && (
              <pre className="text-[10px] md:text-sm leading-none text-[var(--color-terminal-info)] font-[family-name:var(--font-terminal)]">
                {entry.content}
              </pre>
            )}

            {entry.type === 'error' && (
              <div className="text-[var(--color-terminal-alert)] text-glow-alert">
                {entry.content}
              </div>
            )}

            {entry.type === 'success' && (
              <div className="text-[var(--color-terminal-info)] font-bold text-glow">
                {entry.content}
              </div>
            )}
            
            {entry.type === 'info' && (
               <div className="text-yellow-400 font-bold">
                 {entry.content}
               </div>
            )}
          </div>
        ))}

        {/* Input Line */}
        <div className="flex items-center mt-2 group">
          <span className="mr-2 text-[var(--color-terminal-info)]">
             {path.join('/')}{'>'}
          </span>
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent border-none outline-none text-[var(--color-terminal-text)] caret-transparent font-[family-name:var(--font-terminal)] text-lg uppercase"
              autoComplete="off"
              spellCheck="false"
              autoFocus
            />
            {/* Custom blinking caret */}
            <span 
              className="absolute top-0 pointer-events-none animate-[blink-caret_1s_step-end_infinite] border-b-2 border-[var(--color-terminal-text)]"
              style={{ 
                left: `${inputValue.length}ch`,
                width: '1ch',
                height: '1.2em'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
