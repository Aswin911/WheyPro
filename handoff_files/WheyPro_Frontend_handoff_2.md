# WheyPro --- Detailed Engineering Handoff

**Project:** WheyPro\
**Repository:** `https://github.com/Aswin911/WheyPro`\
**Branch:** `main`\
**Working tree at handoff:** Clean\
**Current task:** Improve the dark-mode appearance of the landing page,
specifically the Features and Featured Products sections, after
completing the authentication/lint/build cleanup.

------------------------------------------------------------------------

## 1. Project Overview

WheyPro is a React + Vite frontend with a Fastify + MongoDB backend.

### Frontend stack

-   React 19
-   Vite 8.3.8
-   Tailwind CSS 4
-   shadcn/ui + Base UI
-   React Router 7
-   Axios
-   Motion
-   Lucide React
-   Geist Variable font

### Backend stack

-   Fastify 5
-   MongoDB
-   Argon2id password hashing
-   JWT access tokens
-   HttpOnly refresh-token cookies
-   Refresh-token rotation and reuse detection
-   CSRF protection
-   Origin validation
-   Session validation

------------------------------------------------------------------------

# 2. Repository Structure

Relevant frontend structure:

``` text
client/
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── GuestRoute.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── landing/
│   │   │   ├── Hero.jsx
│   │   │   ├── Features.jsx
│   │   │   ├── FeaturedProducts.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   ├── BrandStory.jsx
│   │   │   └── FinalCTA.jsx
│   │   └── layout/
│   │       ├── Navbar.jsx
│   │       └── Footer.jsx
│   ├── context/
│   │   ├── AuthContext.js
│   │   ├── AuthProvider.jsx
│   │   └── useAuth.js
│   ├── data/
│   │   └── products.js
│   ├── lib/
│   │   └── api.js
│   ├── pages/
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   ├── services/
│   │   └── authService.js
│   ├── App.jsx
│   └── index.css
```

Backend authentication lives under the server portion of the repository.

------------------------------------------------------------------------

# 3. Current Git / Repository State

Before starting the current dark-mode work:

``` text
On branch main
Your branch is up to date with 'origin/main'.

nothing to commit, working tree clean
```

`git diff` was also empty.

Therefore the dark-mode work described below is the **next uncommitted
change set** and should not be mixed with the already completed
authentication/lint cleanup.

------------------------------------------------------------------------

# 4. Completed Work

## 4.1 Authentication architecture

Authentication was refactored into a clearer separation of
responsibilities.

Current structure:

``` text
context/
├── AuthContext.js
├── AuthProvider.jsx
└── useAuth.js
```

### AuthContext.js

Owns the context object:

``` js
import { createContext } from "react";

export const AuthContext = createContext(null);
```

### AuthProvider.jsx

Owns authentication state and session restoration:

-   `user`
-   `accessToken`
-   `status`
-   `login()`
-   `logout()`

Session restoration happens when the provider mounts through
`refreshSession()`.

The access token is kept in React memory rather than localStorage.

### useAuth.js

Provides the custom hook:

``` js
import { useContext } from "react";
import { AuthContext } from "./AuthContext";

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
```

This prevents components from depending directly on the context
implementation.

------------------------------------------------------------------------

# 5. Backend Authentication Security

The authentication flow currently includes:

### Registration

``` text
POST /api/auth/register
```

### Login

``` text
POST /api/auth/login
```

### Current user

``` text
GET /api/auth/me
```

### Refresh

``` text
POST /api/auth/refresh
```

### Logout

``` text
POST /api/auth/logout
```

Security mechanisms already implemented:

-   Argon2id password hashing
-   Short-lived access tokens
-   HttpOnly refresh-token cookies
-   SHA-256 storage of refresh tokens
-   Refresh-token rotation
-   Refresh-token reuse detection
-   CSRF token validation
-   Origin validation
-   Session validation
-   Access token held in memory on the frontend

Do not weaken this architecture by moving access tokens into
localStorage just for convenience.

------------------------------------------------------------------------

# 6. Navbar / Theme System

The Navbar currently owns the theme toggle.

Theme state is persisted using:

``` text
wheypro-theme
```

The root HTML element receives:

``` text
.dark
```

when dark mode is selected.

The Navbar imports:

``` js
useAuth
```

from:

``` text
@/context/useAuth
```

Theme switching is therefore currently functional.

------------------------------------------------------------------------

# 7. Theme Design System

The project already has a semantic theme system in:

``` text
client/src/index.css
```

The important light-mode variables are:

