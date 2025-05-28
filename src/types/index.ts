export interface EntityProperty {
  id: string;
  name: string;
  type: DataType;
  isOptional: boolean;
  isUnique: boolean;
  isNullable: boolean;
  isPrimaryKey: boolean;
  defaultValue?: string;
  length?: number;
}

export interface Relationship {
  id: string;
  name: string;
  type: RelationshipType;
  targetEntity: string;
  isOptional: boolean;
  inverseSide?: string;
}

export enum DataType {
  STRING = 'string',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  DATE = 'Date',
  OBJECT = 'object',
  ARRAY = 'array',
  UUID = 'uuid',
  ENUM = 'enum'
}

export enum RelationshipType {
  ONE_TO_ONE = 'OneToOne',
  ONE_TO_MANY = 'OneToMany',
  MANY_TO_ONE = 'ManyToOne',
  MANY_TO_MANY = 'ManyToMany'
}

export interface Entity {
  name: string;
  tableName: string;
  includeTimestamps: boolean;
  properties: EntityProperty[];
  relationships: Relationship[];
}