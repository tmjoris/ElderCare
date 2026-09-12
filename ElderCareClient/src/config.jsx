// Vite only exposes environment variables whose names begin with VITE_. This
// file previously read import.meta.env.REACT_APP_API_URL, a name left over from
// create-react-app, which Vite replaced with undefined at build time. The
// deployed bundle contained `ut=void 0` and every request went to
// "undefined/api/...", which the browser resolved against the site origin and
// the server answered with 404.
//
// The fallback keeps local development working with no .env file present.
const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';

if (!import.meta.env.VITE_API_URL && import.meta.env.PROD) {
  // A production build with no API URL configured is the failure described
  // above. Say so in the console rather than letting requests 404 silently.
  console.error(
    'VITE_API_URL is not set. The site will not reach the backend. ' +
    'Set it in the Render dashboard under Environment, then redeploy.'
  );
}

export default apiUrl;
