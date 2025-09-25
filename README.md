# Notes SaaS App

A multi-tenant SaaS notes application built with React and Node.js.

## Features

- Multi-tenant architecture with strict data isolation
- JWT-based authentication
- Role-based access control (Admin/Member)
- Subscription plans (Free/Pro) with usage limits
- Full CRUD operations for notes
- Responsive web interface

## Tech Stack

- **Frontend**: React.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Deployment**: Vercel
- **Authentication**: JWT tokens

## Live Demo

- **Frontend**: [https://frontend-mcjsi5rjo-vaishnavis-projects-7f81f1d8.vercel.app](https://frontend-mcjsi5rjo-vaishnavis-projects-7f81f1d8.vercel.app)
- **Backend API**: [https://backend-2pls5xjb5-vaishnavis-projects-7f81f1d8.vercel.app](https://backend-2pls5xjb5-vaishnavis-projects-7f81f1d8.vercel.app)

## Test Accounts

All accounts use password: `password`

**ACME Corporation:**
- admin@acme.test (Admin)
- user@acme.test (Member)

**Globex Corporation:**
- admin@globex.test (Admin)
- user@globex.test (Member)

## Quick Start

### Backend Setup

```bash
cd backend
npm install
node scripts/seedData.js  # Seed test data
npm start
```

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

## API Endpoints

- `GET /health` - Health check
- `POST /auth/login` - User login
- `GET /notes` - List notes
- `POST /notes` - Create note
- `PUT /notes/:id` - Update note
- `DELETE /notes/:id` - Delete note
- `POST /tenants/:slug/upgrade` - Upgrade subscription (Admin)

## Deployment

Both frontend and backend are configured for Vercel deployment with included `vercel.json` files.

## License

MIT