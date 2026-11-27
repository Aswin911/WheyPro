# WheyPro Authentication --- Frontend Handoff

**Handoff date:** 26 November 2026\
**Project:** WheyPro\
**Repository:** https://github.com/Aswin911/WheyPro\
**Local project path:** `D:\Grind\WheyPro`

## 1. Project overview

WheyPro is a React + Vite frontend with a Node.js + Fastify backend and
MongoDB. The current work completed a backend authentication system. The
next chat should continue with **React frontend integration**, not
rebuild the backend from scratch.

The user prefers a teaching-oriented workflow: - Explain the concept
before or alongside implementation. - Work in small, testable steps. -
Give exact file paths and code changes. - Test each step before moving
on. - Be direct and point out weak or unsafe approaches. - Do not skip
ahead when a step has not been verified.

## 2. Technology stack

### Backend

-   Node.js, ES modules
-   Fastify 5
-   MongoDB via `@fastify/mongodb`
-   Zod validation
-   Argon2id password hashing
-   `@fastify/jwt`
-   `@fastify/cookie`
-   `@fastify/cors`
-   `@fastify/helmet`
-   `@fastify/rate-limit`

### Frontend

-   React 19
-   Vite
-   Tailwind CSS 4
-   Axios (already installed)
-   React Router (already installed)

## 3. Local development configuration

-   Backend base URL: `http://localhost:5000`
-   API prefix: `/api`
-   Auth prefix: `/api/auth`
-   Frontend URL: `http://localhost:5173`
-   MongoDB URI: `mongodb://127.0.0.1:27017/WheyPro`

The actual `server/.env` contains secrets and must never be copied into
chat, committed, or included in handoff files. `server/.env.example`
contains placeholders only.

Required environment variables: - `NODE_ENV` - `PORT` - `MONGODB_URI` -
`FRONTEND_URL` - `JWT_ACCESS_SECRET` (at least 64 characters) -
`CSRF_SECRET` (at least 64 characters; separate from JWT secret)

`server/.gitignore` correctly ignores `.env`, `.env.*`, and
`node_modules`, while allowing `.env.example`.

## 4. Backend implementation completed

### Registration

-   `POST /api/auth/register`
-   Validates request with Zod.
-   Username and email are normalized.
-   Password minimum is 15 characters, maximum 128.
-   Confirm password must match.
-   Password stored as Argon2id hash, not plaintext.
-   Default role is `customer`.
-   Duplicate account conflicts return HTTP 409.
-   Origin validation is applied.

### Login

-   `POST /api/auth/login`
-   Validates credentials.
-   Creates a MongoDB session.
-   Issues a short-lived access JWT (10 minutes).
-   Sets `wheypro_refresh` as an HttpOnly cookie.
-   Sets `wheypro_csrf` as a JavaScript-readable cookie.
-   Origin validation is applied.

### Access-token authentication

-   `GET /api/auth/me`
-   Uses `authenticate` middleware.
-   Verifies JWT signature, issuer, audience and expiry.
-   Checks the referenced MongoDB session is active and unexpired.
-   Checks user is active.
-   Attaches safe user data to `request.authUser`.

### Refresh tokens

-   `POST /api/auth/refresh`
-   Refresh token is a random 32-byte base64url value.
-   Only its SHA-256 hash is stored in MongoDB.
-   Refresh rotation replaces the current hash and records the old hash
    in `usedRefreshTokenHashes`.
-   Reuse of an already-used refresh token revokes the session.
-   Successful refresh returns a new access JWT and rotates both refresh
    and CSRF cookies.

### Logout

-   `POST /api/auth/logout`
-   Revokes the session using the refresh token hash.
-   Clears both `wheypro_refresh` and `wheypro_csrf` cookies.

### RBAC

-   `authorize(...allowedRoles)` middleware exists.
-   Temporary `/admin-check` test route was removed during backend
    cleanup.
-   Keep the middleware for future real admin routes.

### Origin validation

-   `verifyOrigin` checks the request `Origin` against `FRONTEND_URL`.
-   Rejects missing Origin with 403.
-   Rejects unauthorized Origin with 403.
-   Applied to registration, login, refresh and logout.

### CSRF protection

-   `auth.csrf.js` contains:
    -   `generateCsrfToken(sessionId)`
    -   `safeTokenEqual(tokenA, tokenB)`
    -   `verifyCsrfToken(token, sessionId)`
-   CSRF token is a random nonce plus HMAC-SHA256 signature bound to the
    session ID.
-   `verifyCsrf` middleware:
    -   Requires refresh cookie, CSRF cookie and `X-CSRF-Token` header.
    -   Checks CSRF cookie matches header.
    -   Finds active session using hash of refresh cookie.
    -   Verifies CSRF signature against session ID.
-   `verifyCsrf` is attached to `/refresh` and `/logout`, after
    `verifyOrigin`.
-   CSRF cookie is readable by JS (`httpOnly: false`); refresh cookie is
    HttpOnly.
-   Both cookies use `SameSite=Lax`.
-   Refresh cookie path is `/api/auth`; CSRF cookie path is `/`.

## 5. Backend tests already performed

