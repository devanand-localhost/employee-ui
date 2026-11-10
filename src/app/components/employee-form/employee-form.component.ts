// Handles both creating an employee and editing an existing one.
import { Component, OnInit, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http'; // Gives the API error handler a typed error response.
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'; // Builds and validates the form model.
import { ActivatedRoute, Router, RouterLink } from '@angular/router'; // Reads the URL ID and navigates after saving.
import { EmployeeRequest } from '../../models/employee'; // Types the editable fields sent to the API.
import { EmployeeService } from '../../services/employee.service'; // Loads, creates, and updates employee data.

@Component({
  selector: 'app-employee-form', // Names this component for use in Angular templates.
  standalone: true, // Lets the component declare its own template dependencies.
  imports: [ReactiveFormsModule, RouterLink], // Enables reactive form directives and the cancel link.
  templateUrl: './employee-form.component.html' // Keeps form markup separate from form behavior.
})
export class EmployeeFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder); // Creates the reactive form and its controls.
  private readonly route = inject(ActivatedRoute); // Reads the optional employee ID from the current URL.
  private readonly router = inject(Router); // Navigates back to the list when saving succeeds.
  private readonly employeeService = inject(EmployeeService); // Sends form operations to the backend.

  // Define editable fields and client-side rules; nonNullable keeps values from becoming null.
  form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(100)]], // Require a name of at most 100 characters.
    email: ['', [Validators.required, Validators.email, Validators.maxLength(150)]], // Require a valid email up to 150 characters.
    department: ['', [Validators.required, Validators.maxLength(50)]], // Require a department of at most 50 characters.
    salary: [0, [Validators.required, Validators.min(0.01)]] // Require a positive salary.
  });

  employeeId: number | null = null; // Null means create mode; a number means edit mode.
  saving = false; // Disables the submit button while an API save is pending.
  errorMessage = ''; // Holds a request-level message for the template.
  fieldErrors: Record<string, string> = {}; // Holds validation messages returned for individual fields.

  get isEdit(): boolean {
    return this.employeeId !== null; // Let the template choose create or edit wording.
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id'); // Read the optional :id segment from the edit URL.
    if (idParam) {
      this.employeeId = Number(idParam); // Convert the route's text ID to the numeric API ID.
      this.employeeService.getById(this.employeeId).subscribe({ // Load the existing data before the user edits it.
        next: emp =>
          this.form.patchValue({
            name: emp.name, // Copy the saved name into its form control.
            email: emp.email, // Copy the saved email into its form control.
            department: emp.department, // Copy the saved department into its form control.
            salary: emp.salary // Copy the saved salary into its form control.
          }),
        error: () => (this.errorMessage = 'Employee not found.') // Explain when the requested record cannot be loaded.
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched(); // Reveal validation feedback for every invalid field.
      return; // Do not send invalid form data to the API.
    }

    this.saving = true; // Switch the submit button to its saving state.
    this.errorMessage = ''; // Clear errors from an earlier attempt.
    this.fieldErrors = {}; // Clear server validation messages from an earlier attempt.

    const payload: EmployeeRequest = this.form.getRawValue(); // Read the current editable values as an API request object.
    const request$ = // Pick the API operation based on whether this form has an employee ID.
      this.employeeId === null
        ? this.employeeService.create(payload) // No ID means create a new employee.
        : this.employeeService.update(this.employeeId, payload); // An ID means update that existing employee.

    request$.subscribe({ // Send the selected request and handle its asynchronous result.
      next: () => this.router.navigate(['/employees']), // Return to the list after the server saves successfully.
      error: (err: HttpErrorResponse) => {
        this.saving = false; // Re-enable submission so the user can correct or retry.
        this.fieldErrors = err.error?.fieldErrors ?? {}; // Show any field-specific validation errors from the server.
        this.errorMessage = err.error?.message ?? 'Something went wrong. Please try again.'; // Show server detail or a general fallback.
      }
    });
  }
}