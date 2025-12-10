import { useState, useEffect, useRef } from 'react';
import { INITIAL_FILE_SYSTEM, STORY_INTRO, ASCII_ART, USELESS_MESSAGES, CLUES, MICKEY_ID, FileSystemNode } from '../lib/game-data';

type LogEntry = {
  id: string;
  type: 'command' | 'output' | 'error' | 'success' | 'ascii' | 'info';
  content: string;
};

export function useTerminalGame() {
  const [history, setHistory] = useState<LogEntry[]>([
    { id: 'init-1', type: 'ascii', content: ASCII_ART },
    { id: 'init-2', type: 'output', content: "WLP x S.O.F STEAM EXP0" },
    { id: 'init-3', type: 'output', content: STORY_INTRO }
  ]);
  const [path, setPath] = useState<string[]>(['krustykrab']);
  const [cluesFound, setCluesFound] = useState<string[]>(["Investigate all employees to uncover the thief."]);
  const [fileSystem] = useState<Record<string, FileSystemNode>>(INITIAL_FILE_SYSTEM);
  const [awaitingInput, setAwaitingInput] = useState<{ type: 'mickey_id'; callback: (val: string) => void } | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const addToHistory = (type: LogEntry['type'], content: string) => {
    setHistory(prev => [...prev, { id: Math.random().toString(36).substr(2, 9), type, content }]);
  };

  const getDir = (currentPath: string[]): Record<string, FileSystemNode> | null => {
    // If root
    if (currentPath.length === 1 && currentPath[0] === 'krustykrab') return fileSystem;

    // Traverse
    let current = fileSystem;
    // Skip 'krustykrab' in path for traversal since fileSystem is the content OF krustykrab
    for (let i = 1; i < currentPath.length; i++) {
      const dirName = currentPath[i];
      if (current[dirName] && current[dirName].type === 'dir' && current[dirName].children) {
        current = current[dirName].children!;
      } else {
        return null;
      }
    }
    return current;
  };

  const executeCommand = (cmdStr: string) => {
    const trimmedCmd = cmdStr.trim();
    
    // Handle specific input modes (like password prompts)
    if (awaitingInput) {
      addToHistory('command', trimmedCmd); // Echo input (or mask it if we wanted)
      if (awaitingInput.type === 'mickey_id') {
         awaitingInput.callback(trimmedCmd);
         setAwaitingInput(null);
      }
      return;
    }

    addToHistory('command', trimmedCmd);

    if (!trimmedCmd) return;

    const parts = trimmedCmd.split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    switch (cmd) {
      case 'help':
        addToHistory('output', STORY_INTRO);
        break;

      case 'clear':
        setHistory([]);
        break;

      case 'pwd':
        addToHistory('output', '/' + path.join('/'));
        break;

      case 'whoami':
        addToHistory('output', 'detective');
        break;

      case 'ls':
        const showHidden = args.includes('-a');
        const currentDir = getDir(path);
        if (currentDir) {
          const files = Object.entries(currentDir)
            .filter(([name, node]) => showHidden || !node.hidden)
            .map(([name, node]) => name)
            .join('\n');
          addToHistory('output', files || '(empty)');
        } else {
          addToHistory('error', 'Error: Current directory not found.');
        }
        break;

      case 'cd':
        if (args.length === 0) return;
        const target = args[0];

        if (target === '..') {
          if (path.length > 1) {
            setPath(prev => prev.slice(0, -1));
          } else {
            addToHistory('error', 'Already at root.');
          }
        } else if (target.startsWith('/')) {
            // Absolute path
            const newPath = ['krustykrab', ...target.split('/').filter(p => p && p !== 'krustykrab')];
            // Validate
            // Simple validation: walk the path
            let valid = true;
            let current = fileSystem;
            for(let i=1; i<newPath.length; i++) {
                const p = newPath[i];
                if(current[p] && current[p].type === 'dir' && current[p].children) {
                    current = current[p].children!;
                } else {
                    valid = false;
                    break;
                }
            }
            if(valid) {
                setPath(newPath);
            } else {
                addToHistory('error', `Directory not found: ${target}`);
            }
        } else {
          // Relative path
          const currentDir = getDir(path);
          if (currentDir && currentDir[target] && currentDir[target].type === 'dir') {
            setPath(prev => [...prev, target]);
          } else {
            addToHistory('error', `Directory not found: ${target}`);
          }
        }

        // Auto-read description.txt if it exists in the new directory
        // We need to resolve the new path first
        let newPath: string[] | null = null;
        if (target === '..') {
            if (path.length > 1) newPath = path.slice(0, -1);
        } else if (target.startsWith('/')) {
             const potentialPath = ['krustykrab', ...target.split('/').filter(p => p && p !== 'krustykrab')];
             let valid = true;
             let current = fileSystem;
             for(let i=1; i<potentialPath.length; i++) {
                 const p = potentialPath[i];
                 if(current[p] && current[p].type === 'dir' && current[p].children) {
                     current = current[p].children!;
                 } else {
                     valid = false;
                     break;
                 }
             }
             if (valid) newPath = potentialPath;
        } else {
            // Relative
             const currentDir = getDir(path);
             if (currentDir && currentDir[target] && currentDir[target].type === 'dir') {
                 newPath = [...path, target];
             }
        }

        if (newPath) {
             const dir = getDir(newPath);
             if (dir && dir['description.txt'] && dir['description.txt'].type === 'file') {
                 addToHistory('info', `[INFO] ${dir['description.txt'].content}`);
             }
        }
        break;

      case 'cat':
        if (args.length === 0) {
          addToHistory('error', 'Usage: cat <filename>');
          return;
        }
        const filename = args[0];
        const dir = getDir(path);
        
        if (dir && dir[filename] && dir[filename].type === 'file') {
          // Check for special files
          const fullPath = [...path, filename].slice(1).join('/'); // Remove 'krustykrab' prefix for key matching
          
          if (filename === 'discovery.txt' && path[path.length-1] === '.private') {
             addToHistory('output', 'PROTECTED FILE. ENTER ID TO VIEW:');
             setAwaitingInput({
                 type: 'mickey_id',
                 callback: (inputVal) => {
                     if (inputVal.toUpperCase() === MICKEY_ID) {
                         const clue = CLUES["staff/mickey_mouse/.private/discovery.txt"];
                         addToHistory('success', `ACCESS GRANTED.\n\n"${clue}"`);
                         if (!cluesFound.includes(clue)) {
                             setCluesFound(prev => [...prev, clue]);
                         }
                         addToHistory('success', "*** CASE CLOSED ***\nMickey Mouse stole the formula!");
                     } else {
                         addToHistory('error', 'ACCESS DENIED. Incorrect ID.');
                     }
                 }
             });
             return;
          }

          addToHistory('output', dir[filename].content || '');

          // Check for clues
          // Construct path key like "staff/plankton/lab_notes.txt"
          // Current path is like ['krustykrab', 'staff', 'plankton']
          // We need 'staff/plankton/lab_notes.txt'
          const lookupKey = [...path.slice(1), filename].join('/');
          
          if (CLUES[lookupKey as keyof typeof CLUES]) {
             const clue = CLUES[lookupKey as keyof typeof CLUES];
             addToHistory('info', `\n[!] CLUE FOUND: ${clue}`);
             if (!cluesFound.includes(clue)) {
                 setCluesFound(prev => [...prev, clue]);
             }
          }
        } else {
           addToHistory('error', 'File not found.');
        }
        break;

      case 'exit':
        addToHistory('output', 'Shutting down terminal...');
        setTimeout(() => {
            window.location.reload(); // Simple "exit"
        }, 1000);
        break;

      default:
        addToHistory('error', `Command not found: ${cmd}`);
        break;
    }
  };

  return {
    history,
    path,
    executeCommand,
    scrollRef
  };
}
