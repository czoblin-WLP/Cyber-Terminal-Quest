import { useEffect, useRef, useState } from 'react';
import { useTerminalGame } from '@/hooks/use-terminal';
import { cn } from '@/lib/utils';

export function TerminalView() {
  const { history, path, executeCommand, awaitingInput } = useTerminalGame();
  const [inputValue, setInputValue] = useState('');
  const [isBooting, setIsBooting] = useState(true);
  const [bootLines, setBootLines] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  
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
      "  > Safe Security Lock............ [ENGAGED]",
      "  > Secret Formula Container...... [SCANNING]",
      "...........................................",
      "ERROR: CONTAINER EMPTY! FORMULA NOT FOUND!",
      "CRITICAL ALERT: ASSET #1 MISSING",
      "------------------------------------------------",
      "INITIATING CODE RED PROTOCOL",
      "  > Locking all exits............. [FAILED]",
      "  > Alerting authorities.......... [BLOCKED]",
      "  > Mr. Krabs Panic Level......... [MAXIMUM]",
      "SYSTEM COMPROMISED. TRACING INTRUDER...",
      "Trace failed. IP Address masked.",
      "Deploying Emergency Detective Shell...",
      "Mounting '/mnt/bikini_bottom'...",
      "Access Granted.",
      "Welcome, Detective.",
    ];

    let delay = 0;
    bootSequence.forEach((line, index) => {
      // Vary delay for realism
      delay += Math.random() * 150 + 100; 
      
      // Dramatic pauses
      if (line.includes("SCANNING")) delay += 1000;
      if (line.includes("ERROR")) delay += 500;
      if (line.includes("CRITICAL")) delay += 800;
      if (line.includes("Panic")) delay += 600;
      
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
      setCommandHistory(prev => [inputValue, ...prev]);
      setInputValue('');
      setHistoryIndex(-1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInputValue(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInputValue(commandHistory[newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInputValue('');
      }
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
               line.includes("ERROR") || line.includes("CRITICAL") || line.includes("FAILED") || line.includes("BLOCKED") || line.includes("MAXIMUM") ? "text-red-500 font-extrabold animate-pulse" : "",
               line.includes("OK") || line.includes("ONLINE") || line.includes("ENGAGED") || line.includes("Granted") ? "text-green-500" : "",
               line.includes("SCANNING") ? "text-yellow-400" : ""
             )}>{line}</div>
           ))}
           <div className="animate-pulse mt-4">_</div>
        </div>
        <div ref={bottomRef} />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#111] p-2 md:p-8 flex items-center justify-center">
      <div className="monitor-casing w-full max-w-7xl aspect-video md:aspect-auto md:h-[90vh] flex flex-col">
        <div className="monitor-screen relative flex flex-col p-4 md:p-8 overflow-hidden">
          
          {/* CRT Effects */}
          <div className="scanline pointer-events-none fixed inset-0 z-50" />
          <div className="crt-flicker pointer-events-none fixed inset-0 z-40" />
          <div className="screen-vignette pointer-events-none fixed inset-0 z-45" />

          {/* Terminal Content */}
          <div className="relative z-10 flex-1 pb-4 overflow-y-auto scrollbar-hide text-lg md:text-2xl">
            {history.map((entry) => (
              <div key={entry.id} className="mb-2 break-words whitespace-pre-wrap font-[family-name:var(--font-terminal)] text-[var(--color-terminal-text)]">
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
                  <pre className="text-xs md:text-base leading-normal text-[var(--color-terminal-info)] font-[family-name:var(--font-code)] whitespace-pre">
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
            <div className="flex items-center mt-2 group font-[family-name:var(--font-terminal)]">
              <span className="mr-2 text-[var(--color-terminal-info)]">
                 {awaitingInput ? 'PROTECTED FILE. ENTER ID TO VIEW: ' : `${path.join('/')}>`}
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
      </div>
    </div>
  );
}
