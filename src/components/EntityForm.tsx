import React, { useState } from 'react';
import { Entity } from '../types';
import { isValidEntityName } from '../utils/helpers';

interface EntityFormProps {
  entity: Entity;
  onUpdate: (updatedEntity: Entity) => void;
}

const EntityForm: React.FC<EntityFormProps> = ({ entity, onUpdate }) => {
  const [nameError, setNameError] = useState<string>('');
  
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    
    if (!newName) {
      setNameError('Entity name is required');
    } else if (!isValidEntityName(newName)) {
      setNameError('Entity name must start with a letter and contain only letters and numbers');
    } else {
      setNameError('');
    }
    
    onUpdate({ ...entity, name: newName });
  };
  
  const handleTableNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ ...entity, tableName: e.target.value });
  };
  
  const handleTimestampsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ ...entity, includeTimestamps: e.target.checked });
  };
  
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="entityName" className="block text-sm font-medium text-gray-700">
          Entity Name <span className="text-red-500">*</span>
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="entityName"
            className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
              nameError ? 'border-red-500' : ''
            }`}
            value={entity.name}
            onChange={handleNameChange}
            placeholder="UserProfile"
          />
        </div>
        {nameError && <p className="mt-1 text-sm text-red-500">{nameError}</p>}
        <p className="mt-1 text-xs text-gray-500">Use PascalCase for the entity class name</p>
      </div>
      
      <div>
        <label htmlFor="tableName" className="block text-sm font-medium text-gray-700">
          Table Name
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="tableName"
            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
            value={entity.tableName}
            onChange={handleTableNameChange}
            placeholder="user_profiles"
          />
        </div>
        <p className="mt-1 text-xs text-gray-500">Leave empty to use default naming convention</p>
      </div>
      
      <div className="flex items-center">
        <input
          id="includeTimestamps"
          type="checkbox"
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          checked={entity.includeTimestamps}
          onChange={handleTimestampsChange}
        />
        <label htmlFor="includeTimestamps" className="ml-2 block text-sm text-gray-700">
          Include timestamps (createdAt, updatedAt)
        </label>
      </div>
    </div>
  );
};

export default EntityForm;