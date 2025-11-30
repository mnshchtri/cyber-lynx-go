import React from 'react';
import WorkflowTerminal from '../components/workflow/WorkflowTerminal';

const Terminal = () => {
  // You might need to manage nodes and connections state here if the terminal
  // needs to display information related to a workflow.
  // For now, we'll pass empty arrays or adjust WorkflowTerminal to not require them if not needed.
  // Or, if the terminal is truly standalone, it might not need these props.
  // Assuming for now it can function without specific workflow nodes/connections on its own page.
  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold text-text-primary mb-1">Terminal</h2>
        <p className="text-sm text-text-secondary">Interact with the system via command line</p>
      </div>
      <div className="flex-1 bg-surface-light rounded-lg overflow-hidden">
        <WorkflowTerminal nodes={[]} connections={[]} />
      </div>
    </div>
  );
};

export default Terminal;
