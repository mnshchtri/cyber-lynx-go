import React, { useState, useRef, useEffect } from 'react';

const ToolDropdown = ({ tools, onAddTool, onCustomize }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customTools, setCustomTools] = useState(() => {
    const saved = localStorage.getItem('cyberlynx-custom-tools');
    return saved ? JSON.parse(saved) : [];
  });
  const [customizeModalOpen, setCustomizeModalOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleToolClick = (tool) => {
    onAddTool(tool);
    setIsOpen(false);
  };

  const onDragStart = (event, tool) => {
    event.dataTransfer.setData('application/reactflow', 'toolNode');
    event.dataTransfer.setData('application/json', JSON.stringify(tool));
    event.dataTransfer.effectAllowed = 'move';
  };

  const allTools = [...tools, ...customTools];

  const getToolIcon = (toolName) => {
    switch (toolName.toLowerCase()) {
      case 'nmap':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.007 12.007 0 002.944 12c.047 2.061.582 4.015 1.381 5.813a11.955 11.955 0 013.04 8.618M12 21a9 9 0 100-18 9 9 0 000 18z" />
          </svg>
        );
      case 'subfinder':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        );
      case 'dirsearch':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
        );
      case 'ghauri':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
    }
  };

  const getToolColor = (toolName) => {
    switch (toolName.toLowerCase()) {
      case 'nmap':
        return 'bg-blue-500';
      case 'subfinder':
        return 'bg-green-500';
      case 'dirsearch':
        return 'bg-purple-500';
      case 'ghauri':
        return 'bg-red-500';
      default:
        return 'bg-primary';
    }
  };

  return (
    <>
      <div ref={dropdownRef} className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-10 h-10 flex items-center justify-center bg-primary hover:bg-primary-dark text-white rounded-lg transition-all shadow-sm hover:shadow-md"
          title="Add Tools"
        >
          <svg
            className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute top-12 left-0 bg-surface-light border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-30 min-w-[200px] py-2">
            <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <span className="text-xs font-semibold text-text-secondary uppercase">Tools</span>
              <button
                onClick={() => setCustomizeModalOpen(true)}
                className="text-xs text-primary hover:text-primary-dark transition-colors"
                title="Customize Tools"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {allTools.map((tool) => (
                <div
                  key={tool.name}
                  className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-grab transition-colors group flex items-center justify-between"
                  onClick={() => handleToolClick(tool)}
                  onDragStart={(event) => onDragStart(event, tool)}
                  draggable
                >
                  <div className="flex items-center space-x-2 flex-1">
                    <div className={`w-6 h-6 ${getToolColor(tool.name)} rounded flex items-center justify-center text-white`}>
                      {getToolIcon(tool.name)}
                    </div>
                    <span className="text-sm text-text-primary font-medium">{tool.name}</span>
                  </div>
                  <svg
                    className="w-4 h-4 text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                  </svg>
                </div>
              ))}
            </div>
            <div className="px-3 py-2 border-t border-gray-200 dark:border-gray-700 text-xs text-text-secondary">
              💡 Click to add or drag to canvas
            </div>
          </div>
        )}
      </div>

      {/* Customize Modal */}
      {customizeModalOpen && (
        <CustomizeToolModal
          tools={allTools}
          customTools={customTools}
          onClose={() => setCustomizeModalOpen(false)}
          onSave={(newCustomTools) => {
            setCustomTools(newCustomTools);
            localStorage.setItem('cyberlynx-custom-tools', JSON.stringify(newCustomTools));
            if (onCustomize) {
              onCustomize(newCustomTools);
            }
          }}
        />
      )}
    </>
  );
};

const CustomizeToolModal = ({ tools, customTools, onClose, onSave }) => {
  const [toolName, setToolName] = useState('');
  const [toolIcon, setToolIcon] = useState('default');
  const [toolColor, setToolColor] = useState('#ff6d1f');
  const [editingTool, setEditingTool] = useState(null);

  const handleSave = () => {
    if (!toolName.trim()) {
      alert('Please enter a tool name');
      return;
    }

    const newTool = {
      name: toolName,
      icon: toolIcon,
      color: toolColor,
      custom: true
    };

    let updated = [...customTools];
    if (editingTool) {
      const index = updated.findIndex(t => t.name === editingTool.name);
      if (index >= 0) {
        updated[index] = newTool;
      }
    } else {
      updated.push(newTool);
    }

    onSave(updated);
    setToolName('');
    setToolIcon('default');
    setToolColor('#ff6d1f');
    setEditingTool(null);
    onClose();
  };

  const handleDelete = (toolName) => {
    if (window.confirm(`Delete custom tool "${toolName}"?`)) {
      onSave(customTools.filter(t => t.name !== toolName));
    }
  };

  const handleEdit = (tool) => {
    setEditingTool(tool);
    setToolName(tool.name);
    setToolIcon(tool.icon || 'default');
    setToolColor(tool.color || '#ff6d1f');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-surface-light rounded-xl p-6 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-primary">Customize Tools</h3>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Tool Name</label>
            <input
              type="text"
              value={toolName}
              onChange={(e) => setToolName(e.target.value)}
              placeholder="Enter tool name..."
              className="w-full px-3 py-2 bg-background-primary border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-text-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Icon</label>
            <select
              value={toolIcon}
              onChange={(e) => setToolIcon(e.target.value)}
              className="w-full px-3 py-2 bg-background-primary border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-text-primary"
            >
              <option value="default">Default</option>
              <option value="nmap">Nmap</option>
              <option value="subfinder">Subfinder</option>
              <option value="dirsearch">Dirsearch</option>
              <option value="ghauri">Ghauri</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Color</label>
            <input
              type="color"
              value={toolColor}
              onChange={(e) => setToolColor(e.target.value)}
              className="w-full h-10 rounded-lg cursor-pointer"
            />
          </div>

          {customTools.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Custom Tools</label>
              <div className="space-y-2">
                {customTools.map((tool) => (
                  <div key={tool.name} className="flex items-center justify-between p-2 bg-background-primary rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded" style={{ backgroundColor: tool.color || '#ff6d1f' }}></div>
                      <span className="text-sm text-text-primary">{tool.name}</span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(tool)}
                        className="text-primary hover:text-primary-dark"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(tool.name)}
                        className="text-danger hover:text-red-600"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-text-primary rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors"
            >
              {editingTool ? 'Update' : 'Add'} Tool
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolDropdown;