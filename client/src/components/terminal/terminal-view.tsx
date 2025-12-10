import { useEffect, useRef, useState } from 'react';
import { useTerminalGame } from '@/hooks/use-terminal';
import { cn } from '@/lib/utils';

export function TerminalView() {
  const { history, path, executeCommand } = useTerminalGame();
  const [inputValue, setInputValue] = useState('');
  const [isBooting, setIsBooting] = useState(true);
  const [bootLines, setBootLines] = useState<string[]>([]);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Boot Sequence
  useEffect(() => {
    const bootSequence = [
      "Initializing KRUSTY-BIOS v1.0.4...",
      "Copyright (c) 1999-2025 Eugene Krabs Enterprises",
      "------------------------------------------------",
      "CPU: Intel i9-9900K (Krabby Lake) @ 5.0GHz",
      "Memory: 64TB (Stolen from Plankton's Lab)",
      "Checking Peripherals...",
      "  > Spatula....................... [OK]",
      "  > Cash Register................. [ONLINE]",
      "  > Secret Formula Container...... [MISSING]",
      "WARNING: CRITICAL SYSTEM FAILURE DETECTED.",
      "Initiating Emergency Protocols...",
      "Loading 'detective_module.ko'...",
      "Mounting '/mnt/bikini_bottom'...",
      "Establishing secure connection to Shell City...",
      "Access Granted.",
      "Welcome, User.",
    ];

    let delay = 0;
    bootSequence.forEach((line, index) => {
      // Vary delay for realism
      delay += Math.random() * 200 + 150; 
      // Longer pause on "MISSING" or specific lines
      if (line.includes("MISSING") || line.includes("WARNING")) delay += 800;
      
      setTimeout(() => {
        setBootLines(prev => [...prev, line]);
        if (index === bootSequence.length - 1) {
          setTimeout(() => setIsBooting(false), 1500);
        }
      }, delay);
    });
  }, []);

  // Auto-focus input
  useEffect(() => {
    if (isBooting) return;
    const focusInput = () => inputRef.current?.focus();
    focusInput();
    window.addEventListener('click', focusInput);
    return () => window.removeEventListener('click', focusInput);
  }, [isBooting]);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, bootLines]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeCommand(inputValue);
      setInputValue('');
    }
  };

  if (isBooting) {
    return (
      <div className="relative min-h-screen w-full bg-[var(--color-terminal-bg)] font-[family-name:var(--font-terminal)] text-[var(--color-terminal-text)] p-4 md:p-8 flex flex-col">
        <div className="scanline pointer-events-none fixed inset-0 z-50" />
        <div className="crt-flicker pointer-events-none fixed inset-0 z-40" />
        <div className="screen-vignette pointer-events-none fixed inset-0 z-45" />
        
        <div className="z-10 text-lg md:text-xl font-bold tracking-wider">
           {bootLines.map((line, i) => (
             <div key={i} className={cn(
               "mb-1",
               line.includes("WARNING") || line.includes("MISSING") ? "text-red-500 animate-pulse" : "",
               line.includes("OK") || line.includes("ONLINE") ? "text-green-500" : ""
             )}>{line}</div>
           ))}
           <div className="animate-pulse mt-4">_</div>
        </div>
        <div ref={bottomRef} />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full bg-[var(--color-terminal-bg)] font-[family-name:var(--font-terminal)] text-[var(--color-terminal-text)] p-4 md:p-8 flex flex-col overflow-hidden">
      {/* CRT Effects */}
      <div className="scanline pointer-events-none fixed inset-0 z-50" />
      <div className="crt-flicker pointer-events-none fixed inset-0 z-40" />
      <div className="screen-vignette pointer-events-none fixed inset-0 z-45" />

      {/* Terminal Content */}
      <div className="relative z-10 flex-1 pb-4">
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
              <pre className="text-[10px] md:text-sm leading-normal text-[var(--color-terminal-info)] font-[family-name:var(--font-code)] whitespace-pre">
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
              className="w-full bg-transparent border-none outline-none text-[var(--color-terminal-text)] caret-transparent font-[family-name:var(--font-terminal)]"
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
        
        {/* Scroll Anchor */}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
