# Backend (Express)

Small notes for running & deploying the backend.

## Required env vars
- `PORT` (defaults to 4000)
- `MONGO_URI` (MongoDB connection string)
- `JWT_SECRET` (strong random secret)
- `JWT_EXPIRES_IN` (optional, `7d` default)
- `EMAIL_USER`, `EMAIL_PASS` (for sending emails)
- `FRONTEND_URL` (set to your frontend origin, e.g. `https://mysite.com`)
- Cloudinary: `CLOUDINARY_*` vars

See `.env.example` in this folder for a template.

## Dev
- npm install
- npm run dev (uses nodemon)

## Health check
- GET `/health` will return `{ status: 'ok' }`.

## Notes
- CORS is configured to allow only `FRONTEND_URL` if set (falls back to `*` for local development).  Ensure you set `FRONTEND_URL` in production.
- When deploying, set env vars in your host (Render, Heroku, etc.) and restart the service.