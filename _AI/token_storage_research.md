# Token Storage Research & Decision

## Overview

This document summarizes the research and rationale behind the chosen approach for authentication token storage and sharing in the Angular 19 frontend for this project.

## Options Considered

### 1. localStorage

- **Pros:** Persistent across browser sessions; easy to use.
- **Cons:** Vulnerable to XSS attacks; token remains after browser close, increasing risk if device is compromised.

### 2. sessionStorage

- **Pros:** Cleared when the browser/tab is closed; slightly safer than localStorage; easy to use; no backend changes required.
- **Cons:** Still vulnerable to XSS if the app is compromised; token lost on tab/browser close.

### 3. In-Memory Storage

- **Pros:** Not accessible to XSS; token gone on reload.
- **Cons:** Impractical for SPAs as token is lost on reload or navigation.

### 4. HttpOnly Cookies

- **Pros:** Immune to XSS; most secure for web apps.
- **Cons:** Requires backend support for setting/clearing cookies and CSRF protection; not feasible if backend cannot be changed.

## Latest Angular 19 Security Trends

- Use Angular's built-in template escaping and sanitization.
- Avoid direct DOM manipulation and unsafe HTML bindings.
- Use Angular Http Interceptors for attaching tokens to API requests.
- Prefer sessionStorage over localStorage for ephemeral tokens.
- Keep dependencies updated and enable strict template checking.

## Decision & Justification

**Chosen Approach:**

- Store the authentication token in `sessionStorage` after login using a dedicated Angular service.
- Use an Angular Http Interceptor to automatically attach the token from sessionStorage to all outgoing API requests.
- Clear the token from sessionStorage on logout.
- Write unit tests for token storage, retrieval, attachment, and clearing.

**Why?**

- This approach is the most secure and practical option available without backend changes.
- It minimizes token persistence, reducing risk if a device is left unattended.
- It leverages Angular's best practices for security and maintainability.
- HttpOnly cookies would be preferable for maximum security, but are not possible without backend modifications.

## References

- [OWASP: Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [Angular Security Best Practices](https://angular.io/guide/security)
- [MDN: HttpOnly Cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#restrict_access_to_cookies)