The user has manually tested with Postman and MongoDB Compass: -
Registration succeeds with valid Origin. - Registration rejects
unauthorized Origin and missing Origin with 403. - Login succeeds and
issues both cookies. - `/me` succeeds with valid access token and
rejects missing/invalid token. - Refresh succeeds with valid cookies and
valid CSRF header. - Refresh rejects missing and incorrect CSRF header
with 403. - Refresh rejects unauthorized Origin with 403. - Refresh
token rotates on successful refresh. - Refresh-token replay detection
was tested; replay revoked the session. - Logout rejects missing and
incorrect CSRF token with 403. - Logout succeeds with valid Origin,
cookies and CSRF header. - Logout revokes session in MongoDB and clears
cookies. - RBAC behavior was tested earlier: allowed admin succeeds;
customer and superadmin were denied when only `admin` was allowed.

The user reports that the final cleanup was completed and pushed to
GitHub. Cleanup included removing the unused dotenv import from auth
routes, removing temporary `/admin-check`, restoring registration rate
limit to 5, checking `.env` ignore behavior, and restarting the backend.

## 6. Important security/implementation notes for frontend work

1.  **Do not expose the refresh token to JavaScript.** It must remain in
    the HttpOnly cookie.
2.  Frontend requests that need cookies must use Axios
    `withCredentials: true`.
3.  Frontend must read the `wheypro_csrf` cookie and attach its value in
    the `X-CSRF-Token` header for `/refresh` and `/logout`.
4.  The access JWT is currently returned in the login/refresh JSON
    response. For the first implementation, keep it in React memory
    (e.g. AuthContext state), not localStorage/sessionStorage. A page
    reload will require a refresh request to obtain a new access token.
5.  The frontend and backend are different origins due to different
    ports, but `localhost:5173` and `localhost:5000` are same-site for
    cookie SameSite purposes. CORS still needs credentials enabled and
    the exact frontend origin.
6.  Postman tests prove backend behavior, but browser behavior must be
    tested in the actual React app.
7.  The signed double-submit CSRF implementation issues a new token on
    refresh, but previous CSRF tokens for the same active session remain
    cryptographically valid until session end because the backend does
    not store a CSRF nonce/version. Do not claim that refreshing
    invalidates every previously issued CSRF token. This is a known
    design limitation to revisit in a later hardening review.
8.  Current origin middleware strictly rejects requests without an
    Origin header. This is intentional for the browser SPA flow but
    means non-browser API clients need a deliberate policy if supported
    later.

## 7. Current frontend repository state

The frontend is still the default Vite starter UI.

Inspected files: - `client/src/App.jsx` --- default Vite counter page. -
`client/src/main.jsx` --- renders `<App />`. - `client/src/index.css`
--- default Vite styles. - `client/vite.config.js` --- basic React
plugin config. - `client/package.json` --- React, Vite, Tailwind 4,
Axios and React Router are already installed.

**Important:** The Axios client file has NOT yet been created. No
frontend authentication integration has been implemented yet.

## 8. Exact next task: start frontend integration

The previous chat began Step 1 but did not implement it yet.

### Step 1 --- Create Axios client

Create:

`client/src/api/axios.js`

Suggested initial implementation:

``` js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

export default api;
```

Start the frontend with:

``` powershell
cd D:\Grind\WheyPro\client
npm run dev
```

Confirm the Vite app still loads.

### Step 2 --- CSRF cookie helper and Axios interceptors

Next, create a small helper to read `wheypro_csrf` from
`document.cookie` and attach it as `X-CSRF-Token` to state-changing auth
calls that require it (at minimum `/refresh` and `/logout`). Do not
attach the refresh cookie manually; the browser manages it.

Design carefully so that: - `withCredentials: true` remains enabled. -
CSRF header uses the current cookie value at request time. - No CSRF
header is required for public registration/login. - Avoid accidentally
attaching stale tokens after a successful refresh; the browser processes
Set-Cookie responses before subsequent requests. - Handle refresh
concurrency and prevent infinite refresh loops in later response
interceptor work.

### Step 3 --- AuthContext and token lifecycle

-   Store access token in memory (React context/state).
-   On app startup, call `/auth/refresh` with cookies and CSRF header to
    restore the session.
-   On successful refresh, set access token and user state.
-   Provide login, register and logout methods.
-   Handle 401 responses without creating refresh loops.
-   Consider a single-flight refresh mechanism so multiple simultaneous
    401s do not trigger multiple refresh rotations.

### Step 4 --- UI and routing

-   Build registration and login pages.
-   Use React Router for routes.
-   Add protected routes.
-   Add a logged-in profile/dashboard view.
-   Add logout.
-   Later add real admin routes when needed.

### Step 5 --- Browser end-to-end tests

Test in browser: - Register. - Login. - Reload page and restore session
through refresh. - Access protected page. - Wait for/force access token
expiry and verify refresh behavior. - Logout. - Confirm protected page
becomes inaccessible. - Check browser DevTools Network and
Application/Cookies tabs. - Confirm refresh token is HttpOnly and CSRF
cookie is readable. - Confirm credentials and CSRF header are included
correctly.

## 9. How to continue in the new chat

Start the new chat by attaching this handoff file or pasting its
contents, then say:

> Continue WheyPro from this handoff. We have completed and pushed the
> backend authentication system. Start with frontend Step 1: create and
> test the Axios API client. Teach me step by step, don't skip ahead,
> and verify each step before moving on.

Do not redo the backend implementation unless a concrete issue is
discovered during frontend integration.
