# Credly

Credly is a Node.js/TypeScript backend for a lending app, providing wallet functionality for borrowers to request for and manage loans. This MVP supports user onboarding, loan request and management, and user and loan management by admin.

## Features

- **User Onboarding:** Users can sign up and create accounts.
- **Loan Management:** Users can request and manage their loans.
- **User Management (Admin):** Admin can approve users onboarding.
- **Loan Management (Admin):** Admin can approve and manage user loans.

## Tech Stack

- Node.js, TypeScript
- Express.js
- Mongoose
- MongoDB
- JWT (authentication)
- Joi (validation)
- Render for deployment
- Postman for API documentation

## Project Structure

- `src/` – Source code (controllers, services, repositories, entities, etc.)
  - `base/`
  - `common/`
  - `helpers/`
  - `modules/`
    - `admin/`
    - `authentication/`
    - `loan/`
    - `user/`
    - `wallet/`
  - `routes/`
  - `app.ts`
  - `index.ts`

## Getting Started

1. **Install dependencies:**

   ```sh
   npm install
   ```

2. **Configure environment variables:**  
   Copy `env.example` to `.env` and provide values for the empty variables.

3. **Start the server:**

   ```sh
   npm run dev
   ```

## Server Base URL

https://credly-v0gz.onrender.com/api/v1

## API Endpoints

- `POST /api/v1/auth/signup` – User registration
- `POST /api/v1/auth/login` – User login
- `GET /api/v1/users/me` – User get own profile
- `PATCH /api/v1/users/logout` – User logs out
- `POST /api/v1/loans` – User requests loans
- `GET /api/v1/loans` – User views all their loans
- `GET /api/v1/loans/:loanId` – User get their loans details by id
- `PATCH /api/v1/loans/:loanId` – User updates loan request
- `DELETE /api/v1/loans/:loanId` – User deletes loan request
- `GET /api/v1/admin/users` – Admin views all users
- `PATCH /api/v1/admin/users/:userId/verify` – Admin verifies and approves a user
- `GET /api/v1/admin/loans` – Admin views all loans
- `GET /api/v1/admin/loans/:loanId` – Admin get loan details by id
- `PATCH /api/v1/admin/loans/:loanId/approve` – Admin approves a loan request
- `PATCH /api/v1/health` – Server health check

## Postman Docs

https://www.postman.com/goodness-chukwudi-public/my-public-space/collection/26100881-0c861fd9-f2fa-4951-8773-27d4679d93c7

## License

ISC

---

**Author:** Chukwudi Ibeche
