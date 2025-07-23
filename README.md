# 🚀 SFE Tech Task – Solution by Ahmed Hassanein

> **Note:** I assumed no changes were allowed to the backend, so all improvements are frontend-only—except for one critical bug fix.

All requirements and best practices from `@task_details.md` and `@coding_rules.md` were carefully followed. Here’s what I did:

---

## 🏆 What’s New?

- 🔐 **Authentication:**
  - Login works, tokens are stored safely.
  - All user routes are protected. Unauthorized users are redirected instantly.
- 👥 **User Management:**
  - Create and edit users with full validation (including the infamous 'no test in name' rule).
  - Loading spinners and error messages for a smooth experience.
  - Only admins can edit admins. No more power grabs!
- 🧪 **Unit Tests:**
  - Yes, I wrote them. Yes, they pass.
- 💅 **UI/UX Polish:**
  - Material Design everywhere. Spacing, buttons, and forms are consistent.
  - Responsive and accessible.
- 🐛 **Bug Fixes:**
  - Subtle bugs squashed. If you find any more, they’re probably features.

---

## 🛠️ How to Run

1. `cd backend && npm install && npm start` (backend on :3000)
2. `cd .. && npm install && npm start` (frontend on :4200)

---

## 🤓 Pro Tips

- Login with the credentials in `backend/db.js`
- Want to see the original README? Check out `README_ORIGINAL.md`.

---

Thanks for reviewing! May your builds be green and your bugs be tiny.

---

_P.S. My background is mostly in React (hooks, context, the whole shebang), but I jumped into Angular for this project—and had a blast learning the latest best practices along the way!_
