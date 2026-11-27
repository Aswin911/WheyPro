# WheyPro Authentication --- Development Handoff

**Handoff date:** 25 November 2026\
**Project:** WheyPro --- gym supplement ecommerce landing page\
**Working directory:** `D:\Grind\WheyPro`\
**Environment:** Windows, PowerShell, VS Code\
**Backend:** Node.js + Fastify + MongoDB\
**Frontend:** React + Vite + Tailwind CSS

------------------------------------------------------------------------

## 1. Project goal

Build a simple WheyPro landing page with a robust, testable
authentication system. The current priority is backend authentication
and authorization, not cart, checkout, or a large multi-page ecommerce
experience.

The user wants to understand the concepts and implementation, not just
copy code. Work in small phases, test each phase, and do not move
forward while the current phase is broken.

## 2. Stack and environment

-   Node.js currently reported as `v25.9.0`.
-   MongoDB Server `8.0.13`, running as a Windows service.
-   MongoDB Compass and `mongosh` available.
-   MongoDB URI: `mongodb://127.0.0.1:27017/WheyPro`
-   Database: `WheyPro`
-   Backend port: `5000`
-   Frontend expected at `http://localhost:5173`
-   Backend package is ESM (`"type": "module"`).
-   Development command: `node --watch src/server.js`

### Backend dependencies in use

Fastify, `@fastify/jwt`, `@fastify/cookie`, `@fastify/cors`,
`@fastify/helmet`, `@fastify/rate-limit`, `@fastify/mongodb`, `argon2`,
`zod`, and `dotenv`.

## 3. Backend structure

Current intended structure:

``` text
server/
├── src/
│   ├── config/
│   │   ├── env.js
│   │   └── indexes.js
│   ├── plugins/
│   │   └── database.js
│   ├── routes/
│   │   └── health.routes.js
│   ├── modules/
│   │   └── auth/
│   │       ├── auth.routes.js
│   │       ├── auth.controller.js
│   │       ├── auth.service.js
│   │       ├── auth.schema.js
│   │       └── auth.middleware.js
│   ├── app.js
│   └── server.js
├── tests/
├── .env
├── .env.example
├── .gitignore
└── package.json
```

Some files may have additional content or slightly different structure.
Inspect the actual working tree before making changes.

## 4. Environment configuration

`server/.env` contains:

``` env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/WheyPro
FRONTEND_URL=http://localhost:5173
JWT_ACCESS_SECRET=<private-generated-secret>
```

The JWT secret was generated using Node crypto with 64 random bytes,
represented as 128 hexadecimal characters. It is private and must never
be committed or shared.

The environment schema in `src/config/env.js` includes:

``` javascript
JWT_ACCESS_SECRET: z.string().min(64)
```

`.gitignore` should exclude `.env` and other secret-bearing environment
files while allowing `.env.example`.

## 5. Database and indexes

MongoDB is running locally. The backend has successfully connected to
the `WheyPro` database.

The `createIndexes()` function should define:

-   `users.email` --- unique index
-   `users.username` --- unique index
-   `sessions.refreshTokenHash` --- unique index
-   `sessions.userId` --- regular index
-   `sessions.expiresAt` --- TTL index (`expireAfterSeconds: 0`)

**Important collection-name detail:** There was confusion between
`session` and `sessions`. The intended and current backend collection is
`sessions` (plural). A separate singular `session` collection appeared
in Compass during debugging. Do not assume it is still used. Inspect the
code and database before deleting or migrating anything.

The TTL index is cleanup only. Authorization must explicitly check
`expiresAt`; TTL deletion is asynchronous.

## 6. Authentication features implemented so far

### A. Registration

Implemented and tested through Postman.

-   Zod validation for username, email, password, and confirmation.
-   Username/email normalization to lowercase.
-   Password minimum length and maximum length validation.
-   Password hashing using Argon2id.
-   User role defaults to `customer`.
-   Unique email and username indexes.
-   Duplicate account conflicts return `409`.
-   Password hash is not returned in API responses.
-   Tests previously passed for valid registration, duplicate email,
    invalid email, weak password, password mismatch, and attempted role
    self-assignment.

