# Coding Rules

- **Never perform git commit, push, or other git commands automatically.** Only use safe commands such as diff or status when needed. All other git operations must be performed manually by the user.
- **Only make changes when clearly instructed.** If unsure, ask for clarification before proceeding.
- **Follow the current project style** (formatting, naming, structure). Use existing patterns and conventions as reference.
- **Focus on the current in-progress step** in \_AI/task_details.md. Avoid unrelated changes or distractions.
- **Keep code comments minimal.** Only add comments when necessary to clarify non-obvious logic or prevent confusion. Do not comment every small change.
- **Write small, focused commits** that match the sub-tasks in \_AI/task_details.md. Each commit should be easy to review and understand.
- **Unit tests are required for each main feature or fix.** Tests should be committed together with the implementation.
- **Use Angular 19 best practices:**
  - Prefer standalone components and signals as in the current codebase.
  - Use dependency injection for services and facades.
  - Keep components "dumb" (UI only) and delegate logic to facades/services.
  - Use reactive forms for form logic and validation.
  - Use Angular Material for UI consistency.
  - Use route guards for authentication/authorization.
  - **For HTTP testing in Angular 16+:**
    - Use both `provideHttpClient()` and `provideHttpClientTesting()` in the `providers` array of your test module, in that order, for any test involving `HttpClient` or `inject(HttpClient)` (including standalone components and services).
    - Do not use the deprecated `HttpClientTestingModule` in `imports`.
    - The order matters: `provideHttpClient()` must come before `provideHttpClientTesting()`.
    - This ensures all dependencies are resolved for both classic and standalone Angular patterns.
- **TypeScript best practices:**
  - Avoid using the `any` type. Prefer strict typing and type inference.
  - Avoid using the `as` keyword for type assertions unless absolutely necessary.
  - Minimize or avoid the use of TypeScript/ESLint ignore comments (e.g., `// @ts-ignore`, `// eslint-disable-next-line`).
- **Error handling:**
  - Show user-friendly error messages for failed API calls or invalid input.
  - Use loading indicators for async operations.
- **Validation:**
  - Implement both required and custom validators as specified in the task.
- **Security:**
  - Never expose sensitive data in the frontend.
  - Always handle authentication tokens securely.
- **Keep the codebase clean:**
  - Remove unused code, imports, and variables.
  - Avoid duplicating logic—reuse services and utilities where possible.
- **UI/UX:**
  - Ensure the app is usable and visually consistent.
  - Follow accessibility best practices where practical.
  - When overriding Angular Material or theme styles, prefer using CSS custom properties (variables) such as --mat-app-text-color or other theme variables, rather than custom selectors or !important. This ensures better maintainability and theme compatibility.
- **ESLint/code quality:**
  - When code smells or anti-patterns are detected, always consider and suggest appropriate ESLint rules to enforce better practices.

---

# Signal Input & Angular Best Practices

- When using Angular's signal-based input() in components, do NOT use ngOnChanges to react to input changes. Instead, use a computed effect (effect(() => ...)) to respond to changes in the input signal. This ensures the component reacts properly to input updates, such as pre-filling forms after async data loads.

Update these rules as the project evolves or as new requirements are introduced.
