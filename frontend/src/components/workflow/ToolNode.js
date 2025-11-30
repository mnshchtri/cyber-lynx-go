import React from 'react';
import { Handle, Position } from 'reactflow';
import 'reactflow/dist/style.css';

const ToolNode = ({ data, isConnectable, selected }) => {
  const { tool, config, onEdit, onDelete } = data;

  const getToolIcon = (toolName) => {
    const iconClass = "w-6 h-6";
    switch (toolName.toLowerCase()) {
      case 'nmap':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.007 12.007 0 002.944 12c.047 2.061.582 4.015 1.381 5.813a11.955 11.955 0 013.04 8.618M12 21a9 9 0 100-18 9 9 0 000 18z" />
          </svg>
        );
      case 'subfinder':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        );
      case 'dirsearch':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
        );
      case 'ghauri':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      default:
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37-2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
    }
  };

  const getToolColor = (toolName, customColor = null) => {
    if (customColor) {
      return null; // Return null to use inline style
    }
    switch (toolName.toLowerCase()) {
      case 'nmap':
        return 'from-blue-500 to-blue-600';
      case 'subfinder':
        return 'from-green-500 to-green-600';
      case 'dirsearch':
        return 'from-purple-500 to-purple-600';
      case 'ghauri':
        return 'from-red-500 to-red-600';
      default:
        return 'from-primary to-primary-dark';
    }
  };

  return (
    <div
      className={`bg-gradient-to-br ${getToolColor(tool.name, tool.customColor) || ''} rounded-lg shadow-md p-3 min-w-[120px] border cursor-pointer transition-all relative`}
      style={tool.customColor ? {
        background: `linear-gradient(to bottom right, ${tool.customColor}, ${tool.customColor}dd)`
      } : {}}
    >
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      <div className={`flex flex-col items-center space-y-1.5 ${selected ? 'ring-2 ring-white ring-opacity-50' : ''}`}>
        <div className="w-10 h-10 bg-white bg-opacity-20 rounded-md flex items-center justify-center backdrop-blur-sm">
          {getToolIcon(tool.name)}
        </div>
        <div className="text-center">
          <h3 className="text-white font-semibold text-xs">{tool.name}</h3>
          {config && Object.keys(config).length > 0 && (
            <p className="text-white text-opacity-70 text-[10px] mt-0.5">
              {Object.keys(config).length} param{Object.keys(config).length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />

      {selected && (
        <div className="absolute -top-2 -right-2 flex space-x-1 z-10">
          <button
            onClick={() => onEdit(data)}
            className="w-6 h-6 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200"
            title="Edit Tool"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(data.id)}
            className="w-6 h-6 bg-danger hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200"
            title="Delete Tool"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default ToolNode;