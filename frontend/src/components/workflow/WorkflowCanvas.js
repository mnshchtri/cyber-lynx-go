import React, { useState, useRef, useCallback, useEffect } from 'react';
import ReactFlow, { MiniMap, Controls, Background, useNodesState, useEdgesState, addEdge, Panel } from 'reactflow';
import 'reactflow/dist/style.css';

import ToolNode from './ToolNode';
import ToolConfigModal from './ToolConfigModal';
import ToolDropdown from './ToolDropdown';

const nodeTypes = {
  toolNode: ToolNode,
};

const initialNodes = [];
const initialEdges = [];

let id = 0;
const getId = () => `dndnode_${id++}`;

const WorkflowCanvas = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [configTool, setConfigTool] = useState(null);
  const [workflowName, setWorkflowName] = useState('');
  const [saveModalOpen, setSaveModalOpen] = useState(false);

  const [availableTools, setAvailableTools] = useState([
    { name: 'Nmap', icon: 'nmap', color: '#FF6D1F' },
    { name: 'Subfinder', icon: 'subfinder', color: '#1F7BFF' },
    { name: 'Dirsearch', icon: 'dirsearch', color: '#32CD32' },
    { name: 'Ghauri', icon: 'ghauri', color: '#FFD700' }
  ]);

  // Load workflow from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('cyberlynx-workflows');
    if (saved) {
      try {
        const workflows = JSON.parse(saved);
        if (workflows.length > 0) {
          const latest = workflows[workflows.length - 1];
          setNodes(latest.nodes || []);
          setEdges(latest.edges || []);
          setWorkflowName(latest.name || '');
          // Reset id counter based on loaded nodes
          const maxId = latest.nodes.reduce((max, node) => {
            const nodeIdNum = parseInt(node.id.replace('dndnode_', ''), 10);
            return isNaN(nodeIdNum) ? max : Math.max(max, nodeIdNum);
          }, -1);
          id = maxId + 1;
        }
      } catch (e) {
        console.error('Error loading workflow:', e);
      }
    }
  }, [setNodes, setEdges]);

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');
      const toolData = JSON.parse(event.dataTransfer.getData('application/json'));

      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode = {
        id: getId(),
        type: 'toolNode',
        position,
        data: {
          label: toolData.name,
          tool: toolData,
          config: {},
          onEdit: (node) => {
            setSelectedNode(node.id);
            setConfigTool(node.data.tool);
            setConfigModalOpen(true);
          },
          onDelete: (nodeId) => handleDeleteNode(nodeId),
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  const handleSaveConfig = (nodeId, config) => {
    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, config: config } }
          : node
      )
    );
  };

  const handleDeleteNode = useCallback((nodeId) => {
    setNodes((prevNodes) => prevNodes.filter((node) => node.id !== nodeId));
    setEdges((prevEdges) =>
      prevEdges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
    );
    if (selectedNode === nodeId) {
      setSelectedNode(null);
    }
  }, [setNodes, setEdges, selectedNode]);

  const handleSave = () => {
    if (!workflowName.trim()) {
      alert('Please enter a workflow name');
      return;
    }

    if (reactFlowInstance) {
      const flow = reactFlowInstance.toObject();
      const workflow = {
        id: Date.now().toString(),
        name: workflowName,
        nodes: flow.nodes,
        edges: flow.edges,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const saved = localStorage.getItem('cyberlynx-workflows');
      let workflows = saved ? JSON.parse(saved) : [];

      const existingIndex = workflows.findIndex((w) => w.name === workflowName);
      if (existingIndex >= 0) {
        workflows[existingIndex] = { ...workflow, id: workflows[existingIndex].id };
      } else {
        workflows.push(workflow);
      }

      localStorage.setItem('cyberlynx-workflows', JSON.stringify(workflows));
      setSaveModalOpen(false);
      alert('Workflow saved successfully!');
    }
  };

  const handleLoad = () => {
    const saved = localStorage.getItem('cyberlynx-workflows');
    if (saved) {
      try {
        const workflows = JSON.parse(saved);
        if (workflows.length > 0) {
          const workflowNames = workflows.map((w) => w.name);
          const selected = prompt(
            `Enter workflow name to load:\n\nAvailable: ${workflowNames.join(', ')}`
          );
          if (selected) {
            const workflow = workflows.find((w) => w.name === selected);
            if (workflow) {
              setNodes(workflow.nodes || []);
              setEdges(workflow.edges || []);
              setWorkflowName(workflow.name || '');
              // Reset id counter based on loaded nodes
              const maxId = workflow.nodes.reduce((max, node) => {
                const nodeIdNum = parseInt(node.id.replace('dndnode_', ''), 10);
                return isNaN(nodeIdNum) ? max : Math.max(max, nodeIdNum);
              }, -1);
              id = maxId + 1;
            } else {
              alert('Workflow not found');
            }
          }
        }
      } catch (e) {
        alert('Error loading workflow');
      }
    }
  };

  return (
    <div className="relative w-full h-full">
      {/* Top Bar - Minimalist */}
      <div className="absolute top-0 left-0 right-0 z-30 bg-surface-light border-b border-gray-200 dark:border-gray-700 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <input
            type="text"
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
            placeholder="Workflow name..."
            className="px-3 py-1.5 text-sm bg-background-primary border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-text-primary"
          />
          <button
            onClick={() => setSaveModalOpen(true)}
            className="px-3 py-1.5 text-sm bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors flex items-center space-x-1.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            <span>Save</span>
          </button>
          <button
            onClick={handleLoad}
            className="px-3 py-1.5 text-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-text-primary rounded-lg transition-colors flex items-center space-x-1.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <span>Load</span>
          </button>
        </div>
      </div>

      {/* Toolbar - Minimalist Sidebar with Dropdown */}
      <div className="absolute top-14 left-0 z-20 bg-surface-light border-r border-gray-200 dark:border-gray-700 p-3">
        <ToolDropdown
          tools={availableTools}
          onAddTool={(tool) => {
            // This is for direct adding, not drag-and-drop
            const newNode = {
              id: getId(),
              type: 'toolNode',
              position: { x: 250, y: 50 }, // Default position for direct add
              data: {
                label: tool.name,
                tool: tool,
                config: {},
                onEdit: (node) => {
                  setSelectedNode(node.id);
                  setConfigTool(node.data.tool);
                  setConfigModalOpen(true);
                },
                onDelete: (nodeId) => handleDeleteNode(nodeId),
              },
            };
            setNodes((nds) => nds.concat(newNode));
          }}
          onCustomize={(customTools) => {
            localStorage.setItem('cyberlynx-custom-tools', JSON.stringify(customTools));
          }}
        />
        {nodes.length > 0 && (
          <>
            <div className="my-3 border-t border-gray-200 dark:border-gray-700"></div>
            <button
              onClick={() => {
                setNodes([]);
                setEdges([]);
                setSelectedNode(null);
                setWorkflowName('');
              }}
              className="w-10 h-10 flex items-center justify-center bg-danger hover:bg-red-600 text-white rounded-lg transition-colors"
              title="Clear All"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </button>
          </>
        )}
      </div>

      {/* React Flow Canvas */}
      <div className="reactflow-wrapper absolute top-14 left-12 right-0 bottom-0" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          nodeTypes={nodeTypes}
          fitView
          className="bg-background-primary"
          onNodeClick={(event, node) => setSelectedNode(node.id)}
          onPaneClick={() => setSelectedNode(null)}
        >
          <MiniMap />
          <Controls />
          <Background variant="dots" gap={12} size={1} />
          <Panel position="bottom-right">
            {selectedNode && (
              <button
                onClick={() => handleDeleteNode(selectedNode)}
                className="px-3 py-1.5 text-sm bg-danger hover:bg-red-600 text-white rounded-lg transition-colors flex items-center space-x-1.5"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
                <span>Delete Selected Node</span>
              </button>
            )}
          </Panel>
        </ReactFlow>
      </div>

      {/* Configuration Modal */}
      {configTool && (
        <ToolConfigModal
          tool={configTool}
          isOpen={configModalOpen}
          onClose={() => {
            setConfigModalOpen(false);
            setConfigTool(null);
          }}
          onSave={handleSaveConfig}
        />
      )}

      {/* Save Modal */}
      {saveModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setSaveModalOpen(false)}>
          <div className="bg-surface-light rounded-xl p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-text-primary mb-4">Save Workflow</h3>
            <input
              type="text"
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              placeholder="Enter workflow name..."
              className="w-full px-3 py-2 bg-background-primary border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-text-primary mb-4"
              autoFocus
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setSaveModalOpen(false)}
                className="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-text-primary rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 text-sm bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkflowCanvas;