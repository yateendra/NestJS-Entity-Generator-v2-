# NestJS-Entity-Generator-v2-

![](https://raw.githubusercontent.com/yateendra/NestJS-Entity-Generator-v2-/refs/heads/main/Screenshot%202025-05-28%20101049.jpg)
NestJS Entity Generator interface with all the key features :

**Key Features:**

- **Entity Configuration**: Entity name, table name, and timestamp options
- **Property Management**: Add properties with various data types and constraints
- **Real-time Code Generation**: Generates TypeScript entity code with proper NestJS/TypeORM decorators
- **Property Options**: Optional, unique, nullable, and primary key constraints
- **Copy Functionality**: Easy code copying to clipboard
- **Responsive Design**: Works on both desktop and mobile


**Functionality:**

- Dynamic code generation based on form inputs
- Property validation and management
- Support for multiple data types (string, number, boolean, Date, etc.)
- Proper TypeORM decorator generation
- Timestamp fields (createdAt, updatedAt) option

1. **Edit Button**: Added a blue edit icon next to each property's delete button
2. **Inline Editing**: Click the edit button to switch the property into edit mode with a full form
3. **Complete Form**: The edit form includes all the same fields as the "Add Property" form:

1. Property Name and Data Type
2. Default Value and Length
3. All checkboxes (Optional, Unique, Allow null, Primary key)



4. **Save/Cancel Actions**:

1. "Save Changes" button to apply edits
2. "Cancel" button to discard changes and return to view mode



5. **Enhanced Property Display**: Added more visual indicators showing:

1. Nullable status
2. Default values
3. Length constraints
4. All existing constraint badges





**🎯 User Experience Improvements:**

- Only one property can be edited at a time (prevents confusion)
- Form is pre-populated with existing property values
- Clean toggle between view and edit modes
- Consistent styling with the "Add Property" form
- Visual feedback with color-coded action buttons


**🔧 How it Works:**

- Click the blue edit icon on any property to enter edit mode
- Modify any field values as needed
- Click "Save Changes" to apply updates or "Cancel" to discard
- The property list updates immediately with your changes
- Generated code reflects all edits in real-time


Now you have full CRUD (Create, Read, Update, Delete) functionality for managing your entity properties!


The interface matches the original design with proper styling, form controls, and code preview functionality.
