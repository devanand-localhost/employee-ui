// Unit tests for the root shell component.
import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    // Configure Angular's test environment with the standalone component and its imports.
    await TestBed.configureTestingModule({
      imports: [AppComponent],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent); // Create a component instance inside the test environment.
    const app = fixture.componentInstance; // Get the TypeScript class instance being tested.
    expect(app).toBeTruthy(); // Verify Angular successfully created the component.
  });

  it(`should have the 'employee-ui' title`, () => {
    const fixture = TestBed.createComponent(AppComponent); // Create a fresh root component for this assertion.
    const app = fixture.componentInstance; // Read the component's public title property.
    expect(app.title).toEqual('employee-ui'); // Check the expected title value configured by this test.
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent); // Render the root component in the test fixture.
    fixture.detectChanges(); // Run Angular change detection so the template is updated.
    const compiled = fixture.nativeElement as HTMLElement; // Access the rendered DOM for assertions.
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, employee-ui'); // Verify the title text appears in the heading.
  });
});
