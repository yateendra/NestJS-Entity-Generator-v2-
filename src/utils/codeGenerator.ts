import { Entity, DataType, RelationshipType, EntityProperty, Relationship } from '../types';

/**
 * Convert a string to PascalCase (for class names)
 */
export const toPascalCase = (str: string): string => {
  if (!str) return '';
  
  return str
    .split(/[^a-zA-Z0-9]/g)
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
};

/**
 * Convert a string to camelCase (for property names)
 */
export const toCamelCase = (str: string): string => {
  const pascalCase = toPascalCase(str);
  return pascalCase.charAt(0).toLowerCase() + pascalCase.slice(1);
};

/**
 * Get the TypeORM column type based on the data type
 */
const getColumnType = (dataType: DataType): string => {
  switch (dataType) {
    case DataType.STRING:
      return 'varchar';
    case DataType.NUMBER:
      return 'int';
    case DataType.BOOLEAN:
      return 'boolean';
    case DataType.DATE:
      return 'timestamp';
    case DataType.UUID:
      return 'uuid';
    case DataType.ENUM:
      return 'enum';
    case DataType.OBJECT:
    case DataType.ARRAY:
      return 'json';
    default:
      return 'varchar';
  }
};

/**
 * Generate property decorator
 */
const generatePropertyDecorator = (property: EntityProperty): string[] => {
  const decorators: string[] = [];
  const options: string[] = [];

  // Add Column decorator with options
  if (property.isPrimaryKey) {
    decorators.push('@PrimaryGeneratedColumn()');
  } else {
    if (property.type === DataType.STRING && property.length) {
      options.push(`length: ${property.length}`);
    }
    
    if (property.isUnique) {
      options.push('unique: true');
    }
    
    if (property.isNullable) {
      options.push('nullable: true');
    }
    
    if (property.defaultValue && property.defaultValue.trim() !== '') {
      if (property.type === DataType.STRING) {
        options.push(`default: '${property.defaultValue}'`);
      } else if (property.type === DataType.BOOLEAN) {
        options.push(`default: ${property.defaultValue.toLowerCase()}`);
      } else {
        options.push(`default: ${property.defaultValue}`);
      }
    }
    
    const columnType = getColumnType(property.type);
    const optionsStr = options.length > 0 ? `{ type: '${columnType}', ${options.join(', ')} }` : `'${columnType}'`;
    decorators.push(`@Column(${optionsStr})`);
  }
  
  return decorators;
};

/**
 * Generate relationship decorator
 */
const generateRelationshipDecorator = (relationship: Relationship): string[] => {
  const decorators: string[] = [];
  const options: string[] = [];
  
  if (relationship.inverseSide) {
    options.push(`(type) => ${relationship.targetEntity}, (${toCamelCase(relationship.targetEntity)}) => ${toCamelCase(relationship.targetEntity)}.${relationship.inverseSide}`);
  } else {
    options.push(`(type) => ${relationship.targetEntity}`);
  }
  
  if (relationship.isOptional) {
    options.push('{ nullable: true }');
  }
  
  decorators.push(`@${relationship.type}(${options.join(', ')})`);
  
  return decorators;
};

/**
 * Generate TypeScript type for a property
 */
const getTypeScriptType = (dataType: DataType, isOptional: boolean): string => {
  let type: string;
  
  switch (dataType) {
    case DataType.STRING:
      type = 'string';
      break;
    case DataType.NUMBER:
      type = 'number';
      break;
    case DataType.BOOLEAN:
      type = 'boolean';
      break;
    case DataType.DATE:
      type = 'Date';
      break;
    case DataType.OBJECT:
      type = 'Record<string, any>';
      break;
    case DataType.ARRAY:
      type = 'any[]';
      break;
    case DataType.UUID:
      type = 'string';
      break;
    case DataType.ENUM:
      type = 'string';
      break;
    default:
      type = 'any';
  }
  
  return isOptional ? `${type} | null` : type;
};

/**
 * Generate relationship TypeScript type
 */
const getRelationshipType = (relationship: Relationship): string => {
  const baseType = relationship.targetEntity;
  
  switch (relationship.type) {
    case RelationshipType.ONE_TO_ONE:
      return relationship.isOptional ? `${baseType} | null` : baseType;
    case RelationshipType.MANY_TO_ONE:
      return relationship.isOptional ? `${baseType} | null` : baseType;
    case RelationshipType.ONE_TO_MANY:
    case RelationshipType.MANY_TO_MANY:
      return `${baseType}[]`;
    default:
      return baseType;
  }
};

/**
 * Generate the full entity code
 */
export const generateEntityCode = (entity: Entity, templateType: 'NestJS' | 'NestJS + TypeORM' = 'NestJS + TypeORM'): string => {
  const entityName = toPascalCase(entity.name);
  const tableName = entity.tableName || toCamelCase(entity.name) + 's';
  const importStatements: string[] = [];
  
  // Add imports based on template type
  if (templateType === 'NestJS + TypeORM') {
    importStatements.push('import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn');
    
    // Add relationship imports if needed
    const relationshipTypes = new Set(entity.relationships.map(rel => rel.type));
    if (relationshipTypes.size > 0) {
      importStatements[0] += ', ' + Array.from(relationshipTypes).join(', ');
    }
    
    importStatements[0] += ' } from \'typeorm\';';
  } else {
    importStatements.push('import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from \'@nestjs/typeorm\';');
  }
  
  // Generate entity code
  let code = importStatements.join('\n') + '\n\n';
  
  // Add Entity decorator
  code += `@Entity('${tableName}')\n`;
  code += `export class ${entityName} {\n`;
  
  // Add properties
  entity.properties.forEach(property => {
    const decorators = generatePropertyDecorator(property);
    decorators.forEach(decorator => {
      code += `  ${decorator}\n`;
    });
    
    const typeStr = getTypeScriptType(property.type, property.isOptional);
    code += `  ${property.name}${property.isOptional ? '?' : ''}: ${typeStr};\n\n`;
  });
  
  // Add relationships
  entity.relationships.forEach(relationship => {
    const decorators = generateRelationshipDecorator(relationship);
    decorators.forEach(decorator => {
      code += `  ${decorator}\n`;
    });
    
    const typeStr = getRelationshipType(relationship);
    code += `  ${relationship.name}${relationship.isOptional ? '?' : ''}: ${typeStr};\n\n`;
  });
  
  // Add timestamps if needed
  if (entity.includeTimestamps) {
    code += '  @CreateDateColumn()\n';
    code += '  createdAt: Date;\n\n';
    code += '  @UpdateDateColumn()\n';
    code += '  updatedAt: Date;\n';
  }
  
  code += '}\n';
  
  return code;
};