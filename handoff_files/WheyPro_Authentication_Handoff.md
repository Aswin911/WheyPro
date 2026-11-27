# WheyPro Authentication --- Handoff

**Date:** 26 November 2026\
**Repository:** https://github.com/Aswin911/WheyPro

## Project status

Continue the WheyPro authentication frontend, integrated with the
existing Fastify + MongoDB backend. Work incrementally: implement one
stage, build, test, then continue.

## Backend --- completed and tested

Implemented endpoints: - `POST /api/auth/register` -
`POST /api/auth/login` - `GET /api/auth/me` - `POST /api/auth/refresh` -
`POST /api/auth/logout`

Key behavior: - Registration creates a user but does not log them in. -
Login creates a session and sets `wheypro_refresh` (HttpOnly) and
`wheypro_csrf` (JavaScript-readable) cookies. - Access JWT expires after
10 minutes. - Refresh tokens rotate; reuse detection revokes the
session. - Refresh and logout require origin and CSRF verification. -
`/me` requires a Bearer access token. - The user reported that backend
tests and cookie checks passed.

Relevant backend files: - `server/src/modules/auth/auth.routes.js` -
`server/src/modules/auth/auth.schema.js` -
`server/src/modules/auth/auth.controller.js` -
`server/src/modules/auth/auth.middleware.js` -
`server/src/modules/auth/auth.service.js` - `server/src/app.js` -
`server/src/config/env.js`

## Frontend setup

Frontend environment variable (`client/.env`):

``` env
VITE_API_URL=http://localhost:5000/api
```

`client/src/lib/api.js` contains the shared Axios client with
`withCredentials: true`.

`client/src/services/authService.js` contains: -
`registerUser(userData)` - `loginUser(credentials)` -
`getCurrentUser(accessToken)` - `refreshSession()` - `logoutUser()`

The refresh helper sends the CSRF cookie value in the `X-CSRF-Token`
header and prevents concurrent refresh calls using a shared promise.

## Authentication state

`client/src/context/AuthContext.jsx` manages: - `user` - `accessToken` -
`status` (`loading`, `authenticated`, `unauthenticated`) -
`login(data)` - `logout()`

On initial load, it attempts to restore the session through the refresh
endpoint. If logout errors occur, check that `logoutUser` is imported
correctly.

## Pages completed

### Register --- `client/src/pages/Register.jsx`

-   Username, email, password, confirm-password fields.
-   Client-side validation aligned with backend constraints.
-   Displays API errors.
-   Successful registration redirects to `/login`.
-   Does not automatically log the user in.
-   User confirmed registration works and the user appears in MongoDB
    Compass.

### Login --- `client/src/pages/Login.jsx`

-   Email and password fields with visibility toggle.
-   Loading and error states.
-   On success, updates AuthContext and navigates to `/`.
-   User confirmed login works.

## Navbar --- `client/src/components/layout/Navbar.jsx`

-   Logged-out state shows Login and Get Started.
-   Logged-in state shows user controls and Logout.
-   Logout calls AuthContext and navigates to `/login`.

**Latest requested adjustment:** Keep the user icon but remove the
username text (e.g. `test1user`) beside it. The screenshot showed the
icon, username, and Logout button. Keep the `UserRound` import and icon;
remove only the username element. Preserve Logout.

Example of the intended icon-only element:

``` jsx
<div className="flex items-center justify-center">
  <UserRound size={20} />
</div>
```

## Routing / route guards --- status to verify

The previous step proposed: -
`client/src/components/auth/ProtectedRoute.jsx` -
`client/src/components/auth/GuestRoute.jsx`

Expected behavior: - Protected routes show a loading state while auth
status is `loading`. - Unauthenticated users visiting protected routes
are redirected to `/login`. - Authenticated users visiting `/login` or
`/register` are redirected to `/`.

The proposed `App.jsx` wraps routes in `AuthProvider`, uses `GuestRoute`
for login/register, and reserves `ProtectedRoute` for future private
pages.

**Do not assume this is complete:** the user had not confirmed applying
and testing the route-guard step. Inspect the current local files first.

## Design direction

-   Off-white: `#F7F7F4`
-   Charcoal: `#151715`
-   Electric lime: `#C7F36B`
-   Geist-style typography
-   Premium fitness/nutrition aesthetic
-   Subtle motion, not excessive animation

Landing page sections: Navbar, Hero, Features, Featured Products, Brand
Story, Final CTA, Footer. Empty placeholder sections that caused a large
vertical gap were previously removed.

## Recommended next steps

1.  Complete the navbar change: show the user icon without the username;
    keep Logout.

2.  Run the frontend build:

    ``` powershell
    cd client
    npm run build
    ```

3.  Inspect `App.jsx` and route-guard files; implement or fix them if
    needed.

4.  Test:

    -   Logged-out users can access `/login` and `/register`.
    -   Registration redirects to login.
    -   Login updates the navbar.
    -   Refreshing the page restores the session.
    -   Logged-in users are redirected away from login/register.
    -   Logout clears the session and returns to logged-out state.
    -   Unauthenticated access to a protected page redirects to login.

5.  After these checks, continue with the next authenticated
    page/account functionality.

## Instructions for the next chat

-   Continue from the user's current local project state; do not
    recreate completed work.
-   Ask for relevant file contents only when needed.
-   Provide complete file replacements when targeted edits are hard to
    locate.
-   Use PowerShell commands for Windows.
-   Never claim a build or test passed unless it was actually run.
-   Keep steps incremental and avoid unnecessary cosmetic
    micro-adjustments.