User documents include fields similar to:

``` javascript
{
  username,
  email,
  passwordHash,
  role: "customer",
  isActive: true,
  createdAt,
  updatedAt
}
```

### B. Login

Implemented and tested successfully.

-   Validates login payload with Zod.
-   Finds user by normalized email.
-   Checks `isActive`.
-   Verifies password using `argon2.verify`.
-   Returns generic `401` for invalid email/password.
-   Creates a session in MongoDB.
-   Issues a signed JWT access token.
-   Sets an HttpOnly refresh-token cookie.

Observed successful response: `200 OK`, with `success`, `message`,
`accessToken`, and safe user details.

### C. Refresh-token cookie and session storage

The refresh cookie name is:

``` text
wheypro_refresh
```

Cookie settings currently used:

-   `httpOnly: true`
-   `secure: env.NODE_ENV === "production"`
-   `sameSite: "lax"`
-   `path: "/api/auth"`
-   `maxAge: 7 * 24 * 60 * 60`

The refresh token is generated using cryptographically secure random
bytes and stored in MongoDB only as a SHA-256 hash.

Session document shape:

``` javascript
{
  userId,
  refreshTokenHash,
  usedRefreshTokenHashes: [],
  createdAt,
  expiresAt,
  revokedAt: null
}
```

The `usedRefreshTokenHashes` field was added for refresh-token replay
detection. Confirm that `createSession()` initializes it to an empty
array.

### D. Access JWT

Current intended settings:

-   Algorithm: HS256
-   Expiry: 10 minutes
-   Issuer: `wheypro-api`
-   Audience: `wheypro-client`
-   JWT payload includes:
    -   `sub`: user ID
    -   `sid`: session ID

Never put passwords, password hashes, or refresh tokens inside the JWT.

### E. Authentication middleware

File:

``` text
src/modules/auth/auth.middleware.js
```

Intended behavior:

1.  Call `request.jwtVerify()`.
2.  Validate `sub` and `sid` as MongoDB ObjectIds.
3.  Look up the matching session in `sessions`.
4.  Require `revokedAt: null` and `expiresAt > now`.
5.  Look up the user and require `isActive: true`.
6.  Attach safe user details to `request.authUser`.
7.  Reject invalid/expired tokens or sessions with `401`.
8.  Return `503` if the database check itself fails.

Protected endpoint added:

``` http
GET /api/auth/me
```

It uses the middleware as a `preHandler` and returns the authenticated
user's safe details.

### F. Refresh-token rotation

A first implementation was provided and is expected to be in the code,
but the user has not yet supplied final test results. Verify the actual
code and test behavior before assuming it is complete.

Intended logic:

-   Read `wheypro_refresh` cookie.
-   Hash it with SHA-256.
-   Find an unrevoked, unexpired session whose current
    `refreshTokenHash` matches.
-   Check that the user is active.
-   Generate a new refresh token and hash.
-   Atomically update the session using a conditional update that still
    matches the old hash.
-   Move the old hash into `usedRefreshTokenHashes`.
-   Issue a new access JWT and set the new refresh cookie.
-   If a previously used hash is presented again, revoke the associated
    session.

Endpoint:

``` http
POST /api/auth/refresh
```

No JSON body is required; cookie is used.

**Testing still required:** successful refresh, new cookie/hash,
old-token replay detection, and confirmation that replay revokes the
session. Be aware that the initial replay-detection approach has
concurrency and operational tradeoffs; review carefully before
production.

### G. Logout

A first implementation was provided, but the user has not yet confirmed
all logout tests. Verify actual code and test results.

Intended behavior:

-   Read refresh cookie.
-   Hash it.
-   Mark the matching active session as revoked.
-   Clear the cookie using the same path (`/api/auth`).
-   Return success even if the cookie is already absent or the session
    is already revoked.

Endpoint:

``` http
POST /api/auth/logout
```

