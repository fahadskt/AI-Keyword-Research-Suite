import React from 'react';

interface Props {
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export const DashboardLayout: React.FC<Props> = ({ title, children, actions }) => {
  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
        {actions && <div className="flex space-x-4">{actions}</div>}
      </div>
      {children}
    </div>
  );
}; 