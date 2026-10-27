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

Collections: `users`, `farmerProfiles`, `products`, `orders`, `carts`, `savedProducts`, `notifications`.

## Demo features

- **Payment:** checkout offers a demo card form or pay-on-delivery. No real money moves. Any number with at least one digit (up to 19 digits) is accepted without a checksum check. `4000 0000 0000 0002` simulates a decline and `4000 0000 0000 9995` simulates insufficient funds; other entries simulate success. Only the card brand and last 4 digits are stored.
- **Stock:** each product has a stock count. Checkout takes stock in a Firestore transaction, and cancelling an order puts it back. Products without a count are treated as unlimited.
- **Photos:** farmers upload a photo that is resized in the browser and stored on the product document.
- **Notifications:** a live bell on the buyer and farmer dashboards for new orders, status changes and cancellations.
- **Cancellation:** buyers can cancel pending orders. Farmers can decline pending orders that contain only their products.

## Deploy

Deployed on Vercel. `vercel.json` rewrites all routes to the SPA entry.