``` css
--background: #f7f7f4;
--foreground: #151515;

--card: #ffffff;
--card-foreground: #151515;

--secondary: #edede8;
--muted: #edede8;
--muted-foreground: #777a72;

--accent: #eaf5d8;

--border: #e5e5df;
--input: #deded6;
--ring: #a8d64e;
```

Dark mode defines:

``` css
.dark {
  --background: #151715;
  --foreground: #f7f7f4;

  --card: #20231f;
  --card-foreground: #f7f7f4;

  --secondary: #292d27;
  --secondary-foreground: #f7f7f4;

  --muted: #292d27;
  --muted-foreground: #a0a49b;

  --accent: #292d27;
  --accent-foreground: #f7f7f4;

  --border: #353a32;
  --input: #353a32;
  --ring: #c7f36b;
}
```

The important engineering principle is:

> Components should consume semantic theme tokens instead of hard-coded
> UI colors whenever the color represents a UI surface, text, border, or
> state.

Examples:

``` text
bg-background
bg-card
bg-secondary
text-foreground
text-muted-foreground
border-border
bg-primary
text-primary-foreground
```

Avoid introducing a second dark-theme color system.

------------------------------------------------------------------------

# 8. Landing Page Dark-Mode Problem

The current screenshot shows that dark mode works for the overall page
but the following sections still visually behave like light-mode
sections:

1.  Features
2.  Featured Products

The primary cause is hard-coded light colors inside those components.

This is not a failure of the theme system itself.

It is a component-level theming problem.

------------------------------------------------------------------------

# 9. Features.jsx --- Current Problem

Current feature section uses:

``` jsx
<section className="bg-background px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
```

This is correct.

The feature cards, however, currently use:

``` jsx
bg-[#F0F0EB]
```

The icon container uses:

``` jsx
bg-[#DFF0BE]
```

The icon itself uses:

``` jsx
text-[#536F29]
```

These are hard-coded light-theme colors.

The heading already correctly uses:

``` jsx
text-foreground
```

The description already correctly uses:

``` jsx
text-muted-foreground
```

Therefore only the surfaces and icon treatment need to be changed.

------------------------------------------------------------------------

# 10. Recommended Features Dark-Mode Changes

Change the feature card from the hard-coded light background to the
semantic card surface.

Recommended:

``` jsx
className="group relative flex min-h-[300px] flex-col justify-between overflow-hidden rounded-[1.75rem] border border-border bg-card p-7 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-black/10 dark:hover:shadow-black/30 sm:p-9"
```

Change the icon container to use the brand color with transparency:

``` jsx
className="flex size-14 items-center justify-center rounded-2xl bg-primary/15 transition-all duration-300 group-hover:rotate-6 group-hover:bg-primary/25"
```

Change the icon color to:

``` jsx
text-primary
```

This produces a hierarchy like:

``` text
Page background
    ↓
Card surface
    ↓
Subtle green icon surface
    ↓
Green icon
    ↓
Primary heading
    ↓
Muted supporting text
```

This is preferable to adding separate `dark:` colors for every
individual text element.

------------------------------------------------------------------------

# 11. FeaturedProducts.jsx --- Current Problem

The product section currently uses:

``` jsx
className="scroll-mt-20 bg-[#F0F0EB] px-5 py-24 sm:px-8 lg:px-12 lg:py-32"
```

The light background is intentional for the light theme because it
creates visual separation.

It should remain in light mode.

For dark mode, the section should switch to the existing page
background.

Recommended:

``` jsx
className="scroll-mt-20 bg-[#F0F0EB] px-5 py-24 dark:bg-background sm:px-8 lg:px-12 lg:py-32"
```

This preserves the existing light design while making the dark version
consistent with the rest of the page.

------------------------------------------------------------------------

# 12. ProductCard.jsx --- Current Problem

The entire product card currently uses:

``` jsx
bg-white
```

This is the largest issue in the product section.

The card should consume the semantic card variable.

Recommended:

``` jsx
className="group overflow-hidden rounded-[1.75rem] border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-black/10 dark:hover:shadow-black/30"
```

This automatically maps to:

### Light

``` text
--card: #ffffff
```

### Dark

``` text
--card: #20231f
```

No duplicated dark color is required.

------------------------------------------------------------------------

# 13. Product Image Badges

The product image category badge currently uses:

``` text
bg-white/90
text-[#151515]
```

This works in light mode but creates a bright/light element against a
dark-themed card.

Recommended dark override:

``` jsx
dark:border-white/10
dark:bg-[#20231f]/90
dark:text-foreground
```

The same treatment should be applied to the product number badge.

This keeps the badge readable without turning it into a bright white
element.

------------------------------------------------------------------------

# 14. Product Flavor Badge

