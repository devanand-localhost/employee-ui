// Collects application-wide providers used when Angular starts the app.
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router'; // Connects route definitions to Angular navigation.
import { provideHttpClient } from '@angular/common/http'; // Makes HttpClient available for backend requests.

import { routes } from './app.routes'; // Imports the screens and URL paths the app supports.

export const appConfig: ApplicationConfig = {
  // These providers are shared with components and services throughout the app.
  providers: [provideRouter(routes), provideHttpClient()]
};