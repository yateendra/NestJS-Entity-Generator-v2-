import React, { useState } from 'react';
import { EntityProperty } from '../types';
import { Pencil, Trash2, PlusCircle } from 'lucide-react';
import { createNewProperty, getDataTypeOptions } from '../utils/helpers';
import PropertyForm from './PropertyForm';

interface PropertiesListProps {
  properties: EntityProperty[];
  onAddProperty: (property: EntityProperty) => void;
  onUpdateProperty: (propertyId: string, updatedProperty: EntityProperty) => void;
  onDeleteProperty: (propertyId: string) => void;
}

const PropertiesList: React.FC<PropertiesListProps> = ({
  properties,
  onAddProperty,
  onUpdateProperty,
  onDeleteProperty
}) => {
  const [editingProperty, setEditingProperty] = useState<EntityProperty | null>(null);
  const [isAddingProperty, setIsAddingProperty] = useState(false);
  const dataTypeOptions = getDataTypeOptions().reduce((acc, option) => {
    acc[option.value] = option.label;
    return acc;
  }, {} as Record<string, string>);
  
  const handleAddClick = () => {
    setIsAddingProperty(true);
    setEditingProperty(createNewProperty());
  };
  
  const handleEditClick = (property: EntityProperty) => {
    setEditingProperty(property);
    setIsAddingProperty(false);
  };
  
  const handleSaveProperty = (property: EntityProperty) => {
    if (isAddingProperty) {
      onAddProperty(property);
    } else if (editingProperty) {
      onUpdateProperty(editingProperty.id, property);
    }
    
    setEditingProperty(null);
    setIsAddingProperty(false);
  };
  
  const handleCancelEdit = () => {
    setEditingProperty(null);
    setIsAddingProperty(false);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Entity Properties</h2>
        <button
          type="button"
          onClick={handleAddClick}
          className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Property
        </button>
      </div>
      
      {editingProperty ? (
        <PropertyForm
          property={editingProperty}
          onSave={handleSaveProperty}
          onCancel={handleCancelEdit}
        />
      ) : (
        <div>
          {properties.length === 0 ? (
            <div className="text-center py-4 bg-gray-50 rounded-md">
              <p className="text-gray-500">No properties added yet</p>
              <button
                type="button"
                onClick={handleAddClick}
                className="mt-2 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                <PlusCircle className="mr-1 h-4 w-4" />
                Add your first property
              </button>
            </div>
          ) : (
            <div className="overflow-hidden bg-white shadow sm:rounded-md">
              <ul role="list" className="divide-y divide-gray-200">
                {properties.map(property => (
                  <li key={property.id}>
                    <div className="flex items-center px-4 py-4 sm:px-6">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center">
                          <p className="truncate font-medium text-blue-600">{property.name}</p>
                          {property.isPrimaryKey && (
                            <span className="ml-2 inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                              Primary Key
                            </span>
                          )}
                          {property.isUnique && (
                            <span className="ml-2 inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                              Unique
                            </span>
                          )}
                        </div>
                        <div className="mt-1 flex">
                          <span className="text-sm text-gray-500">
                            Type: {dataTypeOptions[property.type]}
                            {property.isOptional ? ' (Optional)' : ''}
                            {property.isNullable ? ' (Nullable)' : ''}
                          </span>
                        </div>
                      </div>
                      <div className="flex-shrink-0 flex space-x-2">
                        <button
                          type="button"
                          className="inline-flex items-center rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                          onClick={() => handleEditClick(property)}
                        >
                          <Pencil className="h-4 w-4 text-gray-500" />
                        </button>
                        <button
                          type="button"
                          className="inline-flex items-center rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                          onClick={() => onDeleteProperty(property.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PropertiesList;