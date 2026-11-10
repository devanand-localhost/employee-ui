// This file is the browser entry point that starts the Angular application.
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config'; // Loads app-wide providers such as routing and HTTP.
import { AppComponent } from './app/app.component'; // Supplies the root component shown in <app-root>.

// Create the standalone app with its root component and shared configuration.
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err)); // Log startup failures so they are visible in the browser console.
