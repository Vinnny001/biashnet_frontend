# Biashnet Frontend

React + Vite frontend for Biashnet. This app uses React Router, Axios, MUI, and React Context.

The frontend does not import Firebase client packages and does not call Firestore directly. All data access goes through the backend REST API configured by `VITE_API_BASE_URL`.

## Development

```bash
cd frontend
npm install
npm run dev
```

Default URL: `http://localhost:5173`

## Production Build

```bash
cd frontend
npm run build
npm run preview
```

Set `VITE_API_BASE_URL` to your production backend API URL before building.
