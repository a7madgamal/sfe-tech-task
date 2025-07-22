# Instructions for Editing This File

- Keep the current concise, high-level style. Focus only on important details.
- Always sort the Plan & Progress section with finished (checked) items at the top, pending below.
- The Plan & Progress section should closely mirror the commit history: each step should include its implementation and required unit tests in a single commit and checkbox.
- Unit tests are required for every main step and must be committed together with the implementation.
- Avoid making changes to already completed (checked) items unless absolutely necessary.
- When adding, removing, or reordering tasks or sub-tasks, always update their numbers to remain sequential and logically consistent.

---

# SFE Tech Task – Progress & Plan

## Project Overview

- Angular frontend (modern, standalone, signals)
- Node.js backend (in-memory DB)
- Auth and user management flows

## Requirements

- Auth: Store token after login, share with API calls, protect user routes
- Users: Fully functional create/edit form, validation (required, custom: block 'test' in name), loading & error states
- Fix any subtle bugs in logic or API integration
- Bonus: Unit tests, UI/UX improvements
- Clean, clear git history. Small commits .

## Current Understanding

- State managed via facade/store/service pattern
- Auth and user APIs scaffolded, need integration polish

## Plan & Progress

### 1. Project Setup & Code Quality

- [x] 1.1 Initial project review and setup
- [x] 1.2 Code style and formatting configuration
- [x] 1.3 Fix failing creation/unit tests for basic components/services
  - [x] 1.3.1 Provide HttpClient in tests for AuthService, UsersService, UsersFacadeService, UserFormPageComponent, UsersListPageComponent
  - [x] 1.3.2 Fix AppComponent title and render test expectations

### 2. Authentication Flow

**See: [Token Storage Research & Decision](token_storage_research.md)**

- [x] 2.1 Token storage and sharing (frontend-only, no backend changes)
  - [x] 2.1.1 Store token in sessionStorage after login using a dedicated Angular service
  - [x] 2.1.2 Use an Angular Http Interceptor to automatically attach the token from sessionStorage to all API calls
  - [x] 2.1.3 Clear the token from sessionStorage on logout
- [x] 2.2 Route protection
  - [x] 2.2.1 Implement route guards using a functional CanActivate guard (not class-based), leveraging Angular's inject() API for DI. This approach follows the latest Angular best practices for route protection.
- [x] 2.3 Implement login submit logic: call AuthService.login; on success, store token and redirect to user management list; on failure, show an error message.
- [x] 2.4 Implement logout button for the user list page
- [x] 2.5 Automatically redirect to the login page if a 401 Unauthorized response is received from any backend API call

### 3. User Management

- [x] 3.1 User listing
  - [x] 3.1.1 Implement user list display
  - [x] 3.1.2 Add edit and delete links or buttons (use Angular Material 17+ button/icon best practices)
  - [x] 3.1.3 Handle empty state (show message when no users)
  - [x] 3.1.4 Handle error state (show error message on API failure)
  - [x] 3.1.5 Show loading indicator while fetching users
- [x] 3.2 User form create/edit logic
  - [x] 3.2.1 Implement create user logic (with loading & error states)
  - [x] 3.2.2 Implement edit user logic (with loading & error states)
  - [x] 3.2.3 Unit tests for form logic (including loading & error states)
- [x] 3.3 Implement password change UI and logic
  - [x] 3.3.1 Add a "Change Password" button/section to the user edit page
  - [x] 3.3.2 Show a form (in dialog) with:
    - New password (type="password")
    - Confirm new password (type="password")
    - Show/hide password toggle for both fields
  - [x] 3.3.3 Validate on frontend:
    - Both fields required
    - New password and confirmation must match
    - New password must be at least 6 characters and contain at least one number
  - [x] 3.3.4 On submit, call PUT /api/users/:id with only the password field (and any required fields)
    - Never send password unless changing it
    - Handle API errors and show user-friendly messages
  - [x] 3.3.5 On success, show confirmation and log the user out (require re-login)
  - [x] 3.3.6 Unit tests for form validation, service logic, and UI states (loading, error, success)

### 4. Improvements

- [ ] 4.1 UI/UX polish (bonus)
- [ ] 4.2 Additional unit tests (bonus)

### 5. Git & Submission

- [x] 5.1 Git commit guidelines
  - [x] 5.1.1 Start with an initial empty commit
  - [x] 5.1.2 Use small, clear commits for each sub-task
  - [ ] 5.1.3 End with a final commit when finished

---

Update this file as you progress. Use checkboxes to track completion. Keep summaries high-level for easy context in future prompts.

---

# Open Questions

- [ ] Backend does not support deleting users (DELETE /api/users/:id). This is required for full user management functionality.

---

# Signal Input Note

- When using Angular's signal-based input() in components, do NOT use ngOnChanges to react to input changes. Instead, use a computed effect (effect(() => ...)) to respond to changes in the input signal. This ensures the component reacts properly to input updates, such as pre-filling forms after async data loads.
