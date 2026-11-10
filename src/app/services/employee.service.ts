// Centralizes HTTP communication so components do not build API requests themselves.
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'; // Provides HTTP methods and query parameters.
import { Observable } from 'rxjs'; // Describes asynchronous values returned by HTTP requests.
import { Employee, EmployeeRequest } from '../models/employee'; // Types request and response data.

@Injectable({ providedIn: 'root' }) // Makes one shared service available through Angular dependency injection.
export class EmployeeService {
  private readonly http = inject(HttpClient); // Gets the HTTP client registered in app.config.ts.
  private readonly baseUrl = 'http://localhost:8080/api/employees'; // Base address used by every employee endpoint.

  getAll(department?: string): Observable<Employee[]> {
    let params = new HttpParams(); // Start with no optional query filters.
    if (department && department.trim()) { // Only send a department filter when it has non-whitespace text.
      params = params.set('department', department.trim()); // Add the cleaned value to the URL query string.
    }
    return this.http.get<Employee[]>(this.baseUrl, { params }); // Fetch matching employees as a typed observable.
  }

  getById(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.baseUrl}/${id}`); // Fetch one employee for the edit form.
  }

  create(payload: EmployeeRequest): Observable<Employee> {
    return this.http.post<Employee>(this.baseUrl, payload); // Send new employee fields to the API.
  }

  update(id: number, payload: EmployeeRequest): Observable<Employee> {
    return this.http.put<Employee>(`${this.baseUrl}/${id}`, payload); // Replace the specified employee's editable fields.
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`); // Ask the API to remove the employee with this ID.
  }
}