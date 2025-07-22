# Coding Rules

- **Only make changes when clearly instructed.** If unsure, ask for clarification before proceeding.
- **Follow the current project style** (formatting, naming, structure). Use existing patterns and conventions as reference.
- **Focus on the current in-progress step** in \_AI/task_details.md. Avoid unrelated changes or distractions.
- **Keep code comments minimal.** Only add comments when necessary to clarify non-obvious logic or prevent confusion. Do not comment every small change.
- **Write small, focused commits** that match the sub-tasks in \_AI/task_details.md. Each commit should be easy to review and understand.
- **Unit tests are required for each main feature or fix.** Tests should be committed together with the implementation.
- **Use Angular best practices:**
  - Prefer standalone components and signals as in the current codebase.
  - Use dependency injection for services and facades.
  - Keep components "dumb" (UI only) and delegate logic to facades/services.
  - Use reactive forms for form logic and validation.
  - Use Angular Material for UI consistency.
  - Use route guards for authentication/authorization.
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

---

Update these rules as the project evolves or as new requirements are introduced.
