// Maps browser URLs to the standalone components shown by <router-outlet>.
import { Routes } from '@angular/router';
import { EmployeeListComponent } from './components/employee-list/employee-list.component'; // Displays and manages the employee collection.
import { EmployeeFormComponent } from './components/employee-form/employee-form.component'; // Creates or edits one employee.

export const routes: Routes = [
  { path: '', redirectTo: 'employees', pathMatch: 'full' }, // Send the empty home URL to the employee list.
  { path: 'employees', component: EmployeeListComponent }, // Show all employees at /employees.
  { path: 'employees/new', component: EmployeeFormComponent }, // Show a blank form to create an employee.
  { path: 'employees/:id/edit', component: EmployeeFormComponent }, // Reuse the form to edit the employee with this ID.
  { path: '**', redirectTo: 'employees' } // Send unrecognized URLs back to the list.
];