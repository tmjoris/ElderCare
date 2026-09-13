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

## Deep links and page refresh

A single page application serves every path from `index.html`. Render needs that
rule in its own configuration rather than in a file in the build output. It is
declared in `render.yaml` as a route of type `rewrite` from `/*` to
`/index.html`, and set on the site under Redirects and Rewrites with status 200.
A 301 would send the browser to a different URL, which is not what a single page
application wants.

Two conventions do not work here. `static.json` is a Heroku file that Render
never reads, and a `_redirects` file is the Netlify convention, which Render
serves as an ordinary static asset. The second is easy to mistake for success,
because fetching `/_redirects` returns 200 while `/login` still returns 404.

## Known gaps

The token is kept in local storage, which is readable by any script running on
the page. A cookie marked `HttpOnly` would be the safer place for it, and would
require the backend to set and read it.

Role checks in `App.jsx` decide only which route renders. They are a
convenience, not a control: the server is what actually enforces access, and it
does so on every request.
