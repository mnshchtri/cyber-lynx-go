import React, { useState, useEffect } from 'react';

const ToolConfigModal = ({ tool, isOpen, onClose, onSave }) => {
  const [config, setConfig] = useState({});
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen && tool) {
      setConfig(tool.config || {});
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
    }
  }, [isOpen, tool]);

  if (!isOpen || !tool) return null;

  const handleChange = (key, value) => {
    setConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    onSave(tool.id, config);
    onClose();
  };

  const getToolParameters = (toolName) => {
    const params = {
      nmap: [
        { key: 'target', label: 'Target', type: 'text', placeholder: '192.168.1.1 or example.com', required: true },
        { key: 'scan_type', label: 'Scan Type', type: 'select', options: ['-sS (Stealth)', '-sT (TCP)', '-sU (UDP)', '-sN (Null)', '-sF (FIN)'], default: '-sS (Stealth)' },
        { key: 'ports', label: 'Ports', type: 'text', placeholder: '1-1000 or 80,443,8080', default: '1-1000' },
        { key: 'timing', label: 'Timing Template', type: 'select', options: ['T0 (Paranoid)', 'T1 (Sneaky)', 'T2 (Polite)', 'T3 (Normal)', 'T4 (Aggressive)', 'T5 (Insane)'], default: 'T3 (Normal)' },
        { key: 'scripts', label: 'NSE Scripts', type: 'text', placeholder: 'vuln,exploit,discovery', default: '' },
        { key: 'output', label: 'Output Format', type: 'select', options: ['Normal', 'XML', 'Grepable', 'All'], default: 'Normal' }
      ],
      subfinder: [
        { key: 'domain', label: 'Domain', type: 'text', placeholder: 'example.com', required: true },
        { key: 'sources', label: 'Sources', type: 'text', placeholder: 'all,passive,active', default: 'all' },
        { key: 'recursive', label: 'Recursive', type: 'checkbox', default: false },
        { key: 'threads', label: 'Threads', type: 'number', placeholder: '10', default: '10' },
        { key: 'timeout', label: 'Timeout (seconds)', type: 'number', placeholder: '30', default: '30' },
        { key: 'output', label: 'Output File', type: 'text', placeholder: 'subdomains.txt', default: '' }
      ],
      dirsearch: [
        { key: 'url', label: 'URL', type: 'text', placeholder: 'https://example.com', required: true },
        { key: 'wordlist', label: 'Wordlist', type: 'text', placeholder: '/usr/share/wordlists/dirb/common.txt', default: 'common.txt' },
        { key: 'extensions', label: 'Extensions', type: 'text', placeholder: 'php,html,js', default: '' },
        { key: 'threads', label: 'Threads', type: 'number', placeholder: '30', default: '30' },
        { key: 'recursive', label: 'Recursive', type: 'checkbox', default: false },
        { key: 'status_codes', label: 'Status Codes', type: 'text', placeholder: '200,204,301,302', default: '200,204,301,302,307,401,403' }
      ],
      ghauri: [
        { key: 'url', label: 'URL', type: 'text', placeholder: 'http://example.com/vuln.php?id=1', required: true },
        { key: 'method', label: 'HTTP Method', type: 'select', options: ['GET', 'POST'], default: 'GET' },
        { key: 'data', label: 'POST Data', type: 'text', placeholder: 'id=1&name=test', default: '' },
        { key: 'level', label: 'Risk Level', type: 'select', options: ['1 (Low)', '2 (Medium)', '3 (High)', '4 (Critical)'], default: '2 (Medium)' },
        { key: 'risk', label: 'Risk', type: 'select', options: ['1', '2', '3'], default: '1' },
        { key: 'technique', label: 'Technique', type: 'select', options: ['B (Boolean)', 'E (Error)', 'U (Union)', 'S (Stacked)', 'T (Time)', 'Q (Inline)'], default: 'BEUSTQ' }
      ]
    };
    return params[toolName.toLowerCase()] || [];
  };

  const parameters = getToolParameters(tool.name);

  return (
    <div 
      className={`fixed inset-0 flex justify-center items-center z-50 transition-all duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={`absolute inset-0 bg-black transition-opacity duration-300 ${
        isVisible ? 'opacity-60' : 'opacity-0'
      } backdrop-blur-sm`}></div>
      
      <div 
        className={`relative bg-surface-light rounded-2xl shadow-2xl w-11/12 md:w-2/3 lg:w-1/2 xl:w-2/5 max-w-2xl transform transition-all duration-300 max-h-[90vh] overflow-hidden flex flex-col ${
          isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary-dark rounded-t-2xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Configure {tool.name}</h2>
                <p className="text-white text-opacity-80 text-sm mt-1">Customize tool parameters</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-lg bg-white bg-opacity-20 hover:bg-opacity-30 text-white transition-all duration-200 hover:rotate-90"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 overflow-y-auto flex-grow">
          <div className="space-y-4">
            {parameters.map((param) => (
              <div key={param.key}>
                <label className="flex items-center text-text-primary text-sm font-semibold mb-2">
                  {param.label}
                  {param.required && <span className="text-danger ml-1">*</span>}
                </label>
                {param.type === 'text' && (
                  <input
                    type="text"
                    className="w-full py-2 px-4 text-text-primary bg-background-primary border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                    value={config[param.key] || param.default || ''}
                    onChange={(e) => handleChange(param.key, e.target.value)}
                    placeholder={param.placeholder}
                    required={param.required}
                  />
                )}
                {param.type === 'number' && (
                  <input
                    type="number"
                    className="w-full py-2 px-4 text-text-primary bg-background-primary border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                    value={config[param.key] || param.default || ''}
                    onChange={(e) => handleChange(param.key, e.target.value)}
                    placeholder={param.placeholder}
                    required={param.required}
                  />
                )}
                {param.type === 'select' && (
                  <select
                    className="w-full py-2 px-4 text-text-primary bg-background-primary border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                    value={config[param.key] || param.default || ''}
                    onChange={(e) => handleChange(param.key, e.target.value)}
                    required={param.required}
                  >
                    {param.options.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                )}
                {param.type === 'checkbox' && (
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-5 h-5 text-primary rounded focus:ring-2 focus:ring-primary"
                      checked={config[param.key] || param.default || false}
                      onChange={(e) => handleChange(param.key, e.target.checked)}
                    />
                    <span className="text-text-secondary text-sm">Enable {param.label}</span>
                  </label>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-text-primary font-semibold rounded-xl transition-all duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span>Save Configuration</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ToolConfigModal;

