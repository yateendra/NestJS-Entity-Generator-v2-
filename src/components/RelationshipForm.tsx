import React, { useState, useEffect } from 'react';
import { Relationship, RelationshipType } from '../types';
import { isValidRelationshipName, getRelationshipTypeOptions } from '../utils/helpers';

interface RelationshipFormProps {
  relationship: Relationship;
  onSave: (relationship: Relationship) => void;
  onCancel: () => void;
}

const RelationshipForm: React.FC<RelationshipFormProps> = ({
  relationship,
  onSave,
  onCancel
}) => {
  const [currentRelationship, setCurrentRelationship] = useState<Relationship>(relationship);
  const [nameError, setNameError] = useState<string>('');
  const [targetError, setTargetError] = useState<string>('');
  const relationshipTypeOptions = getRelationshipTypeOptions();
  
  useEffect(() => {
    setCurrentRelationship(relationship);
  }, [relationship]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    if (name === 'name') {
      if (!value) {
        setNameError('Relationship name is required');
      } else if (!isValidRelationshipName(value)) {
        setNameError('Relationship name must start with a lowercase letter and contain only letters and numbers');
      } else {
        setNameError('');
      }
    }
    
    if (name === 'targetEntity') {
      if (!value) {
        setTargetError('Target entity is required');
      } else {
        setTargetError('');
      }
    }
    
    setCurrentRelationship(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentRelationship.name) {
      setNameError('Relationship name is required');
      return;
    }
    
    if (!currentRelationship.targetEntity) {
      setTargetError('Target entity is required');
      return;
    }
    
    onSave(currentRelationship);
  };
  
  return (
    <form onSubmit={handleSave} className="space-y-4 bg-gray-50 p-4 rounded-md">
      <h3 className="text-lg font-medium text-gray-900">
        {relationship.id ? 'Edit Relationship' : 'Add Relationship'}
      </h3>
      
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Relationship Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="name"
          id="name"
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
            nameError ? 'border-red-500' : ''
          }`}
          value={currentRelationship.name}
          onChange={handleChange}
          placeholder="e.g., posts, user, categories"
        />
        {nameError && <p className="mt-1 text-sm text-red-500">{nameError}</p>}
      </div>
      
      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700">
          Relationship Type <span className="text-red-500">*</span>
        </label>
        <select
          name="type"
          id="type"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          value={currentRelationship.type}
          onChange={handleChange}
        >
          {relationshipTypeOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      
      <div>
        <label htmlFor="targetEntity" className="block text-sm font-medium text-gray-700">
          Target Entity <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="targetEntity"
          id="targetEntity"
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
            targetError ? 'border-red-500' : ''
          }`}
          value={currentRelationship.targetEntity}
          onChange={handleChange}
          placeholder="e.g., User, Post, Category"
        />
        {targetError && <p className="mt-1 text-sm text-red-500">{targetError}</p>}
      </div>
      
      <div>
        <label htmlFor="inverseSide" className="block text-sm font-medium text-gray-700">
          Inverse Side Property Name
        </label>
        <input
          type="text"
          name="inverseSide"
          id="inverseSide"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          value={currentRelationship.inverseSide || ''}
          onChange={handleChange}
          placeholder="e.g., user, posts (property on the target entity)"
        />
        <p className="mt-1 text-xs text-gray-500">
          Property name on the target entity that references this entity
        </p>
      </div>
      
      <div className="flex items-center">
        <input
          type="checkbox"
          name="isOptional"
          id="isOptional"
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          checked={currentRelationship.isOptional}
          onChange={handleChange}
        />
        <label htmlFor="isOptional" className="ml-2 block text-sm text-gray-700">
          Optional relationship
        </label>
      </div>
      
      <div className="flex justify-end space-x-3 pt-3">
        <button
          type="button"
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Save Relationship
        </button>
      </div>
    </form>
  );
};

export default RelationshipForm;