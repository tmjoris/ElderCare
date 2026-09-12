# ElderCare client

The React frontend, built with Vite and Material UI, deployed to Render as a
static site.

## Running it locally

```
npm install
npm run dev
```

The dev server listens on port 5173, which is the origin the backend allows by
default, so a locally running API needs no extra configuration.

## Configuration

One variable, read at build time:

| Variable | Purpose | Default |
| --- | --- | --- |
| `VITE_API_URL` | Base URL of the backend, with no trailing slash | `http://localhost:8080` |

Vite inlines this into the bundle when the site is built, so changing it on
Render requires a redeploy rather than a restart. The name has to begin with
`VITE_`, because Vite refuses to expose anything else to client code.

For a local build against a deployed API:

```
VITE_API_URL=https://your-backend.onrender.com npm run build
```

## How a request works

`src/api.js` is imported once from `main.jsx` and installs two axios
interceptors that apply to every call in the application.

The request interceptor reads the token from local storage and attaches it as
`Authorization: Bearer <token>`. The pages call `axios` directly rather than
going through a shared client, so doing this globally means no call site has to
remember it.

The response interceptor watches for 401. A 401 means the token is missing,
expired, or signed with a key the server no longer holds. When one arrives the
stored session is cleared and the browser is sent to the login page, instead of
leaving the user on a dashboard where every request quietly fails.

Login itself lives in `src/pages/LoginPage.jsx`. It posts `username` and
`password` to `/api/users/login`, and on success stores the token, the role and
the username through `storeSession`, then routes by role.

## Why login was broken

`src/config.jsx` read `import.meta.env.REACT_APP_API_URL`. That name is a
create-react-app convention, and this project moved to Vite in an earlier
commit. Vite only exposes variables prefixed with `VITE_`, and it performs the
substitution statically at build time, so the expression was replaced with
`undefined`. The deployed bundle contained `ut=void 0`.

Every request therefore went to `undefined/api/users/login`. A browser resolves
that against the current origin, so the real request was for
`https://eldercarekali.onrender.com/undefined/api/users/login`, the static host
answered 404, and the page reported "Login failed" without ever reaching the
API. The catch block treated every error the same way, so nothing on screen
distinguished a wrong password from a request that never arrived.

Three changes followed. The variable is now `VITE_API_URL` with a local
fallback, and a production build without it logs an explicit error rather than
failing silently. The login handler separates a 401 from a request that got no
response, and says which happened. `src/services/auth.jsx` has been deleted: it
held a parallel mock login with hardcoded users, pointed at `localhost:5000/api`
and at endpoint paths the backend does not have, and nothing imported it.

A second problem sat behind the first. The backend issues the role `nurse`,
while the routing table only knew `caregiver`. A nurse who logged in fell
through to the patient dashboard, which rejected the role and sent them back to
login, so a successful sign in still looked like a failure. Both names now
resolve to the caregiver dashboard.

## Deep links and page refresh

A single page application serves every path from `index.html`. Without a rewrite
rule, opening `/login` directly returns 404, because no file exists at that
path. Only the home page worked, and only until the first refresh.

`public/_redirects` now holds the rule, and `render.yaml` in the repository root
declares the same thing for a blueprint deploy. The `static.json` that used to
be here was a Heroku convention that Render never read.

## Known gaps

The token is kept in local storage, which is readable by any script running on
the page. A cookie marked `HttpOnly` would be the safer place for it, and would
require the backend to set and read it.

Role checks in `App.jsx` decide only which route renders. They are a
convenience, not a control: the server is what actually enforces access, and it
does so on every request.