No JSON body is required.

Required tests: - Login, then logout returns `200`. - Session has
`revokedAt` set. - Cookie is cleared. - Previously issued access token
is rejected by `/api/auth/me`.

## 7. Recent debugging history

-   Backend initially failed because `JWT_ACCESS_SECRET` was missing
    from `.env`. This was fixed; dotenv now reports five environment
    values injected.

-   MongoDB database was initially pointed at `fitfuel`; it was
    corrected to `WheyPro`.

-   A startup error `sessions is not defined` in `indexes.js` was fixed
    by declaring:

    ``` javascript
    const sessions = db.collection("sessions");
    ```

-   There was a singular/plural collection mismatch (`session` vs
    `sessions`). The backend should use `sessions` consistently.

-   MongoDB local service is running. A local warning about access
    control being disabled was observed. This is acceptable only for
    isolated local development bound to localhost; production MongoDB
    must use authentication and appropriate network security.

## 8. What to do first when continuing

Before adding new features tomorrow:

1.  Pull/open the latest committed code and inspect `git status`.

2.  Confirm `.env` is not staged or committed:

    ``` powershell
    git status
    git check-ignore -v server/.env
    ```

3.  Confirm `.env.example` contains placeholders only, never the actual
    JWT secret.

4.  Start MongoDB service if it is not running.

5.  Start backend:

    ``` powershell
    cd D:\Grind\WheyPro\server
    npm run dev
    ```

6.  Confirm startup is clean and `/api/health` returns success.

7.  Review the actual `auth.service.js`, `auth.controller.js`,
    `auth.routes.js`, and `auth.middleware.js` before proceeding.

8.  Run Postman tests for login, `/me`, refresh rotation, replay
    detection, and logout. Do not assume refresh/logout are complete
    until tested.

## 9. Next development phases

Recommended order:

1.  **Finish and verify current authentication flow**
    -   Login
    -   Protected `/me`
    -   Refresh rotation
    -   Replay detection
    -   Logout
2.  **Role-based authorization**
    -   `authorize("admin")` / role guard
    -   Test customer vs admin access
    -   Never trust a role supplied by the client
3.  **Security hardening**
    -   CSRF and Origin protections for cookie-authenticated endpoints
    -   Correct cookie settings for actual deployment topology
    -   Login timing/user-enumeration considerations
    -   Rate-limit strategy
    -   Error handling and security logging
    -   MongoDB authentication and least privilege
4.  **Automated backend tests**
    -   Fastify `inject()`
    -   MongoDB test database or `mongodb-memory-server`
    -   Registration/login/middleware/refresh/logout tests
5.  **Frontend integration**
    -   React auth state
    -   Access token held in memory
    -   Axios request interceptor
    -   Single-flight refresh handling to prevent concurrent refresh
        races
    -   Protected React routes
    -   Login/register UI

## 10. Important design cautions

-   Do not claim any authentication system is "100% secure."
-   CORS is not CSRF protection.
-   HttpOnly prevents JavaScript from reading the cookie; it does not by
    itself prevent CSRF.
-   The access JWT is currently returned in the response body. The
    frontend should keep it in memory rather than localStorage.
-   Refresh-token rotation must be atomic.
-   A revoked session must be checked on every protected request if
    immediate access-token invalidation is required.
-   Do not delete old MongoDB collections until code references and data
    ownership are confirmed.
-   Do not share access tokens, refresh tokens, passwords, or `.env`
    contents in screenshots or chat.

------------------------------------------------------------------------

## 11. Current checkpoint

**Last known state:** Backend registration and login work; login returns
an access JWT and sets the refresh cookie. Session documents have been
observed in the `WheyPro.sessions` collection with a hashed refresh
token. Authentication middleware and `/api/auth/me` were added in the
current learning phase. Refresh rotation and logout code were then
introduced, but their final end-to-end test results are not yet
confirmed.

**Next session starting point:** Verify the actual committed code and
finish the refresh/logout tests before implementing role-based
authorization.
