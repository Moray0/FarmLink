# FarmLink

A marketplace connecting farmers and buyers. Built with React, Vite, Tailwind CSS and Firebase (Auth + Firestore).

## Roles

- **Buyer**: browses the marketplace, saves a cart, places orders.
- **Farmer**: lists products and moves orders through Pending, Processing and Completed.
- **Admin**: approves farmers and manages users. The admin account is the email in `src/auth/roles.js` (keep it in sync with `firestore.rules`).

## Setup

```bash
npm install
cp .env.example .env   # then fill in your Firebase web app config
npm run dev
```

## Scripts

- `npm run dev` start the dev server
- `npm run build` production build
- `npm run lint` run Oxlint

## Firestore rules

Security rules live in `firestore.rules` and must be published for the app to work:

```bash
firebase deploy --only firestore:rules
```

Collections: `users`, `farmerProfiles`, `products`, `orders`, `carts`, `savedProducts`.

## Deploy

Deployed on Vercel. `vercel.json` rewrites all routes to the SPA entry.
