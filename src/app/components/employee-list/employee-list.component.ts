// Loads employees and coordinates filtering, displaying, and deleting them.
import { Component, OnInit, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common'; // Formats salary numbers for the user's locale and currency.
import { FormsModule } from '@angular/forms'; // Enables two-way binding for the department filter.
import { RouterLink } from '@angular/router'; // Enables edit and add links in the template.
import { Employee } from '../../models/employee'; // Types each employee shown in the list.
import { EmployeeService } from '../../services/employee.service'; // Fetches and deletes employee records.

@Component({
  selector: 'app-employee-list', // Names this component for use in Angular templates.
  standalone: true, // Lets the component declare its own template dependencies.
  imports: [RouterLink, FormsModule, CurrencyPipe], // Makes routing, ngModel, and currency formatting available.
  templateUrl: './employee-list.component.html' // Keeps list markup separate from its behavior.
})
export class EmployeeListComponent implements OnInit {
  private readonly employeeService = inject(EmployeeService); // Uses the shared API service to load and delete records.

  employees: Employee[] = []; // Holds API results that the template displays in the table.
  department = ''; // Holds the filter text bound to the search input.
  loading = false; // Controls whether the template shows its loading message.
  errorMessage = ''; // Holds a readable message when an API request fails.

  ngOnInit(): void {
    this.load(); // Fetch the initial employee list when Angular creates this screen.
  }

  load(): void {
    this.loading = true; // Tell the template a list request is in progress.
    this.errorMessage = ''; // Clear an older failure before starting another request.
    this.employeeService.getAll(this.department).subscribe({ // Request all employees, optionally filtered by department.
      next: data => {
        this.employees = data; // Store the response so Angular can render the rows.
        this.loading = false; // Hide the loading message after a successful response.
      },
      error: () => {
        this.errorMessage = 'Could not load employees. Is the backend running?'; // Explain the failed request in the UI.
        this.loading = false; // Stop showing the loading state after failure too.
      }
    });
  }

  clearFilter(): void {
    this.department = ''; // Reset the filter input.
    this.load(); // Reload without a department filter.
  }

  onDelete(employee: Employee): void {
    if (!confirm(`Delete ${employee.name}?`)) { // Ask before making the destructive API request.
      return; // Keep the employee when the user cancels the confirmation.
    }
    this.employeeService.delete(employee.id).subscribe({ // Delete the selected employee by its server ID.
      next: () => this.load(), // Refresh the list so the removed employee disappears.
      error: () => (this.errorMessage = 'Delete failed.') // Show a message if the API rejects the deletion.
    });
  }
}