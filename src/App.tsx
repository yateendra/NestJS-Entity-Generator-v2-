import React, { useState, useEffect } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { Database, Code, GithubIcon } from 'lucide-react';
import { Entity, EntityProperty, Relationship } from './types';
import EntityForm from './components/EntityForm';
import PropertiesList from './components/PropertiesList';
import RelationshipsList from './components/RelationshipsList';
import CodeDisplay from './components/CodeDisplay';
import { generateEntityCode } from './utils/codeGenerator';
import { v4 as uuidv4 } from 'uuid';

const defaultEntity: Entity = {
  name: '',
  tableName: '',
  includeTimestamps: true,
  properties: [],
  relationships: []
};

function App() {
  const [entity, setEntity] = useState<Entity>(defaultEntity);
  const [activeTab, setActiveTab] = useState(0);
  const [templateType, setTemplateType] = useState<'NestJS' | 'NestJS + TypeORM'>('NestJS + TypeORM');
  const [generatedCode, setGeneratedCode] = useState<string>('');
  
  // Generate code when entity changes or template type changes
  useEffect(() => {
    if (entity.name) {
      const code = generateEntityCode(entity, templateType);
      setGeneratedCode(code);
    } else {
      setGeneratedCode('');
    }
  }, [entity, templateType]);
  
  // Handle entity updates
  const handleEntityUpdate = (updatedEntity: Entity) => {
    setEntity(updatedEntity);
  };
  
  // Handle property operations
  const handleAddProperty = (property: EntityProperty) => {
    // If it's a primary key, ensure no other property is a primary key
    let updatedProperties = entity.properties;
    
    if (property.isPrimaryKey) {
      updatedProperties = entity.properties.map(p => ({
        ...p,
        isPrimaryKey: false
      }));
    }
    
    setEntity({
      ...entity,
      properties: [...updatedProperties, { ...property, id: uuidv4() }]
    });
  };
  
  const handleUpdateProperty = (propertyId: string, updatedProperty: EntityProperty) => {
    // If it's a primary key, ensure no other property is a primary key
    let updatedProperties = entity.properties.map(p => 
      p.id === propertyId ? updatedProperty : p
    );
    
    if (updatedProperty.isPrimaryKey) {
      updatedProperties = updatedProperties.map(p => ({
        ...p,
        isPrimaryKey: p.id === propertyId ? true : false
      }));
    }
    
    setEntity({
      ...entity,
      properties: updatedProperties
    });
  };
  
  const handleDeleteProperty = (propertyId: string) => {
    setEntity({
      ...entity,
      properties: entity.properties.filter(p => p.id !== propertyId)
    });
  };
  
  // Handle relationship operations
  const handleAddRelationship = (relationship: Relationship) => {
    setEntity({
      ...entity,
      relationships: [...entity.relationships, { ...relationship, id: uuidv4() }]
    });
  };
  
  const handleUpdateRelationship = (relationshipId: string, updatedRelationship: Relationship) => {
    setEntity({
      ...entity,
      relationships: entity.relationships.map(r => 
        r.id === relationshipId ? updatedRelationship : r
      )
    });
  };
  
  const handleDeleteRelationship = (relationshipId: string) => {
    setEntity({
      ...entity,
      relationships: entity.relationships.filter(r => r.id !== relationshipId)
    });
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center">
            <Database className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">NestJS Entity Generator</h1>
              <p className="text-sm text-gray-500">Generate TypeScript entities with proper NestJS decorators</p>
            </div>
          </div>
          <a
            href="https://github.com/nestjs/typeorm"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-gray-500 hover:text-gray-900"
          >
            <GithubIcon className="h-5 w-5 mr-1" />
            <span className="text-sm">NestJS TypeORM</span>
          </a>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Entity Configuration */}
            <div className="space-y-6">
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Entity Configuration</h2>
                <EntityForm
                  entity={entity}
                  onUpdate={handleEntityUpdate}
                />
              </div>
              
              <div className="bg-white shadow rounded-lg p-6">
                <Tabs selectedIndex={activeTab} onSelect={index => setActiveTab(index)}>
                  <TabList className="flex border-b mb-4">
                    <Tab 
                      className="py-2 px-4 text-center focus:outline-none cursor-pointer"
                      selectedClassName="border-b-2 border-blue-500 font-medium text-blue-600"
                    >
                      Properties
                    </Tab>
                    <Tab 
                      className="py-2 px-4 text-center focus:outline-none cursor-pointer"
                      selectedClassName="border-b-2 border-blue-500 font-medium text-blue-600"
                    >
                      Relationships
                    </Tab>
                  </TabList>
                  
                  <TabPanel>
                    <PropertiesList
                      properties={entity.properties}
                      onAddProperty={handleAddProperty}
                      onUpdateProperty={handleUpdateProperty}
                      onDeleteProperty={handleDeleteProperty}
                    />
                  </TabPanel>
                  
                  <TabPanel>
                    <RelationshipsList
                      relationships={entity.relationships}
                      onAddRelationship={handleAddRelationship}
                      onUpdateRelationship={handleUpdateRelationship}
                      onDeleteRelationship={handleDeleteRelationship}
                    />
                  </TabPanel>
                </Tabs>
              </div>
            </div>
            
            {/* Right Column - Generated Code */}
            <div className="lg:sticky lg:top-6 lg:self-start">
              <div className="bg-white shadow rounded-lg p-6">
                <div className="mb-4 flex justify-between items-center">
                  <h2 className="text-lg font-medium text-gray-900">Generated Code</h2>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Template:</span>
                    <select
                      value={templateType}
                      onChange={(e) => setTemplateType(e.target.value as 'NestJS' | 'NestJS + TypeORM')}
                      className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                    >
                      <option value="NestJS + TypeORM">NestJS + TypeORM</option>
                      <option value="NestJS">NestJS</option>
                    </select>
                  </div>
                </div>
                
                {entity.name ? (
                  <CodeDisplay
                    code={generatedCode}
                    title="TypeScript Entity"
                    subtitle={`NestJS ${templateType === 'NestJS + TypeORM' ? '+ TypeORM' : ''}`}
                  />
                ) : (
                  <div className="flex items-center justify-center h-64 bg-gray-50 rounded-md">
                    <div className="text-center p-6">
                      <Code className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-lg font-medium text-gray-900">No Entity Configured</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Fill out the entity configuration to generate code.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-white shadow-inner mt-8">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            NestJS Entity Generator - A tool for rapid API development
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;