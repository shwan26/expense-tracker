# Expense Tracker

A minimal React + Vite expense tracking starter using Tailwind CSS, Chart.js and Firebase.

Quick start
1. git clone https://github.com/shwan26/expense-tracker.git
2. cd expense-tracker
3. npm install
4. npm run dev
Open the URL printed by Vite (usually http://localhost:5173).

Useful scripts
```
npm run dev — start dev server
npm run build — production build
npm run preview — serve built app
npm run lint — run ESLint
```

Install packages
```
npm install tailwindcss @tailwindcss/vite 
```
```
npm install @dicebear/core @dicebear/collection`
``


Env
Create a .env.local and add VITE_ prefixed vars for Firebase (e.g. VITE_FIREBASE_API_KEY). The repo ignores .env and .env.local.
Example `.env.local` (do NOT commit this file):
```
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Stack
Vite · React · Tailwind CSS v4 · Chart.js · Firebase · Headless UI

License
No license specified — add a LICENSE file to make reuse explicit.
