# Employee UI (Frontend)

A single-page application for managing employees, built with **Angular 17**.
It talks to the Spring Boot REST API in the `employee` project.

The app has a list screen with a department filter, and a form screen used for both adding and editing an employee.

## Table of contents

1. [What the application does](#1-what-the-application-does)
2. [Tech stack and why each tool is used](#2-tech-stack-and-why-each-tool-is-used)
3. [Architecture](#3-architecture)
4. [Prerequisites](#4-prerequisites)
5. [Setup and run](#5-setup-and-run)
6. [Configuration](#6-configuration)
7. [Screens and routes](#7-screens-and-routes)
8. [How data flows](#8-how-data-flows)
9. [Forms and validation](#9-forms-and-validation)
10. [Troubleshooting](#10-troubleshooting)
11. [Next steps](#11-next-steps)

---

## 1. What the application does

- Lists all employees in a table, with loading, empty and error states
- Filters the list by department
- Adds a new employee with a validated form
- Edits an existing employee, with the form pre-filled from the server
- Deletes an employee after a confirmation prompt
- Shows validation errors from both the browser and the server

---

## 2. Tech stack and why each tool is used

| Tool                  | Version                    | What it is                                 | Why it is used here                                                                                                           |
| --------------------- | -------------------------- | ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| Angular               | 17.3                       | Component-based frontend framework         | Gives routing, forms, HTTP and dependency injection in one consistent framework. Strong typing and structure suit large teams |
| Angular CLI           | 17.3.17                    | Command-line tool (`ng`)                   | Creates the project, generates components and services, runs the dev server and builds for production                         |
| TypeScript            | 5.x (installed by Angular) | Typed superset of JavaScript               | Catches mistakes at compile time. Interfaces mirror the backend DTOs                                                          |
| Node.js               | 20.18                      | JavaScript runtime                         | Required by the Angular CLI and build tools. Angular 17 supports Node 18.13+ and 20.9+                                        |
| npm                   | 10.9                       | Package manager                            | Installs dependencies listed in `package.json`                                                                                |
| RxJS                  | installed by Angular       | Reactive programming library (Observables) | `HttpClient` returns Observables. They are lazy, so a request is sent only when something subscribes                          |
| Angular Router        | part of Angular            | Client-side routing                        | Maps URLs to components without reloading the page                                                                            |
| Angular HttpClient    | part of Angular            | HTTP client                                | Sends JSON requests to the API and parses the responses                                                                       |
| Reactive Forms        | part of Angular            | Form model defined in code                 | Better than template forms for validation and for pre-filling an edit form                                                    |
| Standalone components | Angular 17 default         | Components that declare their own imports  | No `NgModule` boilerplate. Each component lists exactly what it uses                                                          |
| Built-in control flow | Angular 17                 | `@if`, `@else`, `@for` template syntax     | Cleaner than `*ngIf` and `*ngFor`. `track` lets Angular update only the rows that changed                                     |
| zone.js               | installed by Angular       | Async change-detection trigger             | After an HTTP response arrives, Angular re-renders automatically. You never touch the DOM                                     |
| CSS                   | plain                      | Styling                                    | Kept in one global file to keep the project simple                                                                            |

The project was created with:

```powershell
ng new employee-ui --routing --style=css --ssr=false
```

- `--routing` creates the router setup
- `--style=css` uses plain CSS
- `--ssr=false` builds a client-side app only (no server-side rendering)

---

## 3. Architecture

```
Component (screen)
    |  calls methods on
    v
EmployeeService   the only place that knows the backend URL
    |  uses
    v
HttpClient        sends HTTP, returns Observables
    |
    v
Spring Boot API   http://localhost:8080/api/employees
```

Components never build URLs or call HTTP directly. They call `EmployeeService`, so the API address lives in one place.

### Project structure

```
employee-ui/
  package.json                   dependencies and npm scripts
  angular.json                   build and dev-server configuration
  tsconfig*.json                 TypeScript compiler options
  src/
    index.html                   the only HTML page, contains <app-root>
    main.ts                      starts the app: bootstrapApplication(...)
    styles.css                   global styles
    app/
      app.config.ts              root providers: router + HttpClient
      app.routes.ts              URL -> component map
      app.component.ts/.html     shell: header, navigation, <router-outlet />
      models/
        employee.ts              TypeScript types matching the backend DTOs
      services/
        employee.service.ts      all API calls
      components/
        employee-list/           table, filter and delete
        employee-form/           add and edit form
```

### Responsibilities by file

| File                           | Responsibility                                                                                                                                                                                               |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `index.html`                   | Hosts `<app-root>`. The compiled bundle is injected here                                                                                                                                                     |
| `main.ts`                      | Runs `bootstrapApplication(AppComponent, appConfig)`, the Angular equivalent of a `main()` method                                                                                                            |
| `app.config.ts`                | Registers root providers. `provideRouter(routes)` and `provideHttpClient()` make `Router` and `HttpClient` injectable. Without `provideHttpClient()` you get `NullInjectorError: No provider for HttpClient` |
| `app.routes.ts`                | Declares the routes (see section 7)                                                                                                                                                                          |
| `app.component.*`              | Page shell. `<router-outlet />` is where the matched component is rendered                                                                                                                                   |
| `models/employee.ts`           | `Employee` interface and `EmployeeRequest` type (`Omit<Employee, 'id'>`). Types exist only at compile time                                                                                                   |
| `services/employee.service.ts` | `getAll`, `getById`, `create`, `update`, `delete`. Each returns an Observable                                                                                                                                |
| `employee-list.component.*`    | Loads data in `ngOnInit`, filters by department, deletes with confirmation, then reloads                                                                                                                     |
| `employee-form.component.*`    | Builds a reactive form. If the route has an `:id`, loads the employee and updates, otherwise creates                                                                                                         |
| `styles.css`                   | Global look and feel                                                                                                                                                                                         |

---

## 4. Prerequisites

| Requirement                                | Check with                                              |
| ------------------------------------------ | ------------------------------------------------------- |
| Node.js 18.13+ or 20.9+                    | `node -v`                                               |
| npm                                        | `npm -v`                                                |
| Angular CLI 17                             | `ng version`                                            |
| Backend running on `http://localhost:8080` | `Invoke-RestMethod http://localhost:8080/api/employees` |

Install the CLI if needed:

```powershell
npm install -g @angular/cli@17
```

---

## 5. Setup and run

From the `employee-ui` folder:

```powershell
npm install
ng serve
```

Open **http://localhost:4200**. The dev server rebuilds and reloads on every file change.

| Task                       | Command                                                      |
| -------------------------- | ------------------------------------------------------------ |
| Install dependencies       | `npm install`                                                |
| Dev server                 | `ng serve` (or `npm start`)                                  |
| Dev server on another port | `ng serve --port 4300` (then update the backend CORS origin) |
| Production build           | `ng build` (output in `dist/employee-ui/browser`)            |
| Generate a component       | `ng generate component components/name --skip-tests`         |
| Generate a service         | `ng generate service services/name --skip-tests`             |

Start the backend first. If it is not running, the list screen shows
"Could not load employees. Is the backend running?".

---

## 6. Configuration

### API address

The backend URL is a constant in `src/app/services/employee.service.ts`:

```ts
private readonly baseUrl = 'http://localhost:8080/api/employees';
```

Change it there if the backend runs elsewhere. Because it is defined in one place, no component needs to change.

### CORS

The browser treats `http://localhost:4200` and `http://localhost:8080` as different origins. The backend must allow the
frontend's origin. This is configured in the backend `WebConfig` class (`allowedOrigins("http://localhost:4200")`).
If you serve the frontend from another port or host, update it there.

---

## 7. Screens and routes

| URL                   | Component               | Purpose                                               |
| --------------------- | ----------------------- | ----------------------------------------------------- |
| `/`                   | redirect                | Redirects to `/employees`                             |
| `/employees`          | `EmployeeListComponent` | Table, department filter, edit and delete actions     |
| `/employees/new`      | `EmployeeFormComponent` | Create an employee                                    |
| `/employees/:id/edit` | `EmployeeFormComponent` | Edit an employee. The form is pre-filled from the API |
| anything else         | redirect                | Redirects to `/employees`                             |

One form component serves two routes. It reads the `id` parameter from `ActivatedRoute` to decide whether to create or update.

### Service methods and the backend endpoints they call

| Method                | HTTP call                                                    |
| --------------------- | ------------------------------------------------------------ |
| `getAll(department?)` | `GET /api/employees` (with `?department=...` when filtering) |
| `getById(id)`         | `GET /api/employees/{id}`                                    |
| `create(payload)`     | `POST /api/employees`                                        |
| `update(id, payload)` | `PUT /api/employees/{id}`                                    |
| `delete(id)`          | `DELETE /api/employees/{id}`                                 |

---

## 8. How data flows

### App startup

1. `ng serve` compiles the app and serves it on port 4200
2. The browser loads `index.html`, which contains `<app-root>` and the bundle
3. `main.ts` bootstraps `AppComponent` with the providers from `app.config.ts`
4. The router matches the browser URL against `app.routes.ts` and renders a component into `<router-outlet />`
5. The component is created by dependency injection, `ngOnInit` runs, and it calls the API

### Adding an employee

1. The user clicks **Save**, and `onSubmit()` runs
2. If the form is invalid, all fields are marked as touched and nothing is sent
3. `EmployeeService.create(payload)` returns an Observable. Nothing is sent yet
4. `.subscribe(...)` triggers `HttpClient` to send `POST /api/employees` with a JSON body.
   The browser first sends a preflight `OPTIONS` request, which the backend answers
5. On success, `router.navigate(['/employees'])` shows the list, whose `ngOnInit` fetches the fresh data
6. On error, the component reads `fieldErrors` and `message` from the response and displays them

### Deleting an employee

1. The user clicks **Delete** and confirms
2. `delete(id)` is sent. On success the list reloads from the server, so the screen always matches the database

### Why the screen updates automatically

zone.js watches async browser APIs (HTTP, timers, events). When a response arrives and a callback assigns
`this.employees = data`, Angular runs change detection and updates the table.

### Handling loading and errors

Components keep simple state flags: `loading`, `errorMessage` and `fieldErrors`. The template uses `@if` to show a
loading message, an empty-state message, the table, or an error.

---

## 9. Forms and validation

Validation happens in two places on purpose.

| Layer                               | Rules                                                                                                           | Purpose                                               |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| Browser (Reactive Forms validators) | name required (max 100), email required and valid (max 150), department required (max 50), salary at least 0.01 | Instant feedback and fewer wasted requests            |
| Server (Spring Bean Validation)     | Same rules, plus unique email and a maximum of 2 decimals on salary                                             | The real protection. Anyone can bypass browser checks |

When the server rejects a request, its JSON error is shown on the form:

```json
{
  "status": 400,
  "message": "Validation failed",
  "fieldErrors": { "email": "Email must be valid" }
}
```

`fieldErrors` entries appear next to the matching input. A `409` (duplicate email) shows its `message` at the top of the form.

---

## 10. Troubleshooting

| Symptom                                             | Cause                                                    | Fix                                                                                           |
| --------------------------------------------------- | -------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `NullInjectorError: No provider for HttpClient`     | `provideHttpClient()` is missing                         | Add it to `providers` in `app.config.ts`                                                      |
| CORS error in the browser console                   | Backend is down, or the frontend origin is not allowed   | Start the backend. Check `allowedOrigins` in the backend `WebConfig`                          |
| "Could not load employees. Is the backend running?" | API is unreachable                                       | Start the backend and confirm `http://localhost:8080/api/employees` responds. Check `baseUrl` |
| Network tab shows `OPTIONS` then `POST`             | Normal CORS preflight for JSON requests                  | No action needed                                                                              |
| Port 4200 is already in use                         | Another dev server is running                            | Stop it, or run `ng serve --port 4300` and update the backend CORS origin                     |
| `ng` is not recognized                              | Angular CLI is not installed globally                    | `npm install -g @angular/cli@17`                                                              |
| Template error about `fieldErrors.name`             | Strict mode requires bracket access for index signatures | Use `fieldErrors['name']`                                                                     |
| Edit form stays empty                               | The `id` route parameter or the `GET` request failed     | Check the Network tab for the `GET /api/employees/{id}` response                              |

Browser DevTools, Network tab, is the fastest way to see requests, status codes and JSON bodies.

---

## 11. Next steps

- **Environment files**: `ng generate environments`, so the API URL differs between development and production
- **HTTP interceptors** for authentication headers and global error handling
- **Pagination and sorting** in the list (after the backend supports `Pageable`)
- **Lazy-loaded routes** to split the bundle
- **Angular Material** or another UI library for consistent components
- **Unit tests** for `EmployeeService` with `HttpTestingController` and for the components with `TestBed`.
  Generated spec files were skipped with `--skip-tests`, so `ng test` has nothing meaningful to run yet
- **Signals** (Angular's newer reactivity model) to replace some manual state flags