Current flavor badge:

``` text
bg-white/80
text-[#555]
```

Recommended:

``` jsx
dark:border-white/10
dark:bg-[#20231f]/85
dark:text-muted-foreground
```

This keeps the badge visually subordinate while preserving readability.

------------------------------------------------------------------------

# 15. Product Arrow Button

The circular arrow button uses:

``` jsx
style={{ backgroundColor: product.color }}
```

This should remain product-specific.

Do not replace product colors with generic theme colors.

The product color is part of the product-card visual identity.

The current icon:

``` jsx
text-[#151515]
```

is also acceptable because the button's product colors are intentionally
bright.

Do not over-engineer this area unless actual contrast problems appear
during visual testing.

------------------------------------------------------------------------

# 16. Product CTA

The bottom CTA in `FeaturedProducts.jsx` already uses semantic theme
classes:

``` jsx
border-foreground/15
hover:border-primary
hover:bg-primary
```

This is the desired pattern.

No change is required there.

------------------------------------------------------------------------

# 17. Why We Are Not Using `dark:` Everywhere

The goal is not to make every class conditional.

Instead:

### Use semantic variables for semantic UI roles

``` text
background → bg-background
card → bg-card
secondary → bg-secondary
main text → text-foreground
muted text → text-muted-foreground
border → border-border
brand → bg-primary / text-primary
```

### Use `dark:` only when the actual visual design intentionally differs

For example:

``` text
Light product section → warm cream
Dark product section → page background
```

That is a legitimate design decision.

This approach keeps the component system maintainable and prevents a
large collection of unrelated hard-coded dark colors.

------------------------------------------------------------------------

# 18. Files Currently Being Modified

The immediate dark-mode work should be limited to:

``` text
client/src/components/landing/Features.jsx
client/src/components/landing/FeaturedProducts.jsx
client/src/components/landing/ProductCard.jsx
```

Do not modify the authentication architecture as part of this task.

Do not redesign the entire theme system.

Do not introduce a new CSS framework or component library.

------------------------------------------------------------------------

# 19. Verification Procedure

After implementing the dark-mode changes:

``` bash
npm run lint
```

Expected:

``` text
0 errors
0 warnings
```

Then:

``` bash
npm run build
```

Expected:

``` text
✓ built successfully
```

The current known build warning is:

``` text
Some chunks are larger than 500 kB after minification.
```

This is a performance optimization item, not a build failure.

------------------------------------------------------------------------

# 20. Visual QA Checklist

Test the landing page in both themes.

## Light mode

Verify:

-   Features section still has its warm light card appearance.
-   Product section retains the intended cream background.
-   Product cards remain white.
-   Product image badges remain readable.
-   Product CTA remains visually consistent.
-   No layout changes were introduced.

## Dark mode

Verify:

-   Features cards are dark charcoal rather than cream.
-   Feature headings are clearly readable.
-   Feature descriptions have sufficient contrast.
-   Feature icons have a subtle green glow/surface.
-   Product section blends into the dark page correctly.
-   Product cards are dark charcoal rather than white.
-   Product image badges are subtle rather than bright white.
-   Flavor badges remain readable.
-   Product names and descriptions have strong contrast.
-   Green brand accents remain prominent.
-   No white/light rectangles remain unintentionally.

------------------------------------------------------------------------

# 21. Important Current UI Observation

The screenshot shows that the existing dark theme has a good overall
direction:

``` text
Dark background
Green brand accent
Light typography
Subtle borders
```

The problem is consistency rather than the overall color palette.

Therefore the correct fix is:

``` text
Existing theme system
        +
Semantic component surfaces
        +
Small intentional dark overrides
```

not:

``` text
New dark color palette
+
Large component redesign
```

------------------------------------------------------------------------

# 22. Completed Code-Quality Cleanup

Several React/ESLint issues were already resolved before this handoff.

These include:

-   Moving nested React components out of render functions.
-   Removing unused React imports.
-   Resolving React Fast Refresh export issues.
-   Moving `badgeVariants` out of `badge.jsx`.
-   Moving `buttonVariants` out of `button.jsx`.
-   Splitting authentication context/provider/hook responsibilities.
-   Updating `useAuth` imports to use the dedicated hook module.

Current lint status before the dark-mode change:

``` text
PASS
0 errors
0 warnings
```

------------------------------------------------------------------------

# 23. Production Build Status

The latest successful build produced approximately:

``` text
CSS: 75.59 kB
CSS gzip: 13.12 kB

JS: 509.17 kB
JS gzip: 164.08 kB
```

Vite also reported:

``` text
Some chunks are larger than 500 kB after minification.
```

