# Fernando Acosta — React Dashboard (Vite)

React + Vite frontend for a lightweight dashboard used alongside Amazon Connect workflows (tables, pagination, exports) and a backend API (Node/Express) tested via Postman.

## What this app does
- Displays tabular data (details table) with pagination
- Supports CSV export of table data
- Calls an AWS ApiKey Gateway backend API that requires an API key header
- Built and deployed as a static site (S3) behind CloudFront

## Tech Stack
- React + Vite
- Material UI (MUI)
- Node/Express API (backend)
- AWS S3 + CloudFront (hosting)

## Getting Started

### Prerequisites
- Node.js 18+ recommended
- npm

### Install
```bash
npm install
