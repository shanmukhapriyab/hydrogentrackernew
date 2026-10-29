# Deployment Instructions

Hydrogen Tracker is a full-stack application. Deploy the frontend, backend API, and MongoDB database as separate services unless your repository already provides a combined deployment configuration.

## 1. Prepare the repository
- Confirm the app runs locally using the steps in `README.md`.
- Check the frontend and backend `package.json` scripts.
- Ensure secrets and local `.env` files are excluded from Git.
- Confirm the backend accepts the production frontend origin in its CORS configuration.

## 2. Database
- Use MongoDB Atlas or a secured managed MongoDB instance for hosted deployment.
- Create a database and a database user with only the permissions required by the app.
- Set the backend's MongoDB connection variable to the provider connection string.
- Restrict network access appropriately; do not expose database credentials in frontend code.

## 3. Backend API
- Deploy the backend folder to a Node.js-compatible hosting service.
- Configure environment variables based on the names actually read by the code. Typical examples include `PORT`, `MONGODB_URI`, and `JWT_SECRET`.
- Set the start command to the script in the backend `package.json` (for example, `npm start`).
- If Socket.IO is used, ensure the host supports persistent WebSocket connections and configure allowed origins.
- Add a health-check endpoint if the application does not already have one.

## 4. Frontend
- Deploy the frontend folder to a static hosting provider that supports Vite builds.
- Set the production API base URL using the environment variable expected by the frontend source.
- Configure map-provider keys only when required. Restrict browser keys by domain and API.
- Build using the script in `package.json` (commonly `npm run build`) and publish the generated `dist` directory.

## 5. Verify deployment
- Sign in with a test account.
- Verify dashboard data, tank creation, production records, shipment/delivery workflows, map rendering, chart data, and notifications.
- Check browser console and server logs for API/CORS/WebSocket errors.
- Confirm secrets are not visible in the browser bundle or public repository.
- Test with non-sensitive demo records.

## Important
Exact provider-specific settings depend on the repository's current environment-variable names and scripts. This guide is a deployment checklist, not confirmation that a hosted instance is already deployed.
