import React, { useState, useRef, useEffect } from 'react';

const WorkflowTerminal = ({ nodes, connections }) => {
  const [commandHistory, setCommandHistory] = useState([]);
  const [currentCommand, setCurrentCommand] = useState('');
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [output, setOutput] = useState([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [currentDirectory, setCurrentDirectory] = useState('~');
  const inputRef = useRef(null);
  const outputRef = useRef(null);
  const terminalRef = useRef(null);

  useEffect(() => {
    // Focus terminal on mount
    if (terminalRef.current) {
      terminalRef.current.focus();
    }
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom when output changes
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  const executeCommand = async (cmd) => {
    if (!cmd.trim()) {
      addOutput('', '');
      return;
    }

    // Add command to history
    const newHistory = [...commandHistory, cmd];
    setCommandHistory(newHistory);
    setHistoryIndex(-1);
    setCurrentCommand('');

    // Display command in output
    addOutput(currentDirectory, cmd);

    // Parse command
    const parts = cmd.trim().split(' ');
    const command = parts[0];
    const args = parts.slice(1);

    setIsExecuting(true);

    try {
      // Handle built-in commands
      if (command === 'clear' || command === 'cls') {
        setOutput([]);
        setIsExecuting(false);
        return;
      }

      if (command === 'cd') {
        const path = args[0] || '~';
        setCurrentDirectory(path);
        addOutput('', `Changed directory to ${path}`);
        setIsExecuting(false);
        return;
      }

      if (command === 'help') {
        addOutput('', 'Available commands:');
        addOutput('', '  clear, cls          - Clear terminal');
        addOutput('', '  cd <path>          - Change directory');
        addOutput('', '  help               - Show this help');
        addOutput('', '  history            - Show command history');
        addOutput('', '  echo <text>        - Echo text');
        addOutput('', '');
        addOutput('', 'Workflow commands:');
        addOutput('', '  workflow-commands  - Show generated workflow commands');
        addOutput('', '  workflow-execute   - Execute all workflow commands');
        setIsExecuting(false);
        return;
      }

      if (command === 'history') {
        if (commandHistory.length === 0) {
          addOutput('', 'No command history');
        } else {
          commandHistory.forEach((histCmd, idx) => {
            addOutput('', `${idx + 1}  ${histCmd}`);
          });
        }
        setIsExecuting(false);
        return;
      }

      if (command === 'echo') {
        addOutput('', args.join(' '));
        setIsExecuting(false);
        return;
      }

      if (command === 'workflow-commands') {
        const commands = generateWorkflowCommands();
        if (commands.length === 0) {
          addOutput('', 'No workflow commands generated. Add tools to your workflow.');
        } else {
          addOutput('', `Generated ${commands.length} command(s) from workflow:`);
          commands.forEach((cmd, idx) => {
            addOutput('', `[${idx + 1}] ${cmd.tool}: ${cmd.command}`);
          });
        }
        setIsExecuting(false);
        return;
      }

      if (command === 'workflow-execute') {
        const commands = generateWorkflowCommands();
        if (commands.length === 0) {
          addOutput('', 'No workflow commands to execute.');
          setIsExecuting(false);
          return;
        }
        
        addOutput('', `Executing ${commands.length} workflow command(s)...`);
        for (let i = 0; i < commands.length; i++) {
          const cmd = commands[i];
          addOutput('', `[${i + 1}/${commands.length}] Executing: ${cmd.command}`);
          
          // Execute via API
          await executeSystemCommand(cmd.command);
        }
        addOutput('', 'Workflow execution complete.');
        setIsExecuting(false);
        return;
      }

      // Execute system command via API
      await executeSystemCommand(cmd);

    } catch (error) {
      addOutput('', `Error: ${error.message}`, 'error');
    } finally {
      setIsExecuting(false);
    }
  };

  const executeSystemCommand = async (command) => {
    try {
      // Call backend API to execute command
      const response = await fetch('/api/execute-command', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ command }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.output) {
        addOutput('', data.output);
      }
      if (data.error) {
        addOutput('', data.error, 'error');
      }
      if (data.exitCode !== undefined) {
        if (data.exitCode !== 0) {
          addOutput('', `Command exited with code ${data.exitCode}`, 'error');
        }
      }
    } catch (error) {
      // If API doesn't exist, show placeholder
      if (error.message.includes('Failed to fetch') || error.message.includes('404')) {
        addOutput('', `Command: ${command}`, 'info');
        addOutput('', 'Note: Backend API endpoint /api/execute-command not configured.', 'info');
        addOutput('', 'To enable command execution, implement the API endpoint in your backend.', 'info');
      } else {
        addOutput('', `Error executing command: ${error.message}`, 'error');
      }
    }
  };

  const generateWorkflowCommands = () => {
    if (nodes.length === 0) return [];

    const executionOrder = buildExecutionOrder(nodes, connections);
    return executionOrder.map((node) => ({
      tool: node.name,
      command: buildCommand(node)
    }));
  };

  const buildExecutionOrder = (nodes, connections) => {
    const ordered = [];
    const visited = new Set();
    const inDegree = new Map();

    nodes.forEach(node => {
      inDegree.set(node.id, 0);
    });

    connections.forEach(conn => {
      inDegree.set(conn.to, (inDegree.get(conn.to) || 0) + 1);
    });

    const queue = nodes.filter(node => inDegree.get(node.id) === 0);

    while (queue.length > 0) {
      const node = queue.shift();
      if (!visited.has(node.id)) {
        visited.add(node.id);
        ordered.push(node);

        connections
          .filter(conn => conn.from === node.id)
          .forEach(conn => {
            const targetNode = nodes.find(n => n.id === conn.to);
            if (targetNode) {
              const newDegree = (inDegree.get(conn.to) || 0) - 1;
              inDegree.set(conn.to, newDegree);
              if (newDegree === 0) {
                queue.push(targetNode);
              }
            }
          });
      }
    }

    nodes.forEach(node => {
      if (!visited.has(node.id)) {
        ordered.push(node);
      }
    });

    return ordered;
  };

  const buildCommand = (node) => {
    const config = node.config || {};
    const toolName = node.name.toLowerCase();

    switch (toolName) {
      case 'nmap':
        const target = config.target || 'TARGET';
        const scanType = config.scan_type ? config.scan_type.split(' ')[0] : '-sS';
        const ports = config.ports || '1-1000';
        const timing = config.timing ? config.timing.split(' ')[0] : '-T3';
        const scripts = config.scripts ? `--script=${config.scripts}` : '';
        const outputFlag = config.output === 'XML' ? '-oX' : config.output === 'Grepable' ? '-oG' : config.output === 'All' ? '-oA' : '';
        const outputFile = outputFlag ? ` ${outputFlag} output` : '';
        return `nmap ${scanType} ${timing} ${scripts} ${ports} ${target}${outputFile}`.replace(/\s+/g, ' ').trim();

      case 'subfinder':
        const domain = config.domain || 'example.com';
        const sources = config.sources ? `-sources ${config.sources}` : '';
        const recursive = config.recursive ? '-recursive' : '';
        const threads = config.threads ? `-t ${config.threads}` : '';
        const timeout = config.timeout ? `-timeout ${config.timeout}` : '';
        const outputFileSub = config.output ? `-o ${config.output}` : '';
        return `subfinder -d ${domain} ${sources} ${recursive} ${threads} ${timeout} ${outputFileSub}`.replace(/\s+/g, ' ').trim();

      case 'dirsearch':
        const url = config.url || 'https://example.com';
        const wordlist = config.wordlist ? `-w ${config.wordlist}` : '-w /usr/share/wordlists/dirb/common.txt';
        const extensions = config.extensions ? `-e ${config.extensions}` : '';
        const threadsDir = config.threads ? `-t ${config.threads}` : '';
        const recursiveDir = config.recursive ? '--recursive' : '';
        const statusCodes = config.status_codes ? `--status-codes ${config.status_codes}` : '';
        return `python3 dirsearch.py -u ${url} ${wordlist} ${extensions} ${threadsDir} ${recursiveDir} ${statusCodes}`.replace(/\s+/g, ' ').trim();

      case 'ghauri':
        const ghauriUrl = config.url || 'http://example.com/vuln.php?id=1';
        const method = config.method || 'GET';
        const data = config.data ? `--data "${config.data}"` : '';
        const level = config.level ? `--level ${config.level.split(' ')[0]}` : '';
        const risk = config.risk ? `--risk ${config.risk}` : '';
        const technique = config.technique ? `--technique ${config.technique}` : '';
        return `ghauri -u "${ghauriUrl}" ${method === 'POST' ? `-X POST ${data}` : ''} ${level} ${risk} ${technique}`.replace(/\s+/g, ' ').trim();

      default:
        return `# ${node.name} - Configuration needed`;
    }
  };

  const addOutput = (prompt, text, type = 'normal') => {
    const timestamp = new Date().toLocaleTimeString();
    setOutput(prev => [...prev, { prompt, text, type, timestamp }]);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      executeCommand(currentCommand);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 
          ? commandHistory.length - 1 
          : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setCurrentCommand(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex >= 0) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setCurrentCommand('');
        } else {
          setHistoryIndex(newIndex);
          setCurrentCommand(commandHistory[newIndex]);
        }
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Tab completion could be added here
    } else if (e.key === 'c' && e.ctrlKey) {
      e.preventDefault();
      if (isExecuting) {
        addOutput('', '^C', 'error');
        setIsExecuting(false);
      }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      setOutput([]);
    }
  };

  const getOutputColor = (type) => {
    switch (type) {
      case 'error':
        return 'text-red-400';
      case 'info':
        return 'text-blue-400';
      default:
        return 'text-green-400';
    }
  };

  return (
    <div 
      ref={terminalRef}
      className="flex flex-col h-full bg-gray-900 rounded-lg overflow-hidden border border-gray-700"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <span className="text-xs text-gray-400 ml-2">Terminal</span>
        </div>
        <button
          onClick={() => setOutput([])}
          className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
        >
          Clear
        </button>
      </div>

      {/* Terminal Output */}
      <div
        ref={outputRef}
        className="flex-1 overflow-y-auto p-4 font-mono text-sm bg-gray-900"
        style={{ fontFamily: 'Monaco, Menlo, "Ubuntu Mono", Consolas, monospace' }}
      >
        {output.length === 0 && (
          <div className="text-gray-500 mb-2">
            <div>CyberLynX Terminal</div>
            <div className="mt-2">Type 'help' for available commands</div>
            <div>Type 'workflow-commands' to see generated workflow commands</div>
          </div>
        )}
        {output.map((item, index) => (
          <div key={index} className="mb-1">
            {item.prompt && (
              <span className="text-blue-400">
                <span className="text-green-400">user@cyberlynx</span>
                <span className="text-gray-500">:</span>
                <span className="text-blue-400">{item.prompt}</span>
                <span className="text-gray-500">$</span>
                {' '}
              </span>
            )}
            <span className={getOutputColor(item.type)}>
              {item.text}
            </span>
          </div>
        ))}
        {isExecuting && (
          <span className="inline-block w-2 h-4 bg-green-400 animate-pulse ml-1"></span>
        )}
      </div>

      {/* Command Input */}
      <div className="border-t border-gray-700 bg-gray-800 p-2">
        <div className="flex items-center">
          <span className="text-green-400 mr-1">
            <span className="text-green-400">user@cyberlynx</span>
            <span className="text-gray-500">:</span>
            <span className="text-blue-400">{currentDirectory}</span>
            <span className="text-gray-500">$</span>
          </span>
          <input
            ref={inputRef}
            type="text"
            value={currentCommand}
            onChange={(e) => setCurrentCommand(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-green-400 outline-none ml-2 font-mono"
            style={{ fontFamily: 'Monaco, Menlo, "Ubuntu Mono", Consolas, monospace' }}
            placeholder="Enter command..."
            disabled={isExecuting}
            autoFocus
          />
        </div>
      </div>
    </div>
  );
};

export default WorkflowTerminal;
