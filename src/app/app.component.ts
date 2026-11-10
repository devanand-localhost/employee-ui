// Defines the top-level app shell, which wraps routed employee screens.
import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router'; // Enables navigation links and the active route view.

@Component({
  selector: 'app-root', // Matches the host element in src/index.html.
  standalone: true, // This component declares its dependencies without an NgModule.
  imports: [RouterOutlet, RouterLink], // Makes router-outlet and routerLink available to the template.
  templateUrl: './app.component.html' // Keeps the shell markup in a separate HTML file.
})
export class AppComponent {
  title = 'Employee Manager'; // Supplies the app name displayed in the header.
}