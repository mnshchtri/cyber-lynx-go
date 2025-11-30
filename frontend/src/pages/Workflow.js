import React from 'react';
import WorkflowCanvas from '../components/workflow/WorkflowCanvas';

const Workflow = () => {
  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold text-text-primary mb-1">Workflow Builder</h2>
        <p className="text-sm text-text-secondary">Design and customize your security assessment workflows</p>
      </div>
      <div className="flex-1 bg-surface-light rounded-lg overflow-hidden" style={{ minHeight: '400px' }}>
        <WorkflowCanvas />
      </div>
    </div>
  );
};

export default Workflow;
