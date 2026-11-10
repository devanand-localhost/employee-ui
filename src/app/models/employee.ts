// Defines the data shape used when employee information moves through the UI.
export interface Employee {
  id: number; // Server-assigned identifier used for lookup, editing, and deletion.
  name: string; // Employee's display name.
  email: string; // Employee's contact email address.
  department: string; // Department used for display and filtering.
  salary: number; // Employee's salary, displayed as INR in the list.
}

// Create and update requests contain editable fields but leave ID assignment to the server.
export type EmployeeRequest = Omit<Employee, 'id'>;