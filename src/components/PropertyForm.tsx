import React, { useState, useEffect } from 'react';
import { EntityProperty, DataType } from '../types';
import { isValidPropertyName, getDataTypeOptions } from '../utils/helpers';

interface PropertyFormProps {
  property: EntityProperty;
  onSave: (property: EntityProperty) => void;
  onCancel: () => void;
}

const PropertyForm: React.FC<PropertyFormProps> = ({ 
  property, 
  onSave, 
  onCancel 
}) => {
  const [currentProperty, setCurrentProperty] = useState<EntityProperty>(property);
  const [nameError, setNameError] = useState<string>('');
  const dataTypeOptions = getDataTypeOptions();
  
  useEffect(() => {
    setCurrentProperty(property);
  }, [property]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    if (name === 'name') {
      if (!value) {
        setNameError('Property name is required');
      } else if (!isValidPropertyName(value)) {
        setNameError('Property name must start with a lowercase letter and contain only letters and numbers');
      } else {
        setNameError('');
      }
    }
    
    setCurrentProperty(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentProperty.name || nameError) {
      setNameError('Property name is required');
      return;
    }
    
    onSave(currentProperty);
  };
  
  return (
    <form onSubmit={handleSave} className="space-y-4 bg-gray-50 p-4 rounded-md">
      <h3 className="text-lg font-medium text-gray-900">
        {property.id ? 'Edit Property' : 'Add Property'}
      </h3>
      
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Property Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="name"
          id="name"
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
            nameError ? 'border-red-500' : ''
          }`}
          value={currentProperty.name}
          onChange={handleChange}
          placeholder="e.g., name, email, age"
        />
        {nameError && <p className="mt-1 text-sm text-red-500">{nameError}</p>}
      </div>
      
      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700">
          Data Type <span className="text-red-500">*</span>
        </label>
        <select
          name="type"
          id="type"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          value={currentProperty.type}
          onChange={handleChange}
        >
          {dataTypeOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      
      {currentProperty.type === DataType.STRING && (
        <div>
          <label htmlFor="length" className="block text-sm font-medium text-gray-700">
            Length
          </label>
          <input
            type="number"
            name="length"
            id="length"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            value={currentProperty.length || ''}
            onChange={handleChange}
            placeholder="e.g., 255 for varchar"
          />
        </div>
      )}
      
      <div>
        <label htmlFor="defaultValue" className="block text-sm font-medium text-gray-700">
          Default Value
        </label>
        <input
          type="text"
          name="defaultValue"
          id="defaultValue"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          value={currentProperty.defaultValue || ''}
          onChange={handleChange}
          placeholder="Optional default value"
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center">
          <input
            type="checkbox"
            name="isOptional"
            id="isOptional"
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            checked={currentProperty.isOptional}
            onChange={handleChange}
          />
          <label htmlFor="isOptional" className="ml-2 block text-sm text-gray-700">
            Optional property
          </label>
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            name="isUnique"
            id="isUnique"
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            checked={currentProperty.isUnique}
            onChange={handleChange}
          />
          <label htmlFor="isUnique" className="ml-2 block text-sm text-gray-700">
            Unique constraint
          </label>
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            name="isNullable"
            id="isNullable"
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            checked={currentProperty.isNullable}
            onChange={handleChange}
          />
          <label htmlFor="isNullable" className="ml-2 block text-sm text-gray-700">
            Allow null values
          </label>
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            name="isPrimaryKey"
            id="isPrimaryKey"
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            checked={currentProperty.isPrimaryKey}
            onChange={handleChange}
          />
          <label htmlFor="isPrimaryKey" className="ml-2 block text-sm text-gray-700">
            Primary key
          </label>
        </div>
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
          Save Property
        </button>
      </div>
    </form>
  );
};

export default PropertyForm;