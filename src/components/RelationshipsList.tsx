import React, { useState } from 'react';
import { Relationship } from '../types';
import { Pencil, Trash2, PlusCircle } from 'lucide-react';
import { createNewRelationship, getRelationshipTypeOptions } from '../utils/helpers';
import RelationshipForm from './RelationshipForm';

interface RelationshipsListProps {
  relationships: Relationship[];
  onAddRelationship: (relationship: Relationship) => void;
  onUpdateRelationship: (relationshipId: string, updatedRelationship: Relationship) => void;
  onDeleteRelationship: (relationshipId: string) => void;
}

const RelationshipsList: React.FC<RelationshipsListProps> = ({
  relationships,
  onAddRelationship,
  onUpdateRelationship,
  onDeleteRelationship
}) => {
  const [editingRelationship, setEditingRelationship] = useState<Relationship | null>(null);
  const [isAddingRelationship, setIsAddingRelationship] = useState(false);
  const relationshipTypeOptions = getRelationshipTypeOptions().reduce((acc, option) => {
    acc[option.value] = option.label;
    return acc;
  }, {} as Record<string, string>);
  
  const handleAddClick = () => {
    setIsAddingRelationship(true);
    setEditingRelationship(createNewRelationship());
  };
  
  const handleEditClick = (relationship: Relationship) => {
    setEditingRelationship(relationship);
    setIsAddingRelationship(false);
  };
  
  const handleSaveRelationship = (relationship: Relationship) => {
    if (isAddingRelationship) {
      onAddRelationship(relationship);
    } else if (editingRelationship) {
      onUpdateRelationship(editingRelationship.id, relationship);
    }
    
    setEditingRelationship(null);
    setIsAddingRelationship(false);
  };
  
  const handleCancelEdit = () => {
    setEditingRelationship(null);
    setIsAddingRelationship(false);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Entity Relationships</h2>
        <button
          type="button"
          onClick={handleAddClick}
          className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Relationship
        </button>
      </div>
      
      {editingRelationship ? (
        <RelationshipForm
          relationship={editingRelationship}
          onSave={handleSaveRelationship}
          onCancel={handleCancelEdit}
        />
      ) : (
        <div>
          {relationships.length === 0 ? (
            <div className="text-center py-4 bg-gray-50 rounded-md">
              <p className="text-gray-500">No relationships added yet</p>
              <button
                type="button"
                onClick={handleAddClick}
                className="mt-2 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                <PlusCircle className="mr-1 h-4 w-4" />
                Add your first relationship
              </button>
            </div>
          ) : (
            <div className="overflow-hidden bg-white shadow sm:rounded-md">
              <ul role="list" className="divide-y divide-gray-200">
                {relationships.map(relationship => (
                  <li key={relationship.id}>
                    <div className="flex items-center px-4 py-4 sm:px-6">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center">
                          <p className="truncate font-medium text-blue-600">{relationship.name}</p>
                          <span className="ml-2 inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">
                            {relationshipTypeOptions[relationship.type]}
                          </span>
                        </div>
                        <div className="mt-1 flex">
                          <span className="text-sm text-gray-500">
                            Target: {relationship.targetEntity}
                            {relationship.isOptional ? ' (Optional)' : ''}
                            {relationship.inverseSide ? ` / Inverse: ${relationship.inverseSide}` : ''}
                          </span>
                        </div>
                      </div>
                      <div className="flex-shrink-0 flex space-x-2">
                        <button
                          type="button"
                          className="inline-flex items-center rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                          onClick={() => handleEditClick(relationship)}
                        >
                          <Pencil className="h-4 w-4 text-gray-500" />
                        </button>
                        <button
                          type="button"
                          className="inline-flex items-center rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                          onClick={() => onDeleteRelationship(relationship.id)}
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

export default RelationshipsList;