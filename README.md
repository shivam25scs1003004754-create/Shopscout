# Offline Shop Recommender — GitHub-ready Starter

## What this repo contains (starter)
- `frontend/` — React + Vite single-page app (simple search + dashboard UI)
- `server/` — Express server with CSV-based store database, upload endpoints, search/filter endpoint, simple message-forwarding simulation
- `stores.csv` — sample "Excel-style" database (CSV you can open in Excel)
- `.gitignore`, `package.json` (root scripts to run both frontend & server)

## Features implemented in this starter
- Customer search (frontend) -> `/api/search` (server) which filters & ranks stores.
- Store dashboard page to register/store data (frontend) -> `/api/register-store` (server).
- CSV-based "database" (`stores.csv`) so you can open and edit it with Excel.
- Simple message-forwarding simulation endpoint `/api/message` (demonstrates forwarding to shopkeepers).

## Tech stack choices & notes
- Frontend: React (Vite) + Tailwind (minimal setup included).
- Backend: Node + Express. Data stored in `stores.csv` so it's editable in Excel.
- Authentication: NOT included (starter). For production use, add Firebase Auth, Auth0, or similar.
- Real-time chat: Not implemented as full websockets here — `/api/message` simulates message forwarding. For production add Socket.IO or Firebase Realtime DB.

## How to run (local)
Requirements: Node 18+, npm
1. Clone repo
2. Install: `npm install`
3. Start server: `npm run start:server`
4. Start frontend: `npm run start:frontend`
5. Open `http://localhost:5173` (frontend)

## Using Excel as DB
- `stores.csv` is the source of truth for store data. Open in Excel, edit rows and save as CSV.
- The server reads `stores.csv` on each search request (simple approach for demo). For production, use a proper DB (Firestore, Postgres).

## How this maps to your requirements
- Filters implemented in `/api/search`: distance, brand, price range, category, shop type, availability_time, after_sale_services, rating.
- Sorting: by rating (descending) then distance (ascending) — matches "best review shown first" with distance tie-break.
- Dashboard: simple form to register store & upload CSV in the starter. Produces new rows in `stores.csv`.

## Next steps / Production suggestions
- Add authentication (store owners & customers).
- Replace CSV with Firestore / Postgres for concurrency and scale.
- Add real-time chat using Socket.IO or Firebase Realtime Database.
- Geolocation: compute distance server-side using lat/lng; here we accept numeric "distance_km" in CSV.

