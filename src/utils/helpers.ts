import { v4 as uuidv4 } from 'uuid';
import { EntityProperty, Relationship, DataType, RelationshipType } from '../types';

/**
 * Create a new entity property with default values
 */
export const createNewProperty = (): EntityProperty => ({
  id: uuidv4(),
  name: '',
  type: DataType.STRING,
  isOptional: false,
  isUnique: false,
  isNullable: false,
  isPrimaryKey: false
});

/**
 * Create a new relationship with default values
 */
export const createNewRelationship = (): Relationship => ({
  id: uuidv4(),
  name: '',
  type: RelationshipType.ONE_TO_ONE,
  targetEntity: '',
  isOptional: false
});

/**
 * Validate if an entity name is valid
 */
export const isValidEntityName = (name: string): boolean => {
  return /^[A-Za-z][A-Za-z0-9]*$/.test(name);
};

/**
 * Validate if a property name is valid
 */
export const isValidPropertyName = (name: string): boolean => {
  return /^[a-z][A-Za-z0-9]*$/.test(name);
};

/**
 * Validate if a relationship name is valid
 */
export const isValidRelationshipName = (name: string): boolean => {
  return /^[a-z][A-Za-z0-9]*$/.test(name);
};

/**
 * Get all available data types with friendly names
 */
export const getDataTypeOptions = () => [
  { value: DataType.STRING, label: 'String' },
  { value: DataType.NUMBER, label: 'Number' },
  { value: DataType.BOOLEAN, label: 'Boolean' },
  { value: DataType.DATE, label: 'Date' },
  { value: DataType.UUID, label: 'UUID' },
  { value: DataType.OBJECT, label: 'Object' },
  { value: DataType.ARRAY, label: 'Array' },
  { value: DataType.ENUM, label: 'Enum' }
];

/**
 * Get all available relationship types with friendly names
 */
export const getRelationshipTypeOptions = () => [
  { value: RelationshipType.ONE_TO_ONE, label: 'One-to-One' },
  { value: RelationshipType.ONE_TO_MANY, label: 'One-to-Many' },
  { value: RelationshipType.MANY_TO_ONE, label: 'Many-to-One' },
  { value: RelationshipType.MANY_TO_MANY, label: 'Many-to-Many' }
];