This should be addressed later through route-level code splitting/lazy
loading once the dashboard and additional application routes are
established.

It is not the immediate priority for the current dark-mode task.

------------------------------------------------------------------------

# 24. Known Architecture Improvements Still Pending

After the dark-mode work is verified, continue with these items in
order.

## Priority 1 --- Axios consolidation

There are currently two Axios-related implementations:

``` text
client/src/api/axios.js
client/src/lib/api.js
```

`authService.js` uses:

``` text
@/lib/api.js
```

The hard-coded client under `api/axios.js` appears redundant.

Before deleting anything:

1.  Search all imports.
2.  Confirm no component/service uses `api/axios.js`.
3.  Remove it only if unused.
4.  Keep `VITE_API_URL` configuration centralized.

Do not blindly delete the file.

------------------------------------------------------------------------

## Priority 2 --- Login redirect

The login page currently navigates to the home page after
authentication.

The protected route architecture already exists.

The next improvement should be to preserve the original destination:

``` text
Protected page requested
        ↓
Not authenticated
        ↓
/login
        ↓
Login success
        ↓
original protected destination
```

React Router's `location.state.from` should be used for this.

------------------------------------------------------------------------

## Priority 3 --- Complete protected dashboard

`App.jsx` currently contains an empty protected route area:

``` jsx
<Route element={<ProtectedRoute />}>
  {/* We'll add the user dashboard here */}
</Route>
```

The dashboard should be built before adding complex product purchasing
functionality.

Suggested sequence:

``` text
Dashboard shell
    ↓
Profile/session state
    ↓
Product browsing
    ↓
Product detail
    ↓
Cart
    ↓
Checkout
    ↓
Order history
```

Avoid building checkout before the authenticated customer experience is
stable.

------------------------------------------------------------------------

# 25. Important Security Rules for Future Work

Do not:

-   Store JWT access tokens in localStorage.
-   Expose refresh tokens to JavaScript.
-   Remove CSRF protection.
-   Disable origin validation.
-   Trust role values supplied directly by the browser.
-   Put secrets into frontend environment variables.
-   Duplicate authentication logic across components.
-   Create ad-hoc Axios instances without a clear reason.

Keep authentication centralized in:

``` text
AuthProvider
authService
api client
ProtectedRoute
GuestRoute
```

------------------------------------------------------------------------

# 26. Engineering Principles for Continued Development

Use:

-   Small, focused changes
-   Semantic theme tokens
-   Reusable components
-   Clear separation of concerns
-   Explicit state ownership
-   Server-side authorization
-   Defensive error handling
-   Accessibility-friendly controls
-   Responsive design
-   Production-oriented validation

Avoid:

-   Hard-coded theme colors when semantic variables exist
-   Large rewrites for small visual problems
-   Duplicated API clients
-   Over-abstraction
-   Premature optimization
-   Mixing unrelated refactors into feature changes

------------------------------------------------------------------------

# 27. Recommended Next Commit Boundary

The dark-mode work should form a focused commit such as:

``` text
fix(ui): improve landing page dark mode surfaces
```

Expected changed files:

``` text
client/src/components/landing/Features.jsx
client/src/components/landing/FeaturedProducts.jsx
client/src/components/landing/ProductCard.jsx
```

Before committing:

``` bash
git diff
npm run lint
npm run build
```

Then visually test both light and dark themes.

Only after verification:

``` bash
git status
git add ...
git commit -m "fix(ui): improve landing page dark mode surfaces"
git push origin main
```

------------------------------------------------------------------------

# 28. Handoff Summary

### Completed

-   Authentication architecture refactored.
-   Auth context/provider/hook separated.
-   Secure refresh-token flow retained.
-   Navbar theme switching implemented.
-   React lint issues resolved.
-   `npm run lint` passes.
-   `npm run build` passes.
-   Git working tree verified clean before starting the dark-mode task.

### In progress

-   Dark-mode visual polish for:
    -   Features
    -   Featured Products
    -   Product Cards

### Immediate next action

Modify only:

``` text
Features.jsx
FeaturedProducts.jsx
ProductCard.jsx
```

Use the existing semantic theme system.

Then run:

``` bash
npm run lint
npm run build
```

and perform visual QA in both themes.

### After dark mode

Next architectural priorities:

``` text
Axios consolidation
        ↓
Login redirect preservation
        ↓
Protected dashboard
        ↓
Product functionality
        ↓
Cart
        ↓
Checkout
        ↓
Orders
```

This is the recommended development sequence because it keeps the
project stable while gradually moving from a marketing landing page into
a real authenticated product application.